/// <reference lib="webworker" />
import * as THREE from 'three';

interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
}

type InitMessage = {
  type: 'init';
  canvas: OffscreenCanvas;
  width: number;
  height: number;
  dpr: number;
};

type ResizeMessage = {
  type: 'resize';
  width: number;
  height: number;
  dpr: number;
};

type MouseMessage = {
  type: 'mouse';
  mouse: MouseState;
};

type DisposeMessage = {
  type: 'dispose';
};

type OrbWorkerMessage = InitMessage | ResizeMessage | MouseMessage | DisposeMessage;

const vertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uDistortionScale;
  uniform vec2 uMouseVelocity;

  varying vec3 vNormal;

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

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
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

    float baseNoise = snoise(position * 1.5 + uTime * 0.3);
    float velocityInfluence = length(uMouseVelocity) * uSpeed * 1.5;
    float velocityNoise = snoise(position * 2.0 + vec3(uMouseVelocity * 5.0, uTime * 0.5));
    float ripple = sin(length(position.xy - uMouseVelocity * 0.5) * 8.0 - uTime * 3.0) * velocityInfluence * 0.1;

    float totalDistortion = baseNoise * uDistortionScale + velocityNoise * velocityInfluence * 0.5 + ripple;
    float breathe = sin(uTime * 0.8) * 0.03 + sin(uTime * 1.3) * 0.01;

    vec3 newPosition = position + normal * (totalDistortion * 0.2 + breathe);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec3 vNormal;

  void main() {
    vec3 color = vec3(0.0, 0.85, 1.0);
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    color = mix(color, vec3(0.65, 0.55, 0.98), fresnel);
    gl_FragColor = vec4(color, 0.9);
  }
`;

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;

let innerMesh: THREE.Mesh | null = null;
let distortionMesh: THREE.Mesh | null = null;
let distortionMaterial: THREE.ShaderMaterial | null = null;

const clock = new THREE.Clock();
let disposed = false;

const currentMouse: MouseState = {
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  speed: 0,
};

const smoothPosition = { x: 0, y: 0 };

function createScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const cyanLight = new THREE.PointLight(0x00d9ff, 2, 10);
  cyanLight.position.set(2, 2, 2);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0xa78bfa, 1.5, 10);
  purpleLight.position.set(-2, -2, 2);
  scene.add(purpleLight);

  const geometry = new THREE.IcosahedronGeometry(1, 32);

  const transmissionMaterial = new THREE.MeshPhysicalMaterial({
    color: '#00D9FF',
    metalness: 0.6,
    roughness: 0.1,
    transmission: 1,
    thickness: 0.5,
    clearcoat: 1,
    iridescence: 1,
    iridescenceIOR: 1,
    iridescenceThicknessRange: [0, 1400],
    attenuationDistance: 0.5,
    attenuationColor: '#A78BFA',
    transparent: true,
    opacity: 0.95,
  });

  innerMesh = new THREE.Mesh(geometry, transmissionMaterial);
  innerMesh.scale.setScalar(1.8);
  scene.add(innerMesh);

  distortionMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 0 },
      uDistortionScale: { value: 0.4 },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
    },
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  distortionMesh = new THREE.Mesh(geometry.clone(), distortionMaterial);
  distortionMesh.scale.setScalar(1.85);
  scene.add(distortionMesh);

  const glowMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      color: '#06b6d4',
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    })
  );
  glowMesh.scale.setScalar(2.2);
  scene.add(glowMesh);
}

function animate() {
  if (disposed || !renderer || !scene || !camera || !innerMesh || !distortionMesh || !distortionMaterial) {
    return;
  }

  const time = clock.getElapsedTime();

  distortionMaterial.uniforms.uTime.value = time;
  distortionMaterial.uniforms.uSpeed.value = THREE.MathUtils.lerp(
    distortionMaterial.uniforms.uSpeed.value,
    currentMouse.speed * 1.5,
    0.08
  );
  distortionMaterial.uniforms.uDistortionScale.value = THREE.MathUtils.lerp(
    distortionMaterial.uniforms.uDistortionScale.value,
    0.4 + currentMouse.speed * 0.15,
    0.05
  );
  (distortionMaterial.uniforms.uMouseVelocity.value as THREE.Vector2).set(
    currentMouse.velocityX,
    currentMouse.velocityY
  );

  const targetX = currentMouse.x * 0.15;
  const targetY = currentMouse.y * 0.12;

  smoothPosition.x = THREE.MathUtils.lerp(smoothPosition.x, targetX, 0.02);
  smoothPosition.y = THREE.MathUtils.lerp(smoothPosition.y, targetY, 0.02);

  innerMesh.position.x = smoothPosition.x;
  innerMesh.position.y = smoothPosition.y;
  innerMesh.rotation.x = Math.sin(time * 0.12) * 0.08;
  innerMesh.rotation.y = time * 0.06;

  distortionMesh.position.x = THREE.MathUtils.lerp(distortionMesh.position.x, smoothPosition.x, 0.015);
  distortionMesh.position.y = THREE.MathUtils.lerp(distortionMesh.position.y, smoothPosition.y, 0.015);
  distortionMesh.rotation.x = Math.sin(time * 0.12) * 0.08;
  distortionMesh.rotation.y = time * 0.06;

  renderer.render(scene, camera);
}

function setSize(width: number, height: number, dpr: number) {
  if (!renderer || !camera) {
    return;
  }

  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);

  renderer.setPixelRatio(Math.min(dpr, 2));
  renderer.setSize(safeWidth, safeHeight, false);
  camera.aspect = safeWidth / safeHeight;
  camera.updateProjectionMatrix();
}

function init(message: InitMessage) {
  disposed = false;

  renderer = new THREE.WebGLRenderer({
    canvas: message.canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  createScene();
  setSize(message.width, message.height, message.dpr);
  renderer.setAnimationLoop(animate);
}

function dispose() {
  disposed = true;

  if (renderer) {
    renderer.setAnimationLoop(null);
  }

  if (scene) {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else if (mesh.material) {
        mesh.material.dispose();
      }
    });

    scene.clear();
  }

  if (renderer) {
    renderer.dispose();
  }

  renderer = null;
  scene = null;
  camera = null;
  innerMesh = null;
  distortionMesh = null;
  distortionMaterial = null;
}

self.onmessage = (event: MessageEvent<OrbWorkerMessage>) => {
  const data = event.data;

  if (data.type === 'init') {
    init(data);
    return;
  }

  if (data.type === 'resize') {
    setSize(data.width, data.height, data.dpr);
    return;
  }

  if (data.type === 'mouse') {
    currentMouse.x = data.mouse.x;
    currentMouse.y = data.mouse.y;
    currentMouse.velocityX = data.mouse.velocityX;
    currentMouse.velocityY = data.mouse.velocityY;
    currentMouse.speed = data.mouse.speed;
    return;
  }

  if (data.type === 'dispose') {
    dispose();
  }
};
