import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { PetState } from './PixelPet';

/**
 * A tiny 3D robot companion, built entirely from primitives (no model files).
 * Reacts to the pet's state: idle (bob, blink, antenna sway), walk (legs and arms swing),
 * happy (jump, squint, arms up) and sleep (head nods down, eyes close, antenna droops).
 * The parent flips it horizontally when the pet faces left, same as the pixel sprites.
 */
export const PetBot3D = ({ state, size = 76, className = '' }: { state: PetState; size?: number; className?: string }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<PetState>(state);
  stateRef.current = state;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch { setFailed(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 0.55, 6.6); camera.lookAt(0, 0.45, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(2.2, 3.2, 3.5); scene.add(key);
    const rim = new THREE.DirectionalLight(0x5eead4, 0.8); rim.position.set(-3, 1.2, -2.5); scene.add(rim);

    const geos: THREE.BufferGeometry[] = [], mats: THREE.Material[] = [];
    const std = (color: number, rough = 0.42, metal = 0.1) => { const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }); mats.push(m); return m; };
    const basic = (color: number) => { const m = new THREE.MeshBasicMaterial({ color }); mats.push(m); return m; };
    const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => { geos.push(g); return new THREE.Mesh(g, m); };

    const WHITE = std(0xeef2f7), DARK = std(0x0f172a, 0.15, 0.6), TEAL = std(0x24626c, 0.5, 0.3), AMBER = basic(0xfbbf24), GLOW = basic(0x5eead4);

    const bot = new THREE.Group(); scene.add(bot);
    const body = mesh(new THREE.CapsuleGeometry(0.4, 0.34, 6, 16), WHITE); body.scale.set(1.05, 0.95, 0.9); body.position.y = 0.1; bot.add(body);
    const core = mesh(new THREE.CircleGeometry(0.1, 20), GLOW); core.position.set(0, 0.14, 0.4); bot.add(core);
    const belt = mesh(new THREE.TorusGeometry(0.405, 0.03, 8, 28), TEAL); belt.rotation.x = Math.PI / 2; belt.position.y = -0.1; belt.scale.set(1.05, 0.9, 1); bot.add(belt);

    const head = new THREE.Group(); head.position.y = 0.98; bot.add(head);
    const skull = mesh(new THREE.SphereGeometry(0.52, 24, 18), WHITE); skull.scale.set(1.18, 0.92, 1.02); head.add(skull);
    const visor = mesh(new THREE.SphereGeometry(0.43, 24, 18), DARK); visor.scale.set(1.08, 0.72, 0.62); visor.position.set(0, 0.0, 0.28); head.add(visor);
    const eyeL = mesh(new THREE.SphereGeometry(0.085, 14, 12), GLOW), eyeR = eyeL.clone();
    for (const [e, x] of [[eyeL, -0.2], [eyeR, 0.2]] as [THREE.Mesh, number][]) { e.scale.set(1, 1.4, 0.4); e.position.set(x, 0.02, 0.52); head.add(e); }
    for (const x of [-0.6, 0.6]) { const pod = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16), TEAL); pod.rotation.z = Math.PI / 2; pod.position.set(x, -0.02, 0); head.add(pod); }
    const antenna = new THREE.Group(); antenna.position.set(0, 0.46, 0); head.add(antenna);
    const stalk = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8), TEAL); stalk.position.y = 0.15; antenna.add(stalk);
    const bulb = mesh(new THREE.SphereGeometry(0.075, 12, 10), AMBER); bulb.position.y = 0.32; antenna.add(bulb);

    const mkLimb = (x: number, y: number, r: number, len: number, mat: THREE.Material) => {
      const g = new THREE.Group(); g.position.set(x, y, 0);
      const m = mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat); m.position.y = -len / 2 - r * 0.4; g.add(m); bot.add(g); return g;
    };
    const armL = mkLimb(-0.52, 0.42, 0.085, 0.2, WHITE), armR = mkLimb(0.52, 0.42, 0.085, 0.2, WHITE);
    const legL = mkLimb(-0.2, -0.28, 0.12, 0.1, TEAL), legR = mkLimb(0.2, -0.28, 0.12, 0.1, TEAL);

    // smoothed animation parameters
    const P = { eye: 1, squint: 0, arms: 0, pitch: 0, drop: 0, droop: 0, walk: 0, jump: 0, glow: 1 };
    const ease = (cur: number, to: number, dt: number, k = 8) => cur + (to - cur) * (1 - Math.exp(-dt * k));
    let raf = 0, last = performance.now(), t = 0, blinkAt = 2.4, blinkT = -1;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      const s = stateRef.current;
      P.walk = ease(P.walk, s === 'walk' ? 1 : 0, dt, 7);
      P.jump = ease(P.jump, s === 'happy' ? 1 : 0, dt, 9);
      P.arms = ease(P.arms, s === 'happy' ? 1 : 0, dt, 9);
      P.squint = ease(P.squint, s === 'happy' ? 1 : 0, dt, 12);
      P.drop = ease(P.drop, s === 'sleep' ? 1 : 0, dt, 4);
      P.pitch = ease(P.pitch, s === 'sleep' ? 1 : 0, dt, 4);
      P.droop = ease(P.droop, s === 'sleep' ? 1 : 0, dt, 3);
      P.glow = ease(P.glow, s === 'sleep' ? 0.25 : 1, dt, 4);

      // blink (idle and walk only)
      if (t > blinkAt && blinkT < 0) { blinkT = 0; blinkAt = t + 2.2 + Math.random() * 2.4; }
      let blink = 1; if (blinkT >= 0) { blinkT += dt; blink = Math.abs(blinkT / 0.07 - 1); if (blinkT > 0.14) blinkT = -1; }
      P.eye = Math.min(blink, 1 - P.drop * 0.95) * (1 - P.squint * 0.62);
      eyeL.scale.y = eyeR.scale.y = Math.max(0.06, 1.4 * P.eye);

      const wk = Math.sin(t * 9) * P.walk, bob = Math.sin(t * 2) * 0.03 * (1 - P.walk) + Math.abs(Math.sin(t * 9)) * 0.07 * P.walk;
      const hop = Math.abs(Math.sin(t * 7)) * 0.3 * P.jump;
      bot.position.y = bob + hop - P.drop * 0.16;
      bot.rotation.y = 0.5 + Math.sin(t * 0.8) * 0.12 * (1 - P.walk) + Math.sin(t * 4) * 0.5 * P.jump;
      bot.rotation.z = wk * 0.05 + P.drop * 0.06;
      const breathe = 1 + Math.sin(t * 1.6) * 0.012 * (1 + P.drop);
      body.scale.set(1.05 * breathe, 0.95 * breathe, 0.9 * breathe);

      head.rotation.x = P.pitch * 0.42 - wk * 0.02;
      head.rotation.z = P.drop * 0.18 + Math.sin(t * 1.1) * 0.03;
      head.rotation.y = Math.sin(t * 0.7) * 0.12 * (1 - P.drop);
      antenna.rotation.z = Math.sin(t * 2.6) * 0.18 * (1 - P.droop) + P.droop * 0.95 + Math.sin(t * 9) * 0.1 * P.walk;
      bulb.scale.setScalar(0.85 + 0.25 * Math.sin(t * 5) * P.glow + 0.15);
      core.scale.setScalar(0.7 + 0.3 * Math.sin(t * 3) * P.glow + 0.3 * P.glow);

      armL.rotation.z = -0.15 - P.arms * 2.3 + Math.sin(t * 2) * 0.05; armR.rotation.z = 0.15 + P.arms * 2.3 - Math.sin(t * 2) * 0.05;
      armL.rotation.x = wk * 0.9; armR.rotation.x = -wk * 0.9;
      legL.rotation.x = -wk * 0.7; legR.rotation.x = wk * 0.7;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      geos.forEach(g => g.dispose()); mats.forEach(m => m.dispose());
      renderer.dispose(); renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  if (failed) return <span style={{ fontSize: size * 0.6, lineHeight: 1 }} aria-hidden="true">🤖</span>;
  return <div ref={mountRef} className={className} style={{ width: size, height: size }} />;
};

export default PetBot3D;
