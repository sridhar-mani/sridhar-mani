import { useRef, useMemo, useState, useEffect, useCallback, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { MouseState } from '@/hooks/useMouseVelocity';

// Custom vertex shader for fluid space-time distortion
const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDistortionScale;
  uniform vec2 uMouseVelocity;
  uniform float uPulse;
  uniform float uWarpMode; // 0 = fluid liquid, 1 = singularity vortex
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vNormal = normal;
    vPosition = position;
    
    // Base fluid noise
    float baseNoise = snoise(position * 1.5 + uTime * 0.35);
    
    // Dynamic mouse velocity wave
    float velocityInfluence = length(uMouseVelocity) * uSpeed * 1.6;
    float velocityNoise = snoise(position * 2.2 + vec3(uMouseVelocity * 5.0, uTime * 0.5));
    
    // Liquid shockwave on morph / click
    float ripple = sin(length(position.xy - uMouseVelocity * 0.5) * 8.0 - uTime * 3.2) * velocityInfluence * 0.12;
    float pulseDistortion = sin(uPulse * 6.28) * 0.35 * snoise(position * 3.5);
    
    // Dimensional vortex swirl
    float angle = atan(position.y, position.x);
    float vortexTwist = sin(angle * 3.0 + uTime * 2.0) * uWarpMode * 0.2;
    
    float totalDistortion = baseNoise * uDistortionScale + velocityNoise * velocityInfluence * 0.5 + ripple + pulseDistortion + vortexTwist;
    float breathe = sin(uTime * 0.8) * 0.03 + sin(uTime * 1.4) * 0.015;
    
    vec3 newPosition = position + normal * (totalDistortion * 0.22 + breathe);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    vec3 color = mix(uColorA, uColorB, fresnel);
    gl_FragColor = vec4(color, 0.88);
  }
