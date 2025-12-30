import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Custom shader for liquid distortion
const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDistortionScale;
  uniform vec2 uMouseVelocity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  // Simplex noise function
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
  
  void main() {
    vNormal = normal;
    vPosition = position;
    
    // Base noise
    float baseNoise = snoise(position * 1.5 + uTime * 0.3);
    
    // Velocity-influenced distortion (enhanced)
    float velocityInfluence = length(uMouseVelocity) * uSpeed * 1.5;
    float velocityNoise = snoise(position * 2.0 + vec3(uMouseVelocity * 5.0, uTime * 0.5));
    
    // Additional ripple effect based on velocity
    float ripple = sin(length(position.xy - uMouseVelocity * 0.5) * 8.0 - uTime * 3.0) * velocityInfluence * 0.1;
    
    // Combine distortions
    float totalDistortion = baseNoise * uDistortionScale + velocityNoise * velocityInfluence * 0.5 + ripple;
    
    // Apply breathing effect (enhanced)
    float breathe = sin(uTime * 0.8) * 0.03 + sin(uTime * 1.3) * 0.01;
    
    vec3 newPosition = position + normal * (totalDistortion * 0.2 + breathe);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    // Simple gradient based on normal for the custom shader layer
    vec3 color = vec3(0.0, 0.85, 1.0); // Vibrant Cyan
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    color = mix(color, vec3(0.65, 0.55, 0.98), fresnel); // Lighter Purple at edges
    
    gl_FragColor = vec4(color, 0.9);
  }
`;

interface LiquidOrbMeshProps {
  mouseState: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    speed: number;
  };
}

const LiquidOrbMesh = ({ mouseState }: LiquidOrbMeshProps) => {
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const distortionMeshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Smoothed position values for ultra-smooth movement
  const smoothPosition = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0 },
    uDistortionScale: { value: 0.4 },
    uMouseVelocity: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Update shader uniforms
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uSpeed.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uSpeed.value,
        mouseState.speed * 1.5,
        0.08
      );
      materialRef.current.uniforms.uDistortionScale.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uDistortionScale.value,
        0.4 + mouseState.speed * 0.15,
        0.05
      );
      materialRef.current.uniforms.uMouseVelocity.value.set(
        mouseState.velocityX,
        mouseState.velocityY
      );
    }

    // Ultra-smooth position interpolation for inner orb only
    // Very subtle movement - only 0.15 multiplier for slight effect
    const targetX = mouseState.x * 0.15;
    const targetY = mouseState.y * 0.12;
    
    // Very slow lerp (0.02) for smooth, floaty movement
    smoothPosition.current.x = THREE.MathUtils.lerp(
      smoothPosition.current.x,
      targetX,
      0.02
    );
    smoothPosition.current.y = THREE.MathUtils.lerp(
      smoothPosition.current.y,
      targetY,
      0.02
    );

    // Apply to inner mesh only
    if (innerMeshRef.current) {
      innerMeshRef.current.position.x = smoothPosition.current.x;
      innerMeshRef.current.position.y = smoothPosition.current.y;
      
      // Gentle rotation
      innerMeshRef.current.rotation.x = Math.sin(time * 0.12) * 0.08;
      innerMeshRef.current.rotation.y = time * 0.06;
    }
    
    // Distortion layer follows inner mesh but with slight delay
    if (distortionMeshRef.current) {
      distortionMeshRef.current.position.x = THREE.MathUtils.lerp(
        distortionMeshRef.current.position.x,
        smoothPosition.current.x,
        0.015
      );
      distortionMeshRef.current.position.y = THREE.MathUtils.lerp(
        distortionMeshRef.current.position.y,
        smoothPosition.current.y,
        0.015
      );
      distortionMeshRef.current.rotation.x = Math.sin(time * 0.12) * 0.08;
      distortionMeshRef.current.rotation.y = time * 0.06;
    }
  });

  return (
    <group>
      {/* Main liquid chrome orb - moves with mouse */}
      <mesh ref={innerMeshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.5}
          chromaticAberration={0.3}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.2}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#A78BFA" // Lighter purple
          color="#00D9FF" // Vibrant cyan
          metalness={0.6} // Reduced metalness for lighter feel
          roughness={0.1}
        />
      </mesh>

      {/* Distortion layer - follows inner with delay */}
      <mesh ref={distortionMeshRef} scale={1.85}>
        <icosahedronGeometry args={[1, 64]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow - stays static */}
      <mesh scale={2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

interface GlowingOrbProps {
  mouseState: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    speed: number;
  };
}

export const GlowingOrb = ({ mouseState }: GlowingOrbProps) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >

        
        {/* Lighting - Brighter for light theme */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[2, 2, 2]} color="#00D9FF" intensity={2} distance={10} />
        <pointLight position={[-2, -2, 2]} color="#A78BFA" intensity={1.5} distance={10} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
        
        <LiquidOrbMesh mouseState={mouseState} />
      </Canvas>
    </div>
  );
};
