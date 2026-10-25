import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Coffee, Cookie, Bug, Zap, Sparkles, Footprints, Heart, Compass, Disc, Crosshair } from 'lucide-react';
import { petAudio } from './PixelPetAudio';

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
      "Try dragging and tossing me in the air! 🪂",
      "Click 'Fetch' to throw a tennis ball for me to catch! 🎾",
      "Type 'agent' in the terminal to watch a simulated autonomous coding agent! 🤖"
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
      "Quack! Throw me a ball or drag me around the screen! 🎾"
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

  const [state, setState] = useState<PetState>('idle');
  const [x, setX] = useState<number>(140);
  const [y, setY] = useState<number>(0); // Vertical altitude above floor (px)
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isMuted, setIsMuted] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dialogue, setDialogue] = useState<string>('');
  const [showDialogue, setShowDialogue] = useState(true);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState<{ x: number; y: number } | null>(null);

  // Tennis Ball Physics State
  const [tennisBall, setTennisBall] = useState<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    active: boolean;
  } | null>(null);

  const prevLevelRef = useRef<number>(getLevelInfo(xp).level);
  const targetXRef = useRef<number>(x);
  const currentXRef = useRef<number>(x);
  const currentYRef = useRef<number>(0);
  const velXRef = useRef<number>(0);
  const velYRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const isRoamingRef = useRef<boolean>(true);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const currentPet = PET_CATALOG.find((p) => p.id === petId) || PET_CATALOG[0];
  const levelInfo = getLevelInfo(xp);

  // Sync ref
  currentXRef.current = x;
  currentYRef.current = y;

  // Persist selections
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
    const t = setTimeout(() => setShowDialogue(false), 7000);
    return () => clearTimeout(t);
  }, [petId]);

  // Listen for terminal custom event to switch pet or trigger tricks
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
        setState('idle');
      }, 3500);
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = currentLvl;
  }, [xp, levelInfo.title]);

  // Spawn Bouncing Tennis Ball for Fetch
  const spawnTennisBall = useCallback(() => {
    petAudio.playChirp();
    const startX = currentXRef.current + (facing === 'right' ? 60 : -60);
    const targetThrowX = facing === 'right' ? startX + 280 : startX - 280;
    const clampedThrowX = Math.max(60, Math.min(window.innerWidth - 80, targetThrowX));
    const dist = clampedThrowX - startX;

    setTennisBall({
      x: startX,
      y: 120,
      vx: dist * 1.5,
      vy: 240,
      active: true
    });

    setDialogue(`Woof! Fetch the ball! 🎾`);
    setShowDialogue(true);
  }, [facing]);

  // Comprehensive 60FPS Physics Engine (Movement, Drag & Toss, Ball Physics)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // 1. TENNIS BALL PHYSICS
      if (tennisBall && tennisBall.active) {
        let bx = tennisBall.x + tennisBall.vx * dt;
        let by = tennisBall.y + tennisBall.vy * dt;
        let bvy = tennisBall.vy - 980 * dt; // gravity
        let bvx = tennisBall.vx * (1 - 0.5 * dt); // friction

        // Bounce on floor
        if (by <= 0) {
          by = 0;
          bvy = -bvy * 0.6; // restitution
          if (Math.abs(bvy) < 40) bvy = 0;
        }

        // Clamp inside screen bounds
        if (bx < 40) {
          bx = 40;
          bvx = -bvx * 0.7;
        } else if (bx > window.innerWidth - 60) {
          bx = window.innerWidth - 60;
          bvx = -bvx * 0.7;
        }

        setTennisBall({
          x: bx,
          y: by,
          vx: bvx,
          vy: bvy,
          active: true
        });

        // Pet chases the ball!
        targetXRef.current = bx;
        setFacing(bx > currentXRef.current ? 'right' : 'left');

        // Check if pet caught the ball
        if (Math.abs(currentXRef.current - bx) < 25 && by <= 20) {
          petAudio.playMunch();
          setTennisBall(null);
          setState('happy');
          setXp((p) => p + 30);
          setDialogue(`Caught the ball! Amazing fetch! (+30 XP) 🎾🏆`);
          setShowDialogue(true);

          const newHeart = { id: Date.now(), x: 0, y: -30 };
          setHearts((h) => [...h, newHeart]);
          setTimeout(() => {
            setHearts((h) => h.filter((item) => item.id !== newHeart.id));
            setState('idle');
          }, 2400);
        }
      }

      // 2. PET VERTICAL GRAVITY & AIR PHYSICS (When tossed)
      if (!isDragging) {
        if (currentYRef.current > 0 || velYRef.current !== 0) {
          let newY = currentYRef.current + velYRef.current * dt;
          let newVelY = velYRef.current - 1400 * dt; // gravity

          if (newY <= 0) {
            newY = 0;
            // Floor bounce
            if (Math.abs(newVelY) > 120) {
              newVelY = -newVelY * 0.45;
              petAudio.playChirp();
            } else {
              newVelY = 0;
            }
          }
          currentYRef.current = newY;
          velYRef.current = newVelY;
          setY(newY);

          // Horizontal drift while in air
          if (velXRef.current !== 0) {
            let newX = currentXRef.current + velXRef.current * dt;
            velXRef.current *= 1 - 1.2 * dt;
            newX = Math.max(30, Math.min(window.innerWidth - 80, newX));
            currentXRef.current = newX;
            setX(newX);
          }
        } else {
          // 3. HORIZONTAL WALKING ALONG FLOOR
          const targetX = targetXRef.current;
          const curX = currentXRef.current;
          const diff = targetX - curX;

          const baseSpeed = 85 + (levelInfo.level - 1) * 15;
          const speed = tennisBall ? baseSpeed * 2.2 : laserActive ? baseSpeed * 1.8 : baseSpeed;

          if (Math.abs(diff) > 4) {
            const step = Math.sign(diff) * Math.min(Math.abs(diff), speed * dt);
            const newX = curX + step;
            currentXRef.current = newX;
            setX(newX);
            setIsWalking(true);
            if (state !== 'walk' && state !== 'happy' && !isLevelingUp) {
              setState('walk');
            }
          } else {
            if (isWalking) {
              setIsWalking(false);
              if (state === 'walk') {
                setState('idle');
              }
            }
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [tennisBall, isDragging, state, isWalking, levelInfo.level, isLevelingUp, laserActive]);

  // Autonomous wandering scheduler across the screen
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const scheduleWander = () => {
      const delay = Math.random() * 4000 + 4000;
      timer = setTimeout(() => {
        if (!isRoamingRef.current || state === 'sleep' || tennisBall || isLevelingUp || isDragging || laserActive) {
          scheduleWander();
          return;
        }

        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const minX = 40;
        const maxX = Math.max(minX + 80, screenWidth - 100);

        const nextX = Math.floor(Math.random() * (maxX - minX) + minX);
        targetXRef.current = nextX;
        setFacing(nextX > currentXRef.current ? 'right' : 'left');

        if (Math.random() < 0.25) {
          const remark = currentPet.dialogues[Math.floor(Math.random() * currentPet.dialogues.length)];
          setDialogue(remark);
          setShowDialogue(true);
          setTimeout(() => setShowDialogue(false), 5500);
        }

        scheduleWander();
      }, delay);
    };

    scheduleWander();
    return () => clearTimeout(timer);
  }, [currentPet, state, tennisBall, isLevelingUp, isDragging, laserActive]);

  // Mouse drag & toss handlers for Desktop Pet ragdoll physics
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setState('happy');
    petAudio.playChirp();

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: currentXRef.current,
      startY: currentYRef.current
    };
    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = dragStartRef.current.mouseY - moveEvent.clientY; // invert Y for altitude

      const newX = Math.max(30, Math.min(window.innerWidth - 80, dragStartRef.current.startX + dx));
      const newY = Math.max(0, dragStartRef.current.startY + dy);

      currentXRef.current = newX;
      currentYRef.current = newY;
      setX(newX);
      setY(newY);

      // Track release velocity
      const now = performance.now();
      if (lastMousePosRef.current) {
        const dt = (now - lastMousePosRef.current.time) / 1000;
        if (dt > 0.015) {
          velXRef.current = (moveEvent.clientX - lastMousePosRef.current.x) / dt;
          velYRef.current = (lastMousePosRef.current.y - moveEvent.clientY) / dt;
          lastMousePosRef.current = { x: moveEvent.clientX, y: moveEvent.clientY, time: now };
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      lastMousePosRef.current = null;
      setState('idle');

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Laser Pointer follower
  useEffect(() => {
    if (!laserActive) {
      setLaserPos(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY > window.innerHeight * 0.45) {
        setLaserPos({ x: e.clientX, y: window.innerHeight - e.clientY });
        targetXRef.current = Math.max(30, Math.min(window.innerWidth - 80, e.clientX - 25));
        setFacing(e.clientX > currentXRef.current ? 'right' : 'left');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [laserActive]);

  // Click on floor to run there
  useEffect(() => {
    const handleScreenClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('[data-pet-menu]')) {
        return;
      }

      if (e.clientY > window.innerHeight * 0.5) {
        const targetX = Math.max(30, Math.min(e.clientX - 25, window.innerWidth - 80));
        targetXRef.current = targetX;
        setFacing(targetX > currentXRef.current ? 'right' : 'left');
        petAudio.playChirp();
      }
    };

    window.addEventListener('click', handleScreenClick);
    return () => window.removeEventListener('click', handleScreenClick);
  }, []);

  // Double click pet to do backflip trick
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    petAudio.playLevelUp();
    setState('happy');
    setXp((p) => p + 15);
    setDialogue(`⭐ Backflip trick! Woohoo! (+15 XP) ⭐`);
    setShowDialogue(true);

    velYRef.current = 400; // pop into air!
    const newHeart = { id: Date.now(), x: 0, y: -40 };
    setHearts((h) => [...h, newHeart]);

    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
      setState('idle');
    }, 2000);
  };

  const feedSnack = (snackName: string, xpGain: number, icon: string) => {
    petAudio.playMunch();
    setState('happy');
    setXp((prev) => prev + xpGain);
    setDialogue(`Yum! ${currentPet.name} devoured the ${snackName}! (+${xpGain} XP) 🌟`);
    setShowDialogue(true);

    const newHeart = { id: Date.now(), x: 0, y: -30 };
    setHearts((h) => [...h, newHeart]);
    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
      setState('idle');
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
            transform: `translate3d(${tennisBall.x}px, ${-tennisBall.y}px, 0)`,
            transition: 'none'
          }}
          className="fixed bottom-2 z-40 text-2xl pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] animate-spin"
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

      {/* FREESTANDING SCREEN PET WITH GRAVITY & DRAG PHYSICS */}
      <div
        className="fixed bottom-2 z-40 select-none pointer-events-auto"
        style={{
          transform: `translate3d(${x}px, ${-y}px, 0)`,
          transition: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        <div className="relative flex flex-col items-center">
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

          {/* Level Up Celebration */}
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
            className="relative p-1 flex items-center justify-center"
            title={`Drag & toss me! Double-click for backflip trick! (${levelInfo.title} • Lv.${lvl})`}
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

            {/* Raw Pixel Art Sprite Image (No bounding box!) */}
            <motion.div
              animate={{
                rotate: isDragging ? [0, 10, -10, 0] : y > 20 ? [0, 360] : 0
              }}
              transition={{ duration: y > 20 ? 0.6 : 0.2 }}
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
            </motion.div>

            {/* Floating Level Tag Pill */}
            <div className="absolute -bottom-2 bg-slate-900/90 text-cyan-400 border border-cyan-500/40 shadow-md rounded-full px-1.5 py-0.2 text-[9px] font-mono font-bold flex items-center gap-0.5">
              <span>Lv.{lvl}</span>
              <span className="text-white/70 text-[8px]">{currentPet.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION HUD DOCK (Bottom-Left Corner) */}
      <div className="fixed bottom-4 left-4 z-40 select-none">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-900/90 text-white backdrop-blur-md border border-cyan-500/30 shadow-2xl rounded-2xl p-2.5 flex items-center gap-2.5"
          data-pet-menu
        >
          {/* Companion Selector & Quick Level */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 p-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            title="Open Pet Companions & Treat Tray"
          >
            <span className="text-lg">{currentPet.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-mono font-bold text-white leading-none">
                {currentPet.name}
              </span>
              <span className="text-[9px] font-mono text-cyan-400">
                Lv.{lvl} • {levelInfo.title}
              </span>
            </div>
          </button>

          {/* Mini XP Bar */}
          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* PLAY FETCH TENNIS BALL BUTTON */}
          <button
            onClick={spawnTennisBall}
            className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors flex items-center gap-1 text-[10px] font-mono font-semibold"
            title="Play Fetch! Throws a tennis ball for pet to chase (+30 XP)"
          >
            <span>🎾</span>
            <span className="hidden sm:inline">Fetch</span>
          </button>

          {/* LASER POINTER TOGGLE */}
          <button
            onClick={() => setLaserActive((l) => !l)}
            className={`p-1 rounded-lg transition-colors flex items-center gap-1 text-[10px] font-mono font-semibold ${
              laserActive ? 'bg-rose-500/30 text-rose-300 shadow-[0_0_8px_#f43f5e]' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Laser Pointer Mode (Pet chases red dot)"
          >
            <Crosshair size={12} className={laserActive ? 'text-rose-400 animate-spin' : ''} />
            <span className="hidden sm:inline">Laser</span>
          </button>

          {/* Quick Sound Toggle */}
          <button
            onClick={toggleSound}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
            title={isMuted ? 'Unmute 8-bit Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-cyan-400" />}
          </button>

          {/* Toggle Menu */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="px-2 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-[10px] font-semibold transition-colors"
          >
            {isMenuOpen ? 'Close' : 'Menu'}
          </button>
        </motion.div>

        {/* EXPANDED PET SELECTOR & FEEDING DRAWER */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mt-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 shadow-2xl rounded-2xl p-3 w-[310px] flex flex-col gap-3 text-white"
              data-pet-menu
            >
              {/* Pet Companions Selector (All 7 Pets!) */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block mb-1.5">
                  Select Companion (7 Available)
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
                        title={`${p.name} - ${p.title} (${p.species})`}
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

              {/* Feeding Treats & Level Boost */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1.5">
                  Toss Treats & Level Up XP
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => feedSnack('Coffee', 15, '☕')}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Toss Coffee (+15 XP)"
                  >
                    <Coffee size={13} className="text-amber-400" />
                    <span>Coffee</span>
                    <span className="text-[8px] text-slate-400">+15 XP</span>
                  </button>

                  <button
                    onClick={() => feedSnack('Byte Cookie', 20, '🍪')}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-200 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Toss Cookie (+20 XP)"
                  >
                    <Cookie size={13} className="text-amber-300" />
                    <span>Cookie</span>
                    <span className="text-[8px] text-slate-400">+20 XP</span>
                  </button>

                  <button
                    onClick={() => feedSnack('Bug Treat', 30, '🐛')}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Squash Bug Treat (+30 XP)"
                  >
                    <Bug size={13} className="text-emerald-400" />
                    <span>Bug</span>
                    <span className="text-[8px] text-slate-400">+30 XP</span>
                  </button>

                  <button
                    onClick={() => feedSnack('Neural Boost', 50, '⚡')}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 flex flex-col items-center gap-0.5 transition-colors text-[10px] font-mono"
                    title="Supercharge (+50 XP)"
                  >
                    <Zap size={13} className="text-cyan-400" />
                    <span>Boost</span>
                    <span className="text-[8px] text-slate-400">+50 XP</span>
                  </button>
                </div>
              </div>

              {/* Evolution Perks Info */}
              <div className="bg-slate-800/60 rounded-xl p-2 text-[9px] font-mono text-slate-300 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-cyan-400 font-bold">
                  <span>Current: {levelInfo.title}</span>
                  <span>{xp} Total XP</span>
                </div>
                <p className="text-slate-400">
                  • 🪂 <strong>Drag & Toss:</strong> Click and throw pet with real physics!<br />
                  • 🎾 <strong>Play Fetch:</strong> Toss tennis ball for pet to chase!<br />
                  • ⭐ <strong>Trick:</strong> Double-click pet for acrobatic backflip!<br />
                  • Lv.3+ Cyber Halo • Lv.4+ Orbiting Wisps • Lv.5+ Saiyan Aura
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
