import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Coffee, Cookie, Bug, Zap, X, Crosshair, Sparkles } from 'lucide-react';
import { petAudio } from './PixelPetAudio';
import { clamp, getHorizontalBounds, getVerticalBounds, moveTowards, getPatrolWaypoints, stepVerticalPhysics } from './petPhysics';

export type PetId = 'shiba' | 'fox' | 'crab' | 'duck' | 'clippy' | 'totoro' | 'zappy';
export type PetState = 'idle' | 'walk' | 'happy' | 'sleep';

export interface PetMeta {
  id: PetId;
  name: string;
  title: string;
  species: string;
  icon: string;
  color: string;
  dialogues: string[];
}

export const PET_CATALOG: PetMeta[] = [
  {
    id: 'shiba',
    name: 'Byte',
    title: 'Cyber Familiar',
    species: 'Shiba Inu',
    icon: '🐕',
    color: 'from-amber-400 to-orange-500',
    dialogues: [
      "Woof! Sridhar is building high-impact AI agents at Zenteiq! ⚡",
      "I love clean TypeScript, WebGPU shaders, and zero bugs! 🐾",
      "Pick me up and toss me! I can fly! 🪂",
      "Click on me to open treats and settings! 🎾",
      "Type 'agent' in the terminal to watch autonomous coding agents! 🤖"
    ]
  },
  {
    id: 'fox',
    name: 'Kitsune',
    title: 'Neural Scout',
    species: 'Cyber Fox',
    icon: '🦊',
    color: 'from-orange-500 to-rose-600',
    dialogues: [
      "Neural pathways synchronized! High-FPS WebGPU graphics! 🦊",
      "Sly algorithms optimize every single frame and pipeline.",
      "Check out Code-DCR research repository on GitHub! 📜",
      "FastAPI + LangGraph agent orchestration running smoothly. ⚡"
    ]
  },
  {
    id: 'crab',
    name: 'Ferris',
    title: 'Concurrency Master',
    species: 'Rust Crab',
    icon: '🦀',
    color: 'from-red-500 to-amber-600',
    dialogues: [
      "Fearless concurrency! Zero-cost abstractions & memory safety! 🦀",
      "No data races allowed in this portfolio! 🛡️",
      "Check out the React Native TurboModule & WebAssembly builds! ⚡",
      "Rust + C++ simulation pipelines run at native hardware speed!"
    ]
  },
  {
    id: 'duck',
    name: 'Ducky',
    title: 'Debugger Prime',
    species: 'Rubber Duck',
    icon: '🦆',
    color: 'from-yellow-400 to-amber-500',
    dialogues: [
      "Quack! Explain your toughest bug to me, I'm listening! 🦆",
      "Talking through code with me solves 95% of logic issues!",
      "Clean architecture makes complex agent workflows simple! ✨",
      "Quack! Toss me in the air, I bounce back! 🎾"
    ]
  },
  {
    id: 'clippy',
    name: 'Clippy-AI',
    title: 'Retro Orchestrator',
    species: 'Office Familiar',
    icon: '📎',
    color: 'from-cyan-400 to-blue-600',
    dialogues: [
      "It looks like you're browsing Sridhar's portfolio. Want to hire him? 📎",
      "I can assist with reviewing the ATS resume and GitHub repositories!",
      "Try out the Job Fit Analyzer to match your JD in real-time! 🎯",
      "Everything here runs local WebGPU and client-side intelligence!"
    ]
  },
  {
    id: 'totoro',
    name: 'Totoro',
    title: 'Forest Guardian',
    species: 'Ghibli Spirit',
    icon: '🍃',
    color: 'from-emerald-400 to-teal-600',
    dialogues: [
      "Rooaaar! Gentle giant guarding the distributed architecture! 🍃",
      "Deep roots in high-performance CFD simulation & OpenFOAM.",
      "A calm mind writes the most elegant asynchronous code. 🌲",
      "Resting under the canopy of clean pull requests... 🌿"
    ]
  },
  {
    id: 'zappy',
    name: 'Zappy',
    title: 'High-Voltage AI',
    species: 'Volt Familiar',
    icon: '⚡',
    color: 'from-yellow-300 to-cyan-400',
    dialogues: [
      "BZZZZT! 1.21 Gigawatts of agentic reasoning online! ⚡",
      "Direct neural link to GPU shader pipelines active! ⚡",
      "PyTorch tensor acceleration running with maximum throughput!",
      "Supercharged with autonomous coding agents! 🔌"
    ]
  }
];

export interface LevelInfo {
  level: number;
  title: string;
  progress: number;
  currentThreshold: number;
  nextThreshold: number;
}