`;

export interface OrbPalette {
  name: string;
  primary: string;
  attenuation: string;
  glow: string;
  shaderA: [number, number, number];
  shaderB: [number, number, number];
}

export const ORB_PALETTES: OrbPalette[] = [
  {
    name: 'Cyberpunk Cyan',
    primary: '#00D9FF',
    attenuation: '#A78BFA',
    glow: '#06b6d4',
    shaderA: [0.0, 0.85, 1.0],
    shaderB: [0.65, 0.55, 0.98],
  },
  {
    name: 'Event Horizon (Vortex)',
    primary: '#8B5CF6',
    attenuation: '#EC4899',
    glow: '#A855F7',
    shaderA: [0.54, 0.36, 0.96],
    shaderB: [0.95, 0.18, 0.55],
  },
  {
    name: 'Solar Supernova',
    primary: '#FF6B00',
    attenuation: '#FF007A',
    glow: '#FB923C',
    shaderA: [1.0, 0.42, 0.0],
    shaderB: [1.0, 0.0, 0.48],
  },
  {
    name: 'Emerald Singularity',
    primary: '#10B981',
    attenuation: '#06B6D4',
    glow: '#34D399',
    shaderA: [0.06, 0.72, 0.5],
    shaderB: [0.02, 0.71, 0.83],
  },
  {
    name: 'Hyper Chrome Prism',
    primary: '#E2E8F0',
    attenuation: '#38BDF8',
    glow: '#38BDF8',
    shaderA: [0.88, 0.91, 0.94],
    shaderB: [0.22, 0.74, 0.97],
  },
  {
    name: 'Cosmic Gold',
    primary: '#F59E0B',
    attenuation: '#EF4444',
    glow: '#FCD34D',
    shaderA: [0.96, 0.62, 0.04],
    shaderB: [0.93, 0.26, 0.26],
  },
];

// Generates a soft glowing circular particle texture in-memory to eliminate square artifacts
function createGlowingDotTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Awwwards-tier Accretion Disk / Cosmic Ring of Glowing Circular Stardust Particles
const AccretionRing = ({ color }: { color: string }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const dotTexture = useMemo(() => createGlowingDotTexture(), []);

  const [positions, scales] = useMemo(() => {
    const count = 320;
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 2.3 + Math.random() * 1.1;
      const angle = Math.random() * Math.PI * 2;
      const yOffset = (Math.random() - 0.5) * 0.4;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = yOffset;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      scl[i] = Math.random() * 0.05 + 0.02;
    }
    return [pos, scl];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.16;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.14 + 0.25;
      pointsRef.current.rotation.z = Math.cos(time * 0.08) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        map={dotTexture}
        color={color}
        transparent={true}
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

interface LiquidOrbMeshProps {
  mouseStateRef: RefObject<MouseState>;
  palette: OrbPalette;
  pulseTrigger: number;
  onRandomize: () => void;
}

const LiquidOrbMesh = ({ mouseStateRef, palette, pulseTrigger, onRandomize }: LiquidOrbMeshProps) => {
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const distortionMeshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const transmissionRef = useRef<any>(null);

  const smoothPosition = useRef({ x: 0, y: 0 });
  const pulseValue = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0 },
    uDistortionScale: { value: 0.4 },
    uMouseVelocity: { value: new THREE.Vector2(0, 0) },
    uPulse: { value: 0 },
    uWarpMode: { value: 1.0 },
    uColorA: { value: new THREE.Vector3(...palette.shaderA) },
    uColorB: { value: new THREE.Vector3(...palette.shaderB) },
  }), []);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColorA.value.set(...palette.shaderA);
      materialRef.current.uniforms.uColorB.value.set(...palette.shaderB);
    }
  }, [palette]);

  useEffect(() => {
    if (pulseTrigger > 0) {
      pulseValue.current = 1.0;
    }
  }, [pulseTrigger]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const mouseState = mouseStateRef.current;

    if (pulseValue.current > 0.01) {
      pulseValue.current = THREE.MathUtils.lerp(pulseValue.current, 0, 0.045);
    } else {
      pulseValue.current = 0;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uPulse.value = pulseValue.current;
      materialRef.current.uniforms.uSpeed.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uSpeed.value,
        mouseState.speed * 1.5 + pulseValue.current * 2.4,
        0.08
      );
      materialRef.current.uniforms.uDistortionScale.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uDistortionScale.value,
        0.4 + mouseState.speed * 0.16 + pulseValue.current * 0.6,
        0.05
      );
      materialRef.current.uniforms.uMouseVelocity.value.set(
        mouseState.velocityX,
        mouseState.velocityY
      );
    }

    const targetX = mouseState.x * 0.16;
    const targetY = mouseState.y * 0.12;

    smoothPosition.current.x = THREE.MathUtils.lerp(smoothPosition.current.x, targetX, 0.025);
    smoothPosition.current.y = THREE.MathUtils.lerp(smoothPosition.current.y, targetY, 0.025);

    if (innerMeshRef.current) {
      innerMeshRef.current.position.x = smoothPosition.current.x;
      innerMeshRef.current.position.y = smoothPosition.current.y;
      innerMeshRef.current.rotation.x = Math.sin(time * 0.14) * 0.1;
      innerMeshRef.current.rotation.y = time * 0.07;
    }

    if (distortionMeshRef.current) {
      distortionMeshRef.current.position.x = THREE.MathUtils.lerp(
        distortionMeshRef.current.position.x,
        smoothPosition.current.x,
        0.018
      );
      distortionMeshRef.current.position.y = THREE.MathUtils.lerp(
        distortionMeshRef.current.position.y,
        smoothPosition.current.y,
        0.018
      );
      distortionMeshRef.current.rotation.x = Math.sin(time * 0.14) * 0.1;
      distortionMeshRef.current.rotation.y = time * 0.07;
    }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); onRandomize(); }}>
      {/* Soft circular glowing stardust ring */}
      <AccretionRing color={palette.primary} />

      {/* Main liquid glass orb with high refraction */}
      <mesh ref={innerMeshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 28]} />
        <MeshTransmissionMaterial
          ref={transmissionRef}
          backside
          samples={10}
          thickness={0.55}
          chromaticAberration={0.38}
          anisotropy={0.35}
          distortion={0.52}
          distortionScale={0.25}
          temporalDistortion={0.12}
          iridescence={1}
          iridescenceIOR={1.1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor={palette.attenuation}
          color={palette.primary}
          metalness={0.6}
          roughness={0.08}
        />
      </mesh>

      {/* Swirling space-time distortion layer */}
      <mesh ref={distortionMeshRef} scale={1.86}>
        <icosahedronGeometry args={[1, 28]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Atmospheric glow */}
      <mesh scale={2.25}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial
          color={palette.glow}
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

interface GlowingOrbProps {
  mouseStateRef: RefObject<MouseState>;
  currentPaletteIndex?: number;
  onPaletteChange?: (palette: OrbPalette, index: number) => void;
}

export const GlowingOrb = ({
  mouseStateRef,
  currentPaletteIndex = 0,
  onPaletteChange,
}: GlowingOrbProps) => {
  const [paletteIndex, setPaletteIndex] = useState(currentPaletteIndex);
  const [pulseCount, setPulseCount] = useState(0);

  const activePalette = ORB_PALETTES[paletteIndex] || ORB_PALETTES[0];

  const handleRandomize = useCallback(() => {
    setPaletteIndex((prev) => {
      let nextIndex = (prev + 1) % ORB_PALETTES.length;
      if (onPaletteChange) {
        onPaletteChange(ORB_PALETTES[nextIndex], nextIndex);
      }
      return nextIndex;
    });
    setPulseCount((c) => c + 1);
  }, [onPaletteChange]);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onClick={handleRandomize}
        className="cursor-pointer"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={1.3} />
        <pointLight position={[2, 2, 2]} color={activePalette.primary} intensity={2.2} distance={10} />
        <pointLight position={[-2, -2, 2]} color={activePalette.attenuation} intensity={1.6} distance={10} />

        <Environment preset="city" />

        <LiquidOrbMesh
          mouseStateRef={mouseStateRef}
          palette={activePalette}
          pulseTrigger={pulseCount}
          onRandomize={handleRandomize}
        />
      </Canvas>
    </div>
  );
};
