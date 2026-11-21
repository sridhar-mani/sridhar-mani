import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as THREE from 'three';

/**
 * FlowField: one persistent, GPU-computed particle layer behind the whole site, drawn as "ink on paper".
 *
 * - Every particle is advected through a live flow field (drawn as velocity streaks).
 * - On each route, ~70% of the particles assemble into a shape that means something for that page: an AI agent
 *   (robot), a syntax tree (code), a neural network, the skills globe, a paper plane (contact), and on the
 *   Universe page all five at once, linked by threads of flow. The rest keep streaming around the shape.
 * - Navigating morphs the particles from one model to the next. Scrolling dissolves the model back into the
 *   flow so the content stays readable.
 * - Pure decoration: pointer-events none, aria-hidden. Honours prefers-reduced-motion (calm mode, with a toggle).
 */

type ModelName = 'xbot' | 'ast' | 'nn' | 'plane' | 'globe' | 'finale';
type Scene = { model: ModelName | null; r: number; tilt: [number, number]; lift: number; x?: number; name?: boolean };

// route -> the shape the particles become. r = radius in world units, tilt = [about X, about Z] (radians).
const SCENES: Record<string, Scene> = {
  '/': { model: 'xbot', r: 6.6, tilt: [0.0, 0.0], lift: 0.4, x: 0.46 },                // an AI agent
  '/work': { model: 'ast', r: 6.6, tilt: [0.1, 0.0], lift: 0.5 },                      // code, as an abstract syntax tree
  '/experience': { model: 'nn', r: 7.2, tilt: [0.12, 0.2], lift: 0 },                  // a neural network
  '/skills': { model: 'globe', r: 5.8, tilt: [0, 0], lift: 0 },                        // the stack, in orbit
  '/contact': { model: 'plane', r: 5.6, tilt: [0.35, -0.25], lift: 0 },                // send a message
  // the home page is a scroll story: each [data-scene] section picks one of these
  '#name': { model: null, r: 6, tilt: [0, 0], lift: 0, name: true },
  '#xbot': { model: 'xbot', r: 6.6, tilt: [0, 0], lift: 0.2, x: 0.42 },
  '#ast': { model: 'ast', r: 6.6, tilt: [0.1, 0], lift: 0.3, x: 0.42 },
  '#nn': { model: 'nn', r: 7.2, tilt: [0.12, 0.2], lift: 0, x: 0.42 },
  '#globe': { model: 'globe', r: 5.8, tilt: [0, 0], lift: 0, x: 0.42 },
  '#plane': { model: 'plane', r: 5.6, tilt: [0.35, -0.25], lift: 0, x: 0.42 },
};

// the five shapes of the finale, in ring order, and the page each one opens
const FINALE = [
  { m: 'xbot' as ModelName, to: '/', label: 'Agents' },
  { m: 'ast' as ModelName, to: '/work', label: 'Code' },
  { m: 'nn' as ModelName, to: '/experience', label: 'Models' },
  { m: 'globe' as ModelName, to: '/skills', label: 'Stack' },
  { m: 'plane' as ModelName, to: '/contact', label: 'You' },
];
const RING = 0.68, SHAPE_S = 0.4;

const SKILLS = ['TypeScript', 'Python', 'React', 'Next.js', 'Three.js', 'WebGPU · WGSL', 'OpenCascade WASM', 'VTK.js', 'LangGraph', 'LangChain', 'PyTorch', 'FastAPI', 'PostgreSQL', 'Docker', 'WebLLM · Ollama', 'RAG · ChromaDB', 'React Native', 'Socket.IO', 'Kotlin', 'Redis'];
const FONT = '"Inter", "Helvetica Neue", Arial, sans-serif';
const INK = [0.93, 0.97, 1.0];
const MEMBER_FRAC = 0.72;