export const getLevelInfo = (xp: number): LevelInfo => {
  const thresholds = [0, 50, 120, 220, 360, 540, 780, 1080, 1450, 1900];
  const titles = [
    'Pup / Novice',
    'Neon Scout',
    'Cyber Familiar',
    'Neural Vanguard',
    'Quantum Hound',
    'Matrix Sentinel',
    'AI Orchestrator',
    'Tech Titan',
    'Singularity Apex',
    'Cosmic Deity'
  ];

  let level = 1;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentThreshold = thresholds[level - 1] ?? 0;
  const nextThreshold = thresholds[level] ?? currentThreshold + 500;
  const progress = Math.min(100, Math.max(0, ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100));
  const title = titles[Math.min(level - 1, titles.length - 1)];

  return { level, title, progress, currentThreshold, nextThreshold };
};

export const PixelPet = () => {
  const [petId, setPetId] = useState<PetId>(() => {
    try {
      const saved = localStorage.getItem('portfolio_pet_id');
      return (saved as PetId) || 'shiba';
    } catch {
      return 'shiba';
    }
  });

  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('portfolio_pet_xp');
      return saved ? parseInt(saved, 10) : 60;
    } catch {
      return 60;
    }
  });

  const [state, setState] = useState<PetState>('walk');
  const [x, setX] = useState<number>(80);
  const [y, setY] = useState<number>(10); // Vertical altitude/depth from bottom
  const [scaleX, setScaleX] = useState<number>(1);
  const [scaleY, setScaleY] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isMuted, setIsMuted] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogue, setDialogue] = useState<string>('');
  const [showDialogue, setShowDialogue] = useState(true);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [dustPuffs, setDustPuffs] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // Tennis Ball State
  const [tennisBall, setTennisBall] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  } | null>(null);

  const prevLevelRef = useRef<number>(getLevelInfo(xp).level);
  // Keep the animated ball in a ref so each physics frame doesn't restart the RAF loop.
  const tennisBallRef = useRef(tennisBall);
  tennisBallRef.current = tennisBall;
  const currentXRef = useRef<number>(80);
  const currentYRef = useRef<number>(10);
  const baseDepthYRef = useRef<number>(12); // Ground depth baseline (ranges between 8 and 65)
  const velXRef = useRef<number>(0);
  const velYRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const directionRef = useRef<1 | -1>(1);
  const pauseUntilRef = useRef<number>(0);
  const nextLeapTimeRef = useRef<number>(performance.now() + 5000);
  const targetXOverrideRef = useRef<number | null>(null);
  const targetDepthYRef = useRef<number | null>(null);
  const patrolTargetXRef = useRef<number | null>(null);
  const lastPatrolIndexRef = useRef<number>(-1);
  const nextPatrolTimeRef = useRef<number>(performance.now() + 1600);
  const animFrameRef = useRef<number>(0);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number; totalDist: number } | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const screenWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const currentPet = PET_CATALOG.find((p) => p.id === petId) || PET_CATALOG[0];
  const levelInfo = getLevelInfo(xp);

  // Screen resize tracking
  useEffect(() => {
    const handleResize = () => {
      screenWidthRef.current = window.innerWidth;
      const { minX, maxX } = getHorizontalBounds(window.innerWidth);
      const { minY, maxY } = getVerticalBounds(window.innerHeight);
      currentXRef.current = clamp(currentXRef.current, minX, maxX);
      currentYRef.current = clamp(currentYRef.current, minY, maxY);
      baseDepthYRef.current = clamp(baseDepthYRef.current, minY, maxY);
      if (targetXOverrideRef.current !== null) targetXOverrideRef.current = clamp(targetXOverrideRef.current, minX, maxX);
      if (targetDepthYRef.current !== null) targetDepthYRef.current = clamp(targetDepthYRef.current, minY, maxY);
      if (patrolTargetXRef.current !== null) patrolTargetXRef.current = clamp(patrolTargetXRef.current, minX, maxX);
      setX(currentXRef.current);
      setY(currentYRef.current);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save pet selections
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_pet_id', petId);
      localStorage.setItem('portfolio_pet_xp', xp.toString());
    } catch {}
  }, [petId, xp]);

  // Initial greeting
  useEffect(() => {
    setDialogue(currentPet.dialogues[0]);
    setShowDialogue(true);
    const t = setTimeout(() => setShowDialogue(false), 6000);
    return () => clearTimeout(t);
  }, [petId]);

  // Terminal command listener
  useEffect(() => {
    const handlePetEvent = (e: CustomEvent) => {
      if (e.detail?.petId) {
        setPetId(e.detail.petId);
      }
      if (e.detail?.action === 'fetch') {
        spawnTennisBall();
      }
    };
    window.addEventListener('portfolio-pet-command' as any, handlePetEvent);
    return () => window.removeEventListener('portfolio-pet-command' as any, handlePetEvent);
  }, []);

  // Level Up fanfare
  useEffect(() => {
    const currentLvl = getLevelInfo(xp).level;
    if (currentLvl > prevLevelRef.current) {
      petAudio.playLevelUp();
      setIsLevelingUp(true);
      setState('happy');
      setDialogue(`✨ EVOLVED TO LEVEL ${currentLvl}! ${levelInfo.title.toUpperCase()}! 🎉`);
      setShowDialogue(true);

      const timer = setTimeout(() => {
        setIsLevelingUp(false);
        setState('walk');
      }, 3500);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = currentLvl;
  }, [xp, levelInfo.title]);

  // Spawn Tennis Ball for Fetch
  const spawnTennisBall = useCallback(() => {
    petAudio.playBoing();
    targetXOverrideRef.current = null;
    targetDepthYRef.current = null;
    patrolTargetXRef.current = null;
    const { minX, maxX } = getHorizontalBounds(screenWidthRef.current);
    const { maxY: ballMaxY } = getVerticalBounds(window.innerHeight, 24);
    const curX = clamp(currentXRef.current, minX, maxX);
    const facingRight = directionRef.current === 1;
    const targetThrowX = facingRight ? curX + 280 : curX - 280;
    const clampedThrowX = clamp(targetThrowX, minX, maxX);
    const dist = clampedThrowX - curX;

    const newBall = {
      x: clamp(curX + (facingRight ? 40 : -40), minX, maxX),
      y: clamp(120, 8, Math.max(8, ballMaxY)),
      vx: dist * 1.6,
      vy: 280,
      active: true
    };
    tennisBallRef.current = newBall;
    setTennisBall(newBall);

    setDialogue(`Fetch the ball! 🎾`);
    setShowDialogue(true);
  }, []);

  // Spawn landing dust puff
  const triggerDustPuff = (puffX: number, puffY: number) => {
    const newPuff = { id: Date.now(), x: puffX, y: puffY };
    setDustPuffs((prev) => [...prev, newPuff]);
    setTimeout(() => {
      setDustPuffs((prev) => prev.filter((p) => p.id !== newPuff.id));
    }, 600);
  };

  // FULL 2D PHYSICS ENGINE (X & Y Axis Patrol, Hops, Jumps, Gravity & Squash-Pop)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      // Cap elapsed time after tab throttling so physics never jumps several frames at once.
      const dt = clamp((time - lastTime) / 1000, 0, 0.05);
      lastTime = time;

      const { minX, maxX } = getHorizontalBounds(screenWidthRef.current);
      // Y is measured from the viewport bottom; leave room for the whole sprite.
      const { minY, maxY } = getVerticalBounds(window.innerHeight);
      baseDepthYRef.current = clamp(baseDepthYRef.current, minY, maxY);
      currentXRef.current = clamp(currentXRef.current, minX, maxX);
      currentYRef.current = clamp(currentYRef.current, minY, maxY);

      // 1. TENNIS BALL PHYSICS (X & Y)
      const activeBall = tennisBallRef.current;
      if (activeBall && activeBall.active) {
        let bx = activeBall.x + activeBall.vx * dt;
        let by = activeBall.y + activeBall.vy * dt;
        let bvy = activeBall.vy - 980 * dt;
        let bvx = activeBall.vx * Math.exp(-0.4 * dt);
        const ballMaxY = Math.max(8, window.innerHeight - 32);

        if (by <= 8) {
          by = 8;
          bvy = -bvy * 0.65;
          if (Math.abs(bvy) < 40) bvy = 0;
        } else if (by > ballMaxY) {
          by = ballMaxY;
          bvy = -Math.abs(bvy) * 0.7;
        }

        if (bx < minX) {
          bx = minX;
          bvx = -bvx * 0.7;
        } else if (bx > maxX) {
          bx = maxX;
          bvx = -bvx * 0.7;
        }

        const nextBall = { x: bx, y: by, vx: bvx, vy: bvy, active: true };
        tennisBallRef.current = nextBall;
        setTennisBall(nextBall);

        // Pet sprints and leaps to intercept the ball
        targetXOverrideRef.current = bx;

        if (Math.abs(currentXRef.current - bx) < 28 && by <= 25) {
          petAudio.playMunch();
          tennisBallRef.current = null;
          setTennisBall(null);
          targetXOverrideRef.current = null;
          setState('happy');
          setXp((p) => p + 30);
          setDialogue(`Caught the ball! Amazing fetch! (+30 XP) 🎾🏆`);
          setShowDialogue(true);

          // Victory pop leap
          velYRef.current = 240;
          setScaleY(1.3);
          setScaleX(0.85);

          const newHeart = { id: Date.now(), x: 0, y: -30 };
          setHearts((h) => [...h, newHeart]);
          pauseUntilRef.current = time + 2000;

          setTimeout(() => {
            setHearts((h) => h.filter((item) => item.id !== newHeart.id));
            setState('walk');
          }, 2000);
        }
      }

      // 2. PET VERTICAL GRAVITY & AIR PHYSICS (When tossed or leaping in Y)
      if (!isDragging) {
        const floorY = baseDepthYRef.current;

        // The idle walk animation lifts the sprite by at most 6px; don't mistake
        // that decorative bob for an airborne toss, or taps trigger a landing pop.
        if (currentYRef.current > floorY + 8 || velYRef.current !== 0) {
          const verticalStep = stepVerticalPhysics(
            currentYRef.current,
            velYRef.current,
            dt,
            floorY,
            maxY
          );
          const newY = verticalStep.position;
          const newVelY = verticalStep.velocity;

          // Aerial stretch responds to the bounded velocity result.
          if (newVelY > 100) {
            setScaleY(1.2);
            setScaleX(0.85);
          } else if (newVelY < -100) {
            setScaleY(1.15);
            setScaleX(0.9);
          }

          if (verticalStep.landed && verticalStep.bounced) {
            petAudio.playPop();
            triggerDustPuff(currentXRef.current, floorY);
            setScaleY(0.65);
            setScaleX(1.35);
            setTimeout(() => {
              setScaleY(1.0);
              setScaleX(1.0);
            }, 180);
          } else if (verticalStep.landed) {
            velXRef.current = 0;
            angularVelocityRef.current = 0;
            setRotation(0);
            setScaleY(1.0);
            setScaleX(1.0);
          }

          currentYRef.current = newY;
          velYRef.current = newVelY;
          setY(newY);

          // Horizontal drift while in air
          if (velXRef.current !== 0) {
            let newX = currentXRef.current + velXRef.current * dt;
            velXRef.current *= Math.exp(-1.2 * dt);
            newX = Math.max(minX, Math.min(maxX, newX));
            currentXRef.current = newX;
            setX(newX);
          }

          // Apply a finite, damped spin from the toss instead of adding a fixed angle every frame.
          if (velYRef.current !== 0 && Math.abs(angularVelocityRef.current) > 2) {
            setRotation((prev) => prev + angularVelocityRef.current * dt);
            angularVelocityRef.current *= Math.exp(-4 * dt);
          } else if (velYRef.current === 0) {
            angularVelocityRef.current = 0;
            setRotation(0);
          }
        } else {
          // 3. CONTINUOUS PATROL IN BOTH X AND Y (Depth wandering & Natural Steps)
          setRotation(0);
          const isPaused = time < pauseUntilRef.current;

          if (isPaused || state === 'sleep' || isLevelingUp) {
            if (state !== 'happy' && state !== 'sleep' && !isLevelingUp) {
              setState('idle');
            }
            currentYRef.current = baseDepthYRef.current;
            setY(baseDepthYRef.current);
          } else {
            // Smoothly walk toward a clicked depth instead of moving the floor instantly.
            if (targetDepthYRef.current !== null) {
              baseDepthYRef.current = moveTowards(baseDepthYRef.current, targetDepthYRef.current, 95 * dt);
              if (Math.abs(targetDepthYRef.current - baseDepthYRef.current) < 1) {
                baseDepthYRef.current = targetDepthYRef.current;
                targetDepthYRef.current = null;
              }
            }
            // Natural walking hop in Y axis: $|\sin(t \times 10)| \times 6\text{px}$
            const walkHop = Math.abs(Math.sin(time * 0.012)) * 6;
            currentYRef.current = baseDepthYRef.current + walkHop;
            setY(currentYRef.current);

            // Autonomous random playful leap in Y axis
            if (time > nextLeapTimeRef.current && !targetXOverrideRef.current) {
              nextLeapTimeRef.current = time + Math.random() * 5000 + 4000;
              velYRef.current = Math.random() * 120 + 220; // Hop into air!
              petAudio.playBoing();

              // Keep the current ground baseline while airborne. Changing it at takeoff
              // makes the floor move under the pet and causes visible teleporting.
            }

            const baseSpeed = 75 + (levelInfo.level - 1) * 12;
            const speed = tennisBallRef.current ? baseSpeed * 2.3 : laserActive ? baseSpeed * 1.8 : baseSpeed;

            let curX = currentXRef.current;

            // Target X override (from click or tennis ball)
            if (targetXOverrideRef.current !== null) {
              const diff = targetXOverrideRef.current - curX;
              if (Math.abs(diff) > 4) {
                const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * dt);
                curX += step;
                const newFacing = diff > 0 ? 'right' : 'left';
                directionRef.current = diff > 0 ? 1 : -1;
                setFacing(newFacing);
                setState('walk');
              } else {
                targetXOverrideRef.current = null;
                pauseUntilRef.current = time + 1400;
                setState('idle');
              }
            } else {
              if (patrolTargetXRef.current === null && time >= nextPatrolTimeRef.current) {
                const waypoints = getPatrolWaypoints(minX, maxX);
                const candidates = waypoints
                  .map((point, index) => ({ point, index }))
                  .filter(({ point, index }) => index !== lastPatrolIndexRef.current && Math.abs(point - curX) > 48);
                const choices = candidates.length > 0
                  ? candidates
                  : waypoints.map((point, index) => ({ point, index }));
                const chosen = choices[Math.floor(Math.random() * choices.length)];
                patrolTargetXRef.current = chosen.point;
                lastPatrolIndexRef.current = chosen.index;
              }

              if (patrolTargetXRef.current !== null) {
                const diff = patrolTargetXRef.current - curX;
                if (Math.abs(diff) > 4) {
                  curX += Math.sign(diff) * Math.min(Math.abs(diff), speed * dt);
                  directionRef.current = diff > 0 ? 1 : -1;
                  setFacing(diff > 0 ? 'right' : 'left');
                  if (state !== 'walk' && state !== 'happy') setState('walk');
                } else {
                  curX = patrolTargetXRef.current;
                  patrolTargetXRef.current = null;
                  pauseUntilRef.current = time + 900 + Math.random() * 1200;
                  nextPatrolTimeRef.current = time + 1500 + Math.random() * 1000;
                  setState('idle');

                  if (Math.random() < 0.28) {
                    const remark = currentPet.dialogues[Math.floor(Math.random() * currentPet.dialogues.length)];
                    setDialogue(remark);
                    setShowDialogue(true);
                    setTimeout(() => setShowDialogue(false), 4000);
                  }
                }
              } else if (state !== 'happy' && state !== 'sleep') {
                setState('idle');
              }
            }

            curX = clamp(curX, minX, maxX);
            currentXRef.current = curX;
            setX(curX);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isDragging, state, levelInfo.level, isLevelingUp, laserActive, currentPet]);

  // REALISTIC LIVING PET DRAG & REACT HANDLERS
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    setIsDragging(true);
    targetXOverrideRef.current = null;
    targetDepthYRef.current = null;
    patrolTargetXRef.current = null;
    // A fresh grab must not inherit momentum from a previous toss or click.
    velXRef.current = 0;
    velYRef.current = 0;
    angularVelocityRef.current = 0;
    setState('happy');
    petAudio.playBoing();

    // Wiggle and stretch when grabbed
    setScaleY(1.25);
    setScaleX(0.85);

    // Living pet reaction dialogue
    const grabPhrases = [
      "Whoa! Put me down! 🐾",
      "Wheeee! Flying familiar! 🪂",
      "Look at me, zero gravity! ✨",
      "Hold on tight! 🚀"
    ];
    setDialogue(grabPhrases[Math.floor(Math.random() * grabPhrases.length)]);
    setShowDialogue(true);

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentXRef.current,
      startY: currentYRef.current,
      totalDist: 0
    };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = dragStartRef.current.mouseY - moveEvent.clientY; // Invert Y for altitude

      dragStartRef.current.totalDist += Math.abs(dx) + Math.abs(dy);

      const { minX, maxX } = getHorizontalBounds(screenWidthRef.current);
      const { minY, maxY } = getVerticalBounds(window.innerHeight);
      const newX = clamp(dragStartRef.current.startX + dx, minX, maxX);
      const newY = clamp(dragStartRef.current.startY + dy, minY, maxY);

      currentXRef.current = newX;
      currentYRef.current = newY;
      setX(newX);
      setY(newY);

      // Living tilt reaction to drag speed
      const now = performance.now();
      if (lastMousePosRef.current) {
        const dt = (now - lastMousePosRef.current.time) / 1000;
        if (dt > 0.015) {
          const vx = (moveEvent.clientX - lastMousePosRef.current.x) / dt;
          const vy = (lastMousePosRef.current.y - moveEvent.clientY) / dt;
          velXRef.current = clamp(vx, -900, 900);
          velYRef.current = clamp(vy, -1000, 1000);

          // Cute dangle rotation based on drag horizontal speed
          setRotation(Math.max(-25, Math.min(25, vx * 0.04)));
          lastMousePosRef.current = { x: moveEvent.clientX, y: moveEvent.clientY, time: now };
        }
      }
    };

    const handlePointerUp = (event?: PointerEvent) => {
      const dist = dragStartRef.current?.totalDist || 0;
      const wasCancelled = event?.type === 'pointercancel';
      setIsDragging(false);
      dragStartRef.current = null;
      lastMousePosRef.current = null;

      if (wasCancelled) {
        // Cancellation is not a throw: discard stale pointer momentum.
        velXRef.current = 0;
        velYRef.current = 0;
        angularVelocityRef.current = 0;
        setRotation(0);
      }

      // Clean distinction: Click (< 8px total movement) vs Drag (> 8px)
      if (wasCancelled) {
        setState('walk');
      } else if (dist < 8) {
        // A tap is not a throw: discard pointer jitter so it cannot launch the pet.
        velXRef.current = 0;
        velYRef.current = 0;
        angularVelocityRef.current = 0;
        setRotation(0);
        petAudio.playChirp();
        setIsMenuOpen(true);
        setXp((p) => p + 6);
        const newHeart = { id: Date.now(), x: 0, y: -25 };
        setHearts((prev) => [...prev, newHeart]);
        setTimeout(() => {
          setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 1200);
      } else {
        // Anchor the landing baseline to the release position so a toss never snaps
        // toward a stale floor position from before the drag.
        const { minY, maxY } = getVerticalBounds(window.innerHeight);
        baseDepthYRef.current = clamp(currentYRef.current, minY, maxY);
        currentYRef.current = baseDepthYRef.current;
        targetDepthYRef.current = null;
        patrolTargetXRef.current = null;
        nextPatrolTimeRef.current = performance.now() + 1800;
        // Derive a short spin from throw speed; physics damps it out.
        angularVelocityRef.current = Math.max(-240, Math.min(240, velXRef.current * 0.18));
        setState('happy');
        setDialogue("WHEEE! Airtime! 🪂");
      }

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  // Laser Pointer follower
  useEffect(() => {
    if (!laserActive) {
      setLaserPos(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY > 40) {
        const altitude = window.innerHeight - e.clientY;
        setLaserPos({ x: e.clientX, y: altitude });
        const { minX, maxX } = getHorizontalBounds(screenWidthRef.current);
        targetXOverrideRef.current = clamp(e.clientX - 25, minX, maxX);
        patrolTargetXRef.current = null;
        // Keep the pet's ground baseline stable while the laser moves; updating it
        // on every mousemove makes the pet jump vertically from frame to frame.
        setFacing(e.clientX > currentXRef.current ? 'right' : 'left');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [laserActive]);

  // Click on floor to call pet
  useEffect(() => {
    const handleScreenClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[data-pet-menu]') || target.closest('[data-pet-root]') || isDragging || isMenuOpen) {
        return;
      }

      if (e.clientY > 40) {
        const { minX, maxX } = getHorizontalBounds(screenWidthRef.current);
        const { minY, maxY } = getVerticalBounds(window.innerHeight);
        const targetX = clamp(e.clientX - 25, minX, maxX);
        targetXOverrideRef.current = targetX;
        targetDepthYRef.current = clamp(window.innerHeight - e.clientY - 32, minY, maxY);
        patrolTargetXRef.current = null;
        setFacing(targetX > currentXRef.current ? 'right' : 'left');
        directionRef.current = targetX > currentXRef.current ? 1 : -1;
        petAudio.playChirp();
      }
    };

    window.addEventListener('click', handleScreenClick);
    return () => window.removeEventListener('click', handleScreenClick);
  }, [isDragging, isMenuOpen]);

  // Double click pet for backflip trick
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    petAudio.playLevelUp();
    setState('happy');
    setXp((p) => p + 15);
    setDialogue(`⭐ Backflip trick! Woohoo! (+15 XP) ⭐`);
    setShowDialogue(true);

    velYRef.current = 420; // Big pop into the air!
    const newHeart = { id: Date.now(), x: 0, y: -40 };
    setHearts((h) => [...h, newHeart]);

    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
      setState('walk');
    }, 2000);
  };

  const feedSnack = (snackName: string, xpGain: number) => {
    petAudio.playMunch();
    setState('happy');
    setXp((prev) => prev + xpGain);
    setDialogue(`Yum! ${currentPet.name} devoured the ${snackName}! (+${xpGain} XP) 🌟`);
    setShowDialogue(true);

    // Little happy bounce
    velYRef.current = 200;

    const newHeart = { id: Date.now(), x: 0, y: -30 };
    setHearts((h) => [...h, newHeart]);
    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
      setState('walk');
    }, 2000);
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    petAudio.isMuted = next;
    if (!next) petAudio.playChirp();
  };

  const spriteSrc = `${import.meta.env.BASE_URL}pets/${petId}_${state}.gif`;
  const lvl = levelInfo.level;
  const hasHalo = lvl >= 3;
  const hasOrbiters = lvl >= 4;
  const hasCosmicAura = lvl >= 5;

  return (
    <>
      {/* Bouncing Tennis Ball On Screen */}
      {tennisBall && (
        <div
          style={{
            left: `${tennisBall.x}px`,
            bottom: `${tennisBall.y}px`
          }}
          className="fixed z-40 text-2xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] animate-spin"
        >
          🎾
        </div>
      )}

      {/* Red Laser Pointer Dot */}
      {laserActive && laserPos && (
        <div
          style={{
            left: `${laserPos.x}px`,
            bottom: `${laserPos.y}px`
          }}
          className="fixed z-40 w-3 h-3 -ml-1.5 -mb-1.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-ping pointer-events-none"
        />
      )}

      {/* Landing Dust Puff Particle FX */}
      {dustPuffs.map((puff) => (
        <motion.div
          key={puff.id}
          initial={{ opacity: 0.9, scale: 0.4, y: 0 }}
          animate={{ opacity: 0, scale: 1.6, y: -10 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            left: `${puff.x + 12}px`,
            bottom: `${puff.y}px`
          }}
          className="fixed z-30 pointer-events-none text-base"
        >
          💨
        </motion.div>
      ))}

      {/* FREESTANDING SCREEN PET (FULL 2D X & Y PHYSICS) */}
      <div
        data-pet-root
        className="fixed z-40 select-none pointer-events-auto touch-none"
        style={{
          left: `${x}px`,
          bottom: `${y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
          transformOrigin: 'bottom center',
          transition: isDragging ? 'none' : 'transform 0.12s ease-out'
        }}
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="relative flex flex-col items-center">
          {/* Living reaction exclamation badge when dragged */}
          {isDragging && (
            <motion.div
              initial={{ scale: 0, y: 5 }}
              animate={{ scale: 1.2, y: -8 }}
              className="absolute -top-6 text-cyan-400 font-extrabold text-lg drop-shadow-[0_0_8px_#22d3ee] pointer-events-none animate-bounce"
            >
              ❗
            </motion.div>
          )}

          {/* Floating Speech Bubble */}
          <AnimatePresence>
            {showDialogue && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: 5 }}
                className="mb-2 bg-slate-900/95 text-white border border-cyan-400/60 backdrop-blur-md rounded-2xl px-3 py-1.5 text-xs font-mono shadow-[0_8px_24px_rgba(0,0,0,0.4)] max-w-[240px] text-center pointer-events-none"
              >
                <p className="leading-snug">{dialogue}</p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-cyan-400/60 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Hearts */}
          {hearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
              animate={{ opacity: 0, y: -60, scale: 1.6 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute -top-6 pointer-events-none text-rose-500 font-bold text-lg"
            >
              ❤️
            </motion.div>
          ))}

          {/* Level Up Golden Burst */}
          {isLevelingUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: [1, 1.4, 1] }}
              transition={{ duration: 1, repeat: 2 }}
              className="absolute -top-10 pointer-events-none text-amber-400 font-mono font-extrabold text-sm drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] whitespace-nowrap"
            >
              ⭐ LEVEL UP! ⭐
            </motion.div>
          )}

          {/* THE FREESTANDING PET SPRITE WITH VISUAL EVOLUTIONS */}
          <div
            className="relative p-1 flex items-center justify-center group"
            title={`Drag me to toss in the air! Click for menu! (${levelInfo.title} • Lv.${lvl})`}
          >
            {/* EVOLUTION 3: Cosmic / Super Saiyan Aura (Lv.5+) */}
            {hasCosmicAura && (
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 -m-3 rounded-full bg-gradient-to-t from-cyan-500/40 via-purple-500/30 to-amber-400/40 blur-md pointer-events-none"
              />
            )}

            {/* EVOLUTION 2: Orbiting Plasma Wisps (Lv.4+) */}
            {hasOrbiters && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute w-16 h-16 pointer-events-none"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse" />
              </motion.div>
            )}

            {/* EVOLUTION 1: Holographic Cyber Halo (Lv.3+) */}
            {hasHalo && (
              <motion.div
                animate={{
                  y: [-2, 2, -2],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 w-8 h-2.5 rounded-full border border-cyan-300 bg-cyan-400/30 shadow-[0_0_10px_#22d3ee] pointer-events-none"
              />
            )}

            {/* Pixel Sprite Image (Flips direction based on facing) */}
            <div
              style={{
                transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                transition: 'transform 0.15s ease-out'
              }}
            >
              <img
                src={spriteSrc}
                alt={currentPet.name}
                className={`w-14 h-14 object-contain filter ${
                  lvl >= 5 ? 'drop-shadow-[0_0_14px_rgba(6,182,212,0.8)]' : lvl >= 3 ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                }`}
                style={{ imageRendering: 'pixelated' }}
                draggable={false}
              />
            </div>

            {/* Mini subtle level tag */}
            <div className="absolute -bottom-2 bg-slate-900/90 text-cyan-400 border border-cyan-500/40 shadow-md rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold flex items-center gap-0.5 pointer-events-none">
              <span>Lv.{lvl}</span>
              <span className="text-white/70 text-[8px]">{currentPet.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ON-DEMAND SETTINGS & COMPANION POPOVER (Only opens when tapping pet) */}
      <AnimatePresence>
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900/95 border border-cyan-500/40 shadow-2xl rounded-2xl p-4 w-full max-w-[340px] flex flex-col gap-3 text-white"
              onClick={(e) => e.stopPropagation()}
              data-pet-menu
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentPet.icon}</span>
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white flex items-center gap-1.5">
                      {currentPet.name}
                      <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                        Lv.{lvl} {levelInfo.title}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">{currentPet.species}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleSound}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                    title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan-400" />}
                  </button>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Level Progress</span>
                  <span>{xp} Total XP</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                    animate={{ width: `${levelInfo.progress}%` }}
                  />
                </div>
              </div>

              {/* Choose Companion (7 pets) */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1.5">
                  Select Companion
                </span>
                <div className="grid grid-cols-7 gap-1">
                  {PET_CATALOG.map((p) => {
                    const isSelected = p.id === petId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPetId(p.id);
                          petAudio.playChirp();
                        }}
                        className={`p-1.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.6)] scale-105'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                        }`}
                        title={`${p.name} (${p.species})`}
                      >
                        <span className="text-base">{p.icon}</span>
                        <span className="text-[8px] font-mono mt-0.5 truncate max-w-full">
                          {p.name.slice(0, 4)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feed Treats & Mini Games */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1.5">
                  Treats & Mini-Games
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => feedSnack('Coffee', 15)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Feed Coffee (+15 XP)"
                  >
                    <Coffee size={14} className="text-amber-400" />
                    <span>Coffee</span>
                    <span className="text-[8px] text-slate-400">+15 XP</span>
                  </button>

                  <button
                    onClick={() => feedSnack('Cookie', 20)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Feed Cookie (+20 XP)"
                  >
                    <Cookie size={14} className="text-amber-300" />
                    <span>Cookie</span>
                    <span className="text-[8px] text-slate-400">+20 XP</span>
                  </button>

                  <button
                    onClick={() => {
                      spawnTennisBall();
                      setIsMenuOpen(false);
                    }}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Play Fetch! Throws tennis ball on screen"
                  >
                    <span className="text-sm">🎾</span>
                    <span>Fetch</span>
                    <span className="text-[8px] text-slate-400">+30 XP</span>
                  </button>

                  <button
                    onClick={() => {
                      setLaserActive((l) => !l);
                      setIsMenuOpen(false);
                    }}
                    className={`p-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono ${
                      laserActive ? 'bg-rose-500/30 text-rose-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                    title="Toggle Laser Pointer"
                  >
                    <Crosshair size={14} className="text-rose-400" />
                    <span>Laser</span>
                    <span className="text-[8px] text-slate-400">{laserActive ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-slate-800/60 rounded-xl p-2.5 text-[10px] font-mono text-slate-300 border border-slate-700/60 space-y-1">
                <p className="text-cyan-400 font-bold flex items-center gap-1">
                  <Sparkles size={11} /> Living Companion Physics:
                </p>
                <p className="text-slate-400 leading-relaxed">
                  • 🪂 <strong>Drag & Toss:</strong> Grab your pet, fling it into the air, and watch it bounce with a pop!<br />
                  • 🐾 <strong>2D Patrol:</strong> Hops and wanders naturally in X & Y depth.<br />
                  • ⭐ <strong>Double-Click:</strong> Acrobatic 360° backflip pop trick!<br />
                  • 🎾 <strong>Play Fetch:</strong> Toss tennis ball for pet to chase!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