const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const smooth = (a: number, b: number, x: number) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const VERT = /* glsl */ `
  uniform float uTime, uPx, uSize, uMA, uRot, uTurb, uMouseOn, uDim, uStretch, uClickT;
  uniform float uObj, uXf, uAmt, uScale;
  uniform vec3 uMouse, uPet, uClick, uOff;
  uniform vec2 uTilt;
  uniform vec4 uObs;
  attribute vec4 aSeed; attribute vec3 aT1, aT2, aT3;
  #ifdef LINE
  attribute float aEnd;
  #endif
  varying vec3 vColor; varying float vAlpha;

  vec3 xform(vec3 q){
    float cs = cos(uRot), sn = sin(uRot);
    vec3 r = vec3(q.x*cs + q.z*sn, q.y, -q.x*sn + q.z*cs);                 // spin about Y
    float cz = cos(uTilt.y), sz = sin(uTilt.y);
    r = vec3(r.x*cz - r.y*sz, r.x*sz + r.y*cz, r.z);                        // lean about Z
    float cx = cos(uTilt.x), sx = sin(uTilt.x);
    r = vec3(r.x, r.y*cx - r.z*sx, r.y*sx + r.z*cx);                        // lean about X
    return r * uScale + uOff;
  }

  // potential flow past a sphere (the object's bounding sphere) + turbulence in the wake
  vec3 field(vec3 p, float t){
    vec3 U = vec3(3.0, 0.0, 0.0);
    vec3 d = p - uObs.xyz; float L = length(d); float a = uObs.w;
    vec3 vel = U;
    if (a > 0.05){
      float r = max(L, a); vec3 rh = d / max(L, 1e-4);
      vel = U - (a*a*a / (2.0*r*r*r)) * (3.0*dot(U, rh)*rh - U);
    }
    float wake = smoothstep(0.0, 6.0, d.x) * uTurb;
    vec3 q = p * 0.55;
    vec3 n = vec3(sin(q.y*2.1 + t*0.9) + sin(q.z*1.7 - t*0.6),
                  sin(q.z*2.3 + t*0.7) + sin(q.x*1.9 + t*0.5),
                  sin(q.x*2.0 - t*0.8) + sin(q.y*1.5 + t*0.4));
    float shed = sin(d.x*1.1 - t*2.2) * exp(-abs(d.y)*0.28) * smoothstep(1.0, 5.0, d.x) * step(0.05, a);
    vec3 v = vel + n * 0.4 * (0.2 + wake * 1.7);
    v.y += shed * 1.1 * uTurb;
    return v;
  }
  vec3 keepOut(vec3 p){
    vec3 d = p - uObs.xyz; float l = length(d);
    if (uObs.w > 0.05 && l < uObs.w * 1.03) p = uObs.xyz + d / max(l, 1e-4) * uObs.w * 1.03;
    return p;
  }
  vec3 cmap(float t){
    vec3 a = vec3(0.16,0.28,0.52), b = vec3(0.12,0.52,0.52), c = vec3(0.62,0.78,0.90), d = vec3(1.0,1.0,1.0);
    if (t < 0.33) return mix(a, b, t/0.33);
    if (t < 0.66) return mix(b, c, (t-0.33)/0.33);
    return mix(c, d, (t-0.66)/0.34);
  }

  void main(){
    float age = fract(aSeed.x + uTime * 0.05);
    float T = age * 9.0;
    vec3 p = vec3(-16.0, (aSeed.y - 0.5) * 18.0, (aSeed.z - 0.5) * 18.0);
    float dt = T / 20.0, spd = 0.0;
    for (int i = 0; i < 20; i++){
      vec3 v = field(p, uTime);
      p = keepOut(p + v * dt);
      spd = length(v);
    }
    #ifdef LINE
    if (aEnd < 0.5) {
      for (int i = 0; i < 4; i++) p = keepOut(p - field(p, uTime) * uStretch);
    }
    #endif
    float wk = smoothstep(2.0, 10.0, p.x - uObs.x) * uTurb;
    float tc = clamp((spd - 1.8) / 6.0 + wk * 0.28, 0.0, 1.0);
    vec3 col = cmap(tc);

    // which particles join the object (decided by a hash, so it is uncorrelated with the flow seeds)
    float h = fract(sin(dot(aSeed.xy, vec2(12.9898, 78.233))) * 43758.5453);
    float member = smoothstep(${MEMBER_FRAC.toFixed(2)} * uAmt + 0.05, ${MEMBER_FRAC.toFixed(2)} * uAmt - 0.02, h);
    float m1 = smoothstep(0.0, 1.0, clamp(uMA * 1.6 - aSeed.w * 0.6, 0.0, 1.0));
    float mo = smoothstep(0.0, 1.0, clamp(uObj * 1.7 - aSeed.w * 0.7, 0.0, 1.0)) * member;

    vec3 lp = mix(aT2, aT3, uXf);                       // model-space position (unit sphere), crossfaded A -> B
    vec3 pos = mix(p, xform(lp), mo);
    pos = mix(pos, aT1, m1);                             // the name (intro)
    float morph = max(m1, mo);
    pos += vec3(sin(uTime*1.3 + aSeed.x*40.0), cos(uTime*1.1 + aSeed.y*40.0), sin(uTime*0.9 + aSeed.z*40.0)) * 0.04 * morph;

    vec2 dm = pos.xy - uMouse.xy;
    float d2 = dot(dm, dm);
    pos.xy += normalize(dm + 0.0001) * exp(-d2 * 0.28) * 1.7 * uMouseOn * (0.7 + 0.6 * morph);
    pos.z += exp(-d2 * 0.28) * 0.8 * uMouseOn * (aSeed.w - 0.5);

    // click shockwave
    vec2 dc = pos.xy - uClick.xy;
    float cd = length(dc);
    float ring = exp(-pow((cd - uClickT * 10.0) * 0.9, 2.0)) * exp(-uClickT * 1.1);
    pos.xy += dc / max(cd, 0.0001) * ring * 2.4;
    pos.z += ring * 1.4 * (aSeed.w - 0.5);

    // the pixel pet is an obstacle in the stream
    vec2 dp = pos.xy - uPet.xy;
    float pd = length(dp);
    pos.xy += dp / max(pd, 0.0001) * exp(-pd * pd * 1.6) * 0.75 * uPet.z;

    // object colour: ink, warming to teal toward the top, with a few amber sparks
    float hy = clamp(lp.y * 0.5 + 0.5, 0.0, 1.0);
    vec3 objCol = mix(vec3(${INK[0]}, ${INK[1]}, ${INK[2]}), vec3(0.37, 0.95, 0.78), smoothstep(0.2, 1.0, hy) * 0.95);
    objCol = mix(objCol, vec3(1.0), step(0.985, aSeed.x));
    vColor = mix(col, objCol, morph * 0.95);

    float lone = smoothstep(0.0, 0.06, age) * smoothstep(1.0, 0.9, age);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    #ifdef LINE
    vAlpha = lone * (1.0 - morph) * aEnd * uDim * (0.6 + 0.9 * tc);
    #else
    vAlpha = morph * mix(0.25, 1.0, smoothstep(0.1, 0.8, uAmt));
    gl_PointSize = clamp(uSize * uPx * (0.7 + aSeed.w * 0.6) * mix(1.0, 22.0 / -mv.z, 0.45), 1.0, 5.5 * uPx);
    #endif
    gl_Position = projectionMatrix * mv;
  }`;

const FRAG = /* glsl */ `
  uniform vec2 uRes; uniform float uZone;
  varying vec3 vColor; varying float vAlpha;
  void main(){
    #ifdef LINE
    vec2 sp = gl_FragCoord.xy / uRes;
    float zone = smoothstep(0.62, 0.34, sp.x) * smoothstep(0.08, 0.30, sp.y) * smoothstep(0.92, 0.70, sp.y);
    gl_FragColor = vec4(vColor, vAlpha * 0.30 * (1.0 - 0.78 * zone * uZone));
    #else
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.3, d);
    vec2 sp = gl_FragCoord.xy / uRes;
    float zone = smoothstep(0.58, 0.34, sp.x) * smoothstep(0.10, 0.30, sp.y) * smoothstep(0.92, 0.72, sp.y);
    gl_FragColor = vec4(vColor, a * vAlpha * (1.0 - 0.7 * zone * uZone));
    #endif
  }`;

export const FlowField = () => {
  const { pathname } = useLocation();
  const routeRef = useRef(pathname);
  routeRef.current = pathname;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Motion follows the OS "reduce motion" setting by default (calm: slow flow, no intro, no pointer effects);
  // the visitor can switch to full motion and the choice is remembered.
  const prefersReduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initialMode = (() => { try { const s = localStorage.getItem('flowfield-motion'); if (s === 'full' || s === 'calm') return s; } catch { /* ignore */ } return prefersReduced ? 'calm' : 'full'; })();
  const modeRef = useRef<'full' | 'calm'>(initialMode as 'full' | 'calm');
  const [mode, setMode] = useState<'full' | 'calm'>(initialMode as 'full' | 'calm');
  const toggleMode = () => { const next = modeRef.current === 'full' ? 'calm' : 'full'; modeRef.current = next; setMode(next); try { localStorage.setItem('flowfield-motion', next); } catch { /* ignore */ } };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const root = document.documentElement;
    const done = () => { root.dataset.intro = 'done'; };

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try { const c = document.createElement('canvas'); gl = (c.getContext('webgl2') || c.getContext('webgl')) as any; } catch { /* no WebGL */ }
    if (!gl) { done(); canvas.style.display = 'none'; return; }
    const playIntro = modeRef.current === 'full' && routeRef.current === '/';
    if (playIntro) root.dataset.intro = 'play'; else done();

    const small = innerWidth < 760 || matchMedia('(pointer: coarse)').matches;
    const N = small ? 36000 : 110000;
    const DPR = Math.min(devicePixelRatio || 1, small ? 1.5 : 2);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x07090c, 1);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 200);
    const CAM_Z = 17;

    // ---- attribute buffers ----
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.9;
    const aSeed = new Float32Array(N * 4), aT1 = new Float32Array(N * 3), aT2 = new Float32Array(N * 3), aT3 = new Float32Array(N * 3);
    for (let i = 0; i < N * 4; i++) aSeed[i] = Math.random();

    // skills globe (unit sphere shell + glowing nodes around each skill) and its label anchors
    const anchors = SKILLS.map((_, k) => {
      const y = 1 - (k / (SKILLS.length - 1)) * 2, r = Math.sqrt(1 - y * y), th = k * 2.399963;
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    const buildGlobe = () => {
      const out = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        let x, y, z;
        if (Math.random() < 0.16) {
          const a = anchors[(Math.random() * anchors.length) | 0];
          x = a[0] + gauss() * 0.06; y = a[1] + gauss() * 0.06; z = a[2] + gauss() * 0.06;
        } else {
          const u = Math.random() * 2 - 1, th = Math.random() * 6.2832, r = Math.sqrt(1 - u * u), rr = 1 + (Math.random() - 0.5) * 0.1;
          x = Math.cos(th) * r * rr; y = u * rr; z = Math.sin(th) * r * rr;
        }
        out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
      }
      return out;
    };

    // model point clouds (sampled from real STL meshes, normalised to a unit sphere)
    const cache = new Map<ModelName, Float32Array>();
    const loadModel = async (name: ModelName): Promise<Float32Array> => {
      const hit = cache.get(name); if (hit) return hit;
      let arr: Float32Array;
      if (name === 'globe') arr = buildGlobe();
      else if (name === 'finale') arr = await buildFinale();
      else {
        const res = await fetch(`${import.meta.env.BASE_URL}models/${name}.bin`);
        const q = new Int16Array(await res.arrayBuffer());
        arr = new Float32Array(N * 3);
        const total = Math.floor(q.length / 3);
        for (let i = 0; i < N; i++) {
          const j = (i % total) * 3;
          let x = q[j] / 32767, y = q[j + 1] / 32767, z = q[j + 2] / 32767;
          arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
        }
      }
      cache.set(name, arr); return arr;
    };

    // ---- geometry (instanced: one "particle" = 1 point + 1 streak segment) ----
    const geo = new THREE.InstancedBufferGeometry(), lineGeo = new THREE.InstancedBufferGeometry();
    const inst = {
      aSeed: new THREE.InstancedBufferAttribute(aSeed, 4), aT1: new THREE.InstancedBufferAttribute(aT1, 3),
      aT2: new THREE.InstancedBufferAttribute(aT2, 3), aT3: new THREE.InstancedBufferAttribute(aT3, 3),
    };

    // the finale: all five shapes on a ring, joined by arcs and spokes of particles, around a glowing core
    const buildFinale = async () => {
      const arrs = await Promise.all(FINALE.map(f => loadModel(f.m)));
      const out = new Float32Array(N * 3), K = FINALE.length, step = 6.2832 / K;
      for (let i = 0; i < N; i++) {
        const u = Math.random();
        let x = 0, y = 0, z = 0;
        if (u < 0.62) {                                          // the shapes themselves
          const k = Math.min(K - 1, Math.floor((u / 0.62) * K)), src = arrs[k], j = ((Math.random() * N) | 0) * 3, a = k * step;
          x = Math.cos(a) * RING + src[j] * SHAPE_S; y = src[j + 1] * SHAPE_S; z = Math.sin(a) * RING + src[j + 2] * SHAPE_S;
        } else if (u < 0.76) {                                   // arcs along the ring, shape to shape
          const k = (Math.random() * K) | 0, t = Math.random(), a = k * step + t * step, bulge = Math.sin(t * 3.1416);
          x = Math.cos(a) * RING + gauss() * 0.012; y = bulge * 0.1 + gauss() * 0.012; z = Math.sin(a) * RING + gauss() * 0.012;
        } else if (u < 0.9) {                                    // spokes from the core to each shape
          const k = (Math.random() * K) | 0, t = Math.random() * 0.86, a = k * step;
          x = Math.cos(a) * RING * t + gauss() * 0.01; y = gauss() * 0.01; z = Math.sin(a) * RING * t + gauss() * 0.01;
        } else {                                                 // the core
          const q = Math.random() * 2 - 1, th = Math.random() * 6.2832, s = Math.sqrt(1 - q * q), rr = 0.05 + Math.random() * 0.07;
          x = Math.cos(th) * s * rr; y = q * rr; z = Math.sin(th) * s * rr;
        }
        out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
      }
      return out;
    };

    // name text (intro)
    const sampleText = (text: string) => {
      const W = 1600, H = 360, c = document.createElement('canvas'); c.width = W; c.height = H;
      const g = c.getContext('2d')!; g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
      let size = 250; g.font = `800 ${size}px ${FONT}`;
      const w = g.measureText(text).width; if (w > W * 0.94) { size *= W * 0.94 / w; g.font = `800 ${size}px ${FONT}`; }
      g.fillText(text, W / 2, H / 2 + size * 0.04);
      const d = g.getImageData(0, 0, W, H).data, pts: number[] = [];
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 128) pts.push(x / W - 0.5, -(y / H - 0.5));
      return { pts, ratio: H / W };
    };
    let nameSamples: ReturnType<typeof sampleText> | null = null;
    const rebuildName = () => {
      if (!nameSamples) return;
      const h = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const worldW = Math.min(h * camera.aspect * 0.86, 21), n = nameSamples.pts.length / 2;
      for (let i = 0; i < N; i++) {
        const j = ((Math.random() * n) | 0) * 2;
        aT1[i * 3] = nameSamples.pts[j] * worldW + gauss() * 0.04;
        aT1[i * 3 + 1] = nameSamples.pts[j + 1] * worldW * nameSamples.ratio + 1.3 + gauss() * 0.04;
        aT1[i * 3 + 2] = gauss() * 0.35;
      }
      inst.aT1.needsUpdate = true;
    };

    (Object.keys(inst) as (keyof typeof inst)[]).forEach(k => { geo.setAttribute(k, inst[k]); lineGeo.setAttribute(k, inst[k]); });
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    lineGeo.setAttribute('aEnd', new THREE.BufferAttribute(new Float32Array([0, 1]), 1));
    geo.instanceCount = N; lineGeo.instanceCount = N;

    const U = {
      uTime: { value: 0 }, uPx: { value: DPR }, uSize: { value: small ? 1.5 : 1.15 },
      uMouse: { value: new THREE.Vector3(999, 999, 0) }, uPet: { value: new THREE.Vector3(999, 999, 0) }, uClick: { value: new THREE.Vector3(999, 999, 0) },
      uClickT: { value: 99 }, uRes: { value: new THREE.Vector2(1, 1) }, uZone: { value: 1 }, uStretch: { value: 0.07 },
      uMouseOn: { value: 0 }, uDim: { value: 0.5 }, uMA: { value: 0 }, uRot: { value: 0 }, uTurb: { value: 0.9 },
      uObj: { value: 0 }, uXf: { value: 0 }, uAmt: { value: 1 }, uScale: { value: 5 }, uOff: { value: new THREE.Vector3() },
      uTilt: { value: new THREE.Vector2() }, uObs: { value: new THREE.Vector4(0, 0, 0, 0) },
    };
    const common = { uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: VERT, fragmentShader: FRAG };
    const pointMat = new THREE.ShaderMaterial(common);
    const lineMat = new THREE.ShaderMaterial({ ...common, defines: { LINE: '' } });
    const points = new THREE.Points(geo, pointMat), streaks = new THREE.LineSegments(lineGeo, lineMat);
    points.frustumCulled = false; streaks.frustumCulled = false;
    scene.add(streaks); scene.add(points);

    // ---- layout: where the model sits for the current screen shape ----
    const halfW = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * CAM_Z * camera.aspect;
    const layoutFor = (s: Scene) => {
      const hw = halfW(), wide = camera.aspect > 1.25;
      const r = wide ? s.r : Math.min(s.r * 0.62, hw * 0.88);
      const off = wide ? [clamp(hw * (s.x ?? 0.5), 0, hw), s.lift, 0] : [0, 3.6 + s.lift * 0.4, 0];
      return { r, off };
    };

    // ---- scene state ----
    const cur = { r: 5, off: [6, 0, 0], tilt: [0, 0], obj: 0, xf: 0, amt: 1, dim: 0.5 };
    let aName: ModelName | null = null, bName: ModelName | null = null;
    let objTarget = 0, xfTarget = 0, introDone = !playIntro, lastRoute = '';
    let reqId = 0, alive = true, sceneKey = '', nameW = 0;

    const applyRoute = (key?: string) => {
      const route = key ?? routeRef.current; lastRoute = route;
      const sc = SCENES[route] || null; const my = ++reqId;
      if (!sc || !sc.model) { objTarget = 0; return; }
      if (sc.model === aName && xfTarget === 0) { objTarget = 1; return; }
      loadModel(sc.model).then(arr => {
        if (my !== reqId || !alive) return;
        if (!aName || cur.obj < 0.04) {                       // nothing visible yet: drop it straight in
          aT2.set(arr); inst.aT2.needsUpdate = true; aName = sc.model; bName = null; cur.xf = 0; xfTarget = 0; objTarget = 1;
        } else {                                              // crossfade A -> B
          if (cur.xf > 0.5 && bName) { aT2.set(aT3); inst.aT2.needsUpdate = true; aName = bName; }
          aT3.set(arr); inst.aT3.needsUpdate = true; bName = sc.model; cur.xf = 0; xfTarget = 1; objTarget = 1;
        }
      }).catch(() => { objTarget = 0; });
    };

    // ---- sizing ----
    const resize = () => {
      const w = innerWidth, h = innerHeight;
      renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      rebuildName();
    };
    let rzT: number; const onResize = () => { clearTimeout(rzT); rzT = window.setTimeout(resize, 150); };
    addEventListener('resize', onResize);

    // ---- pointer ----
    const mouse = { x: 0, y: 0, sx: 0, sy: 0, on: 0, target: 0, t: 0 };
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), tmp = new THREE.Vector3();
    const worldAt = (nx: number, ny: number, out: THREE.Vector3) => {
      ndc.set(nx, ny); ray.setFromCamera(ndc, camera);
      const z = Math.abs(ray.ray.direction.z) > 1e-4 ? -ray.ray.origin.z / ray.ray.direction.z : 0;
      return out.copy(ray.ray.origin).addScaledVector(ray.ray.direction, z);
    };
    const onMove = (e: PointerEvent) => { if (modeRef.current === 'calm') return; mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight * 2 - 1); mouse.target = 1; clearTimeout(mouse.t); mouse.t = window.setTimeout(() => { mouse.target = 0; }, 2500); };
    const onLeave = () => { mouse.target = 0; };
    let clickAt = -1e9;
    const onDown = (e: PointerEvent) => {
      if (modeRef.current === 'calm' || (e.target as HTMLElement)?.closest?.('a,button,input,textarea,select,[data-pet-root]')) return;
      worldAt(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1), U.uClick.value); U.uClick.value.z = 0;
      clickAt = performance.now();
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    // ---- skills labels ----
    const tagEls = tagsRef.current ? Array.from(tagsRef.current.children) as HTMLElement[] : [];
    const linkEls = linksRef.current ? Array.from(linksRef.current.children) as HTMLElement[] : [];
    let linksOn = false;
    let tagsOn = false;

    // ---- loop ----
    let raf = 0, time = 0, last = performance.now(), introT = playIntro ? 0 : 99, speed = modeRef.current === 'calm' ? 0.22 : 1;
    let frames = 0, fpsT = performance.now(), drawN = N, tuned = false, lastY = scrollY, vel = 0;
    const petRef = { current: null as HTMLElement | null };
    const lookV = new THREE.Vector3();

    const frame = (now: number) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const calm = modeRef.current === 'calm';
      // which scene is active: on the home page, the [data-scene] section under the middle of the screen
      let key = routeRef.current;
      if (key === '/') {
        const els = document.querySelectorAll<HTMLElement>('[data-scene]');
        if (els.length) {
          const mid = innerHeight * 0.5; let best: HTMLElement | null = null, bd = 1e9;
          els.forEach(el => { const r = el.getBoundingClientRect(), d = r.top <= mid && r.bottom > mid ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid)); if (d < bd) { bd = d; best = el; } });
          if (best) key = '#' + (best as HTMLElement).dataset.scene;
        }
      }
      sceneKey = key;
      if (key !== lastRoute) applyRoute(key);

      speed += ((calm ? 0.22 : 1) - speed) * (1 - Math.exp(-dt * 3));
      const rawV = Math.abs(scrollY - lastY) / Math.max(dt, 0.001); lastY = scrollY;
      vel += ((calm ? 0 : clamp(rawV / 2600, 0, 1.4)) - vel) * (1 - Math.exp(-dt * 5));
      if (!document.hidden) time += dt * speed * (1 + vel * 1.6);
      introT += dt; if (calm) mouse.target = 0;
      if (!introDone && introT > 4.8) { introDone = true; done(); }

      // target layout for this route
      const sc0 = SCENES[sceneKey] || null;
      const heroHold = false as boolean;
      const sc = sc0 && heroHold ? { ...sc0, r: 7.6, x: 0, lift: 0, tilt: [0.28, 0] as [number, number] } : sc0;
      if (sc) {
        const L = layoutFor(sc), k = 1 - Math.exp(-dt * 3.2);
        cur.r += (L.r - cur.r) * k;
        for (let i = 0; i < 3; i++) cur.off[i] += (L.off[i] - cur.off[i]) * k;
        cur.tilt[0] += (sc.tilt[0] - cur.tilt[0]) * k; cur.tilt[1] += (sc.tilt[1] - cur.tilt[1]) * k;
      }
      let amtT = lerp(1, 0.06, smooth(innerHeight * 0.1, innerHeight * 0.8, scrollY));
      if (sceneKey.startsWith('#')) amtT = 1; else if (camera.aspect <= 1.25 && sceneKey === '/') amtT = Math.min(amtT, 0.28);
      const ko = 1 - Math.exp(-dt * 2.4);
      const wantObj = introT > 1.0 ? objTarget : 0;
      cur.obj += (wantObj - cur.obj) * ko; cur.amt += (amtT - cur.amt) * (1 - Math.exp(-dt * 4));
      cur.xf += (xfTarget - cur.xf) * (1 - Math.exp(-dt * 1.8));
      if (xfTarget === 1 && cur.xf > 0.995 && bName) { aT2.set(aT3); inst.aT2.needsUpdate = true; aName = bName; bName = null; cur.xf = 0; xfTarget = 0; }

      mouse.on += (mouse.target - mouse.on) * (1 - Math.exp(-dt * 4));
      mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 3)); mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 3));
      const sy = clamp(scrollY * 0.0016, 0, 1.4);
      camera.position.set(mouse.sx * 0.9, mouse.sy * 0.6 - sy, CAM_Z);
      lookV.set(0, -sy * 0.6, 0); camera.lookAt(lookV);

      // intro: assemble the name, hold, dissolve (scrolling away also dissolves it)
      const scrollAway = smooth(innerHeight * 0.02, innerHeight * 0.35, scrollY);
      nameW += ((SCENES[sceneKey]?.name ? 1 : 0) - nameW) * (1 - Math.exp(-dt * 2.4));
      const mA = nameW * smooth(0.35, 2.0, introT);

      const objEff = cur.obj * lerp(0.4, 1, cur.amt);
      U.uTime.value = time; U.uMA.value = mA; U.uObj.value = cur.obj; U.uXf.value = cur.xf; U.uAmt.value = cur.amt;
      U.uScale.value = cur.r; U.uOff.value.set(cur.off[0], cur.off[1], cur.off[2]); U.uTilt.value.set(cur.tilt[0], cur.tilt[1]);
      U.uObs.value.set(cur.off[0], cur.off[1], cur.off[2], cur.r * 0.92 * objEff);
      U.uRot.value = time * 0.16 + scrollY * 0.0007;
      U.uTurb.value = 0.9; U.uStretch.value = 0.07 * (1 + vel * 2.6);
      U.uClickT.value = (now - clickAt) / 1000;
      cur.dim += ((0.17 + 0.2 * cur.amt) - cur.dim) * 0.05;
      U.uDim.value = lerp(cur.dim, 0, mA);
      renderer.getDrawingBufferSize(U.uRes.value); U.uZone.value = camera.aspect > 1.25 && (sceneKey === '/' || sceneKey.startsWith('#')) ? 1 : (camera.aspect > 1.25 ? 0.35 : 0);

      worldAt(mouse.sx, mouse.sy, U.uMouse.value); U.uMouseOn.value = mouse.on;

      // locate the pet (fixed element) in world space so the flow parts around it
      const petEl = (petRef.current ||= document.querySelector('[data-pet-root]')) as HTMLElement | null;
      if (petEl && petEl.isConnected) {
        const r = petEl.getBoundingClientRect();
        worldAt(((r.left + r.width / 2) / innerWidth) * 2 - 1, -(((r.top + r.height / 2) / innerHeight) * 2 - 1), U.uPet.value); U.uPet.value.z = 1;
      } else { U.uPet.value.z = 0; petRef.current = null; }

      // skills labels follow the rotating globe (only while the globe is what's showing)
      const globeShown = aName === 'globe' && xfTarget === 0 ? cur.obj : 0;
      const la = clamp((globeShown - 0.6) / 0.3, 0, 1) * clamp((cur.amt - 0.4) / 0.4, 0, 1) * (1 - smooth(innerHeight * 0.1, innerHeight * 0.4, scrollY));
      if (la > 0.01 && tagEls.length) {
        const rot = U.uRot.value, cs = Math.cos(rot), sn = Math.sin(rot);
        const sparse = innerWidth < 700;
        for (let i = 0; i < anchors.length; i++) {
          if (sparse && i % 2 === 1) { tagEls[i].style.opacity = '0'; continue; }
          const a = anchors[i], x = a[0] * cs + a[2] * sn, z = -a[0] * sn + a[2] * cs;
          tmp.set(x * cur.r + cur.off[0], a[1] * cur.r + cur.off[1], z * cur.r + cur.off[2]).project(camera);
          const front = (z + 1) / 2, el = tagEls[i], half = (el.offsetWidth || 90) / 2 + 10;
          const px = clamp((tmp.x * 0.5 + 0.5) * innerWidth, half, innerWidth - half), py = (-tmp.y * 0.5 + 0.5) * innerHeight;
          el.style.transform = `translate3d(${px.toFixed(1)}px,${py.toFixed(1)}px,0) translate(-50%,-50%) scale(${(0.8 + front * 0.35).toFixed(3)})`;
          el.style.opacity = (la * (0.5 + front * 0.5)).toFixed(3);
        }
        tagsOn = true;
      } else if (tagsOn) { tagEls.forEach(e => { e.style.opacity = '0'; }); tagsOn = false; }

      // finale: a link over each shape (same transform as the shader), clickable
      const finaleShown = aName === 'finale' && xfTarget === 0 ? cur.obj : 0;
      const fa = clamp((finaleShown - 0.7) / 0.25, 0, 1) * (1 - smooth(innerHeight * 0.12, innerHeight * 0.45, scrollY));   // links fade out before the page cards arrive
      if (fa > 0.02 && linkEls.length) {
        const rot = U.uRot.value, cs = Math.cos(rot), sn = Math.sin(rot), cz = Math.cos(cur.tilt[1]), sz = Math.sin(cur.tilt[1]), cx = Math.cos(cur.tilt[0]), sx = Math.sin(cur.tilt[0]);
        FINALE.forEach((f, i) => {
          const ang = i * 6.2832 / FINALE.length;
          let px = Math.cos(ang) * RING, py = 0, pz = Math.sin(ang) * RING;
          let x1 = px * cs + pz * sn, z1 = -px * sn + pz * cs, y1 = py;                // spin about Y
          const x2 = x1 * cz - y1 * sz, y2 = x1 * sz + y1 * cz;                       // lean about Z
          const y3 = y2 * cx - z1 * sx, z3 = y2 * sx + z1 * cx;                       // lean about X
          tmp.set(x2 * cur.r + cur.off[0], y3 * cur.r + cur.off[1], z3 * cur.r + cur.off[2]).project(camera);
          const el = linkEls[i], front = clamp((z3 + RING) / (2 * RING), 0, 1), half = (el.offsetWidth || 90) / 2 + 8;
          const sxp = clamp((tmp.x * 0.5 + 0.5) * innerWidth, half, innerWidth - half), syp = clamp((-tmp.y * 0.5 + 0.5) * innerHeight - 56, 90, innerHeight - 24);
          el.style.transform = `translate3d(${sxp.toFixed(1)}px,${syp.toFixed(1)}px,0) translate(-50%,-50%) scale(${(0.85 + front * 0.3).toFixed(3)})`;
          el.style.opacity = (fa * (0.55 + front * 0.45)).toFixed(3);
          el.style.pointerEvents = fa > 0.6 ? 'auto' : 'none';
        });
        linksOn = true;
      } else if (linksOn) { linkEls.forEach(e => { e.style.opacity = '0'; e.style.pointerEvents = 'none'; }); linksOn = false; }

      renderer.render(scene, camera);

      // adaptive quality
      frames++;
      if (now - fpsT > 600) {
        const fps = frames * 1000 / (now - fpsT); frames = 0; fpsT = now;
        if (!tuned && introT > 4 && fps < 30 && drawN > 24000) { drawN = Math.floor(drawN * 0.65); geo.instanceCount = drawN; lineGeo.instanceCount = drawN; if (fps >= 20) tuned = true; }
      }
      raf = requestAnimationFrame(frame);
    };

    const onLost = (e: Event) => { e.preventDefault(); alive = false; canvas.style.display = 'none'; done(); };
    canvas.addEventListener('webglcontextlost', onLost);

    resize();
    const fontReady = (document.fonts && document.fonts.load ? document.fonts.load(`800 120px Inter`).catch(() => undefined) : Promise.resolve());
    fontReady.finally(() => {
      if (!alive) return;
      nameSamples = sampleText('SRIDHAR MANI'); rebuildName();
      applyRoute();
      last = performance.now(); raf = requestAnimationFrame(frame);
      // warm the other models in the background so route changes are instant
      window.setTimeout(() => { (['ast', 'nn', 'plane', 'globe', 'xbot', 'finale'] as ModelName[]).reduce((p, m) => p.then(() => loadModel(m).then(() => undefined)).catch(() => undefined), Promise.resolve()); }, 1200);
    });
    const failSafe = window.setTimeout(done, 7000);   // never leave the hero hidden

    return () => {
      alive = false; cancelAnimationFrame(raf); clearTimeout(failSafe); clearTimeout(rzT);
      removeEventListener('resize', onResize); removeEventListener('pointermove', onMove); removeEventListener('pointerdown', onDown); document.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      geo.dispose(); lineGeo.dispose(); pointMat.dispose(); lineMat.dispose();
      renderer.dispose(); renderer.forceContextLoss();
      done();
    };
  }, []);

  return (
    <>
      <button type="button" className="flowfield-toggle" onClick={toggleMode} aria-pressed={mode === 'full'} title="Toggle the 3D background motion">
        <span className="flowfield-toggle-dot" data-on={mode === 'full'} />Motion: {mode === 'full' ? 'full' : 'calm'}
      </button>
      <canvas ref={canvasRef} aria-hidden="true" className="flowfield-canvas" />
      <div ref={tagsRef} aria-hidden="true" className="flowfield-tags">
        {SKILLS.map(s => <div key={s} className="flowfield-tag">{s}</div>)}
      </div>
    </>
  );
};

export default FlowField;
