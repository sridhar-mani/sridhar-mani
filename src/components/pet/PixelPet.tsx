import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Coffee, Cookie, Bug, ChevronUp, ChevronDown, Sparkles, Footprints, Anchor, Zap } from 'lucide-react';
import { petAudio } from './PixelPetAudio';

export type PetType = 'shiba' | 'fox';
export type PetState = 'idle' | 'happy' | 'walk' | 'sleep';

// Continuous dynamic RPG progression formula
export interface LevelInfo {
  level: number;
  title: string;
  progress: number;
  currentThreshold: number;
  nextThreshold: number;
}

export const getLevelInfo = (xp: number): LevelInfo => {
  const thresholds = [0, 40, 100, 180, 300, 460, 660, 920, 1240, 1620, 2100];
  const titles = [
    'Cyber Pup',
    'Neon Scout',
    'Cyber Familiar',
    'Neural Vanguard',
    'Quantum Hound',
    'Matrix Sentinel',
    'AI Orchestrator',
    'Byte Overlord',
    'Tech Titan',
    'Singularity Apex',
    'Cosmic Entity'
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
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('portfolio_pet_xp');
      return saved ? parseInt(saved, 10) : 45;
    } catch {
      return 45;
    }
  });

  const [petType, setPetType] = useState<PetType>('shiba');
  const [state, setState] = useState<PetState>('idle');
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRoaming, setIsRoaming] = useState(true); // Roaming screen enabled by default
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [positionX, setPositionX] = useState(80); // X position in pixels
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [treatTarget, setTreatTarget] = useState<{ x: number; icon: string } | null>(null);
  const [dialogue, setDialogue] = useState<string>("Hi! I'm Byte, Sridhar's cyber familiar! 🐾");
  const [showDialogue, setShowDialogue] = useState(true);

  const prevLevelRef = useRef(getLevelInfo(xp).level);
  const levelInfo = getLevelInfo(xp);

  // Save XP & handle level-up celebrations
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_pet_xp', xp.toString());
    } catch {}

    const currentLevel = getLevelInfo(xp).level;
    if (currentLevel > prevLevelRef.current) {
      petAudio.playLevelUp();
      setDialogue(`🎉 LEVEL UP! Byte evolved to Lv.${currentLevel} ${levelInfo.title}! ✨`);
      setShowDialogue(true);
      setState('happy');
      setTimeout(() => setState('idle'), 3000);
    }
    prevLevelRef.current = currentLevel;
  }, [xp, levelInfo.title]);

  // Contextual portfolio dialogue based on scroll position
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const progress = scrollPos / (height > 0 ? height : 1);

      if (progress < 0.2) {
        setDialogue("Sridhar is building AI agents at Zenteiq! ⚡");
      } else if (progress < 0.4) {
        setDialogue("Check out the package.json tech stack! 📦");
      } else if (progress < 0.65) {
        setDialogue("NPC Code & WebGPU Worker are my favorites! 🚀");
      } else if (progress < 0.85) {
        setDialogue("Explore the research papers & deep learning repos! 📜");
      } else {
        setDialogue("Type 'email' in the terminal to connect with Sridhar! 📬");
      }

      setShowDialogue(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowDialogue(false), 5500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Autonomous Roaming Logic across screen
  useEffect(() => {
    if (!isRoaming || state === 'sleep' || treatTarget) return;

    let roamTimer: NodeJS.Timeout;

    const planNextMove = () => {
      // Wander interval between 5 to 9 seconds
      const delay = Math.random() * 4000 + 5000;

      roamTimer = setTimeout(() => {
        if (state === 'sleep' || treatTarget) return;

        // Pick a destination along the bottom of the screen (leaving margins)
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const minX = 60;
        const maxX = Math.max(minX + 100, screenWidth - 140);
        const targetX = Math.floor(Math.random() * (maxX - minX) + minX);

        const distance = Math.abs(targetX - positionX);

        if (distance > 30) {
          const newFacing = targetX > positionX ? 'right' : 'left';
          setFacing(newFacing);
          setState('walk');
          setPositionX(targetX);

          // Calculate walk duration (approx 80px per second)
          const walkDuration = Math.min(6, Math.max(1.2, distance / 75));

          setTimeout(() => {
            setState('idle');
            // 25% chance to bark / speak a tip when arriving
            if (Math.random() < 0.25) {
              const remarks = [
                "Sniffing for clean pull requests... 🔍",
                "Patrolling the WebGPU buffer! ⚡",
                "Byte is on duty! 🐾",
                "All systems operational! 🟢",
                "Ready for new high-impact challenges! 🚀"
              ];
              setDialogue(remarks[Math.floor(Math.random() * remarks.length)]);
              setShowDialogue(true);
            }
          }, walkDuration * 1000);
        }

        planNextMove();
      }, delay);
    };

    planNextMove();

    return () => clearTimeout(roamTimer);
  }, [isRoaming, state, positionX, treatTarget]);

  // Inactivity detection -> sleep
  useEffect(() => {
    let sleepTimer: NodeJS.Timeout;

    const resetSleepTimer = () => {
      if (state === 'sleep') {
        setState('idle');
        setDialogue("Byte woke up and is ready to explore! 🐾");
        setShowDialogue(true);
      }
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => {
        setState('sleep');
        setDialogue("Zzz... dreaming of clean pull requests... 🌙");
        setShowDialogue(true);
      }, 45000);
    };

    window.addEventListener('mousemove', resetSleepTimer, { passive: true });
    window.addEventListener('scroll', resetSleepTimer, { passive: true });
    resetSleepTimer();

    return () => {
      window.removeEventListener('mousemove', resetSleepTimer);
      window.removeEventListener('scroll', resetSleepTimer);
      clearTimeout(sleepTimer);
    };
  }, [state]);

  const triggerPet = () => {
    petAudio.playChirp();
    setState('happy');

    setXp((prev) => prev + 6);

    const newHeart = { id: Date.now(), x: Math.random() * 24 - 12, y: -20 };
    setHearts((h) => [...h, newHeart]);
    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
    }, 1200);

    setTimeout(() => setState('idle'), 2200);
  };

  // Feed treat with walk-over animation
  const feedSnack = useCallback((snackName: string, xpGain: number, icon: string) => {
    // If roaming, throw treat slightly ahead of pet to chase
    if (isRoaming) {
      const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const throwDistance = facing === 'right' ? 90 : -90;
      const snackX = Math.min(Math.max(60, positionX + throwDistance), screenWidth - 140);

      setTreatTarget({ x: snackX, icon });
      setFacing(snackX > positionX ? 'right' : 'left');
      setState('walk');
      setPositionX(snackX);

      // Pet runs to treat
      setTimeout(() => {
        petAudio.playMunch();
        setTreatTarget(null);
        setState('happy');
        setXp((prev) => prev + xpGain);
        setDialogue(`Nom nom! Byte loved the ${snackName}! (+${xpGain} XP) 🍪`);
        setShowDialogue(true);

        const newHeart = { id: Date.now(), x: 0, y: -30 };
        setHearts((h) => [...h, newHeart]);
        setTimeout(() => {
          setHearts((h) => h.filter((item) => item.id !== newHeart.id));
        }, 1200);

        setTimeout(() => setState('idle'), 2200);
      }, 1100);
    } else {
      petAudio.playMunch();
      setState('happy');
      setXp((prev) => prev + xpGain);
      setDialogue(`Yum! Thanks for the ${snackName}! (+${xpGain} XP)`);
      setShowDialogue(true);
      setTimeout(() => setState('idle'), 2200);
    }
  }, [facing, isRoaming, positionX]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    petAudio.isMuted = nextMuted;
    if (!nextMuted) {
      petAudio.playChirp();
    }
  };

  // Sprite selection
  const spriteSrc = `${import.meta.env.BASE_URL}pets/${petType}_${state}.gif`;

  // Visual scaling based on dynamic level
  const getPetScaleClass = () => {
    if (levelInfo.level === 1) return 'scale-90';
    if (levelInfo.level === 2) return 'scale-100';
    if (levelInfo.level <= 4) return 'scale-105 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]';
    return 'scale-115 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]';
  };

  return (
    <div className="select-none pointer-events-none">
      {/* Treat Item On Floor When Thrown */}
      {treatTarget && (
        <motion.div
          initial={{ opacity: 0, scale: 0.4, y: -30 }}
          animate={{ opacity: 1, scale: 1.1, y: 0 }}
          exit={{ opacity: 0, scale: 0 }}
          style={{ left: `${treatTarget.x + 20}px` }}
          className="fixed bottom-4 z-40 text-xl pointer-events-none drop-shadow-md"
        >
          {treatTarget.icon}
        </motion.div>
      )}

      {/* Roaming Pet Entity */}
      <motion.div
        className="fixed bottom-4 z-40 pointer-events-auto flex flex-col items-center"
        animate={{
          left: isRoaming ? `${positionX}px` : '24px',
          bottom: '16px'
        }}
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: state === 'walk' ? 1.4 : 0.4
        }}
      >
        {/* Dialogue Speech Bubble */}
        <AnimatePresence>
          {showDialogue && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-2 bg-slate-900/95 text-white border border-cyan-400/50 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-mono shadow-2xl max-w-[230px] relative pointer-events-none text-center"
            >
              <p className="leading-snug">{dialogue}</p>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-cyan-400/50 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Hearts Animation */}
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
            animate={{ opacity: 0, y: -55, scale: 1.5 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            className="absolute -top-4 pointer-events-none text-rose-500 font-bold text-base"
          >
            ❤️
          </motion.div>
        ))}

        {/* Main Pet Control Pill */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl hover:shadow-cyan-500/20 rounded-2xl p-2 flex items-center gap-2.5 transition-shadow"
        >
          {/* Animated Interactive Sprite */}
          <div
            onClick={triggerPet}
            className="cursor-pointer p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-cyan-50 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center min-w-[50px] min-h-[50px] overflow-hidden"
            title="Click to pet Byte & earn XP!"
            style={{
              transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
              transition: 'transform 0.2s ease-out'
            }}
          >
            <img
              src={spriteSrc}
              alt="Byte Pixel Companion"
              className={`w-12 h-12 object-contain transition-transform duration-300 ${getPetScaleClass()}`}
              style={{
                imageRendering: 'pixelated',
              }}
            />
          </div>

          {/* Dynamic Info & RPG Level Meter */}
          <div className="flex flex-col min-w-[110px]">
            <div className="flex items-center justify-between gap-1.5">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                Byte
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-50 dark:bg-cyan-950/50 px-1.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800" title={levelInfo.title}>
                  Lv.{levelInfo.level}
                </span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsRoaming((r) => !r)}
                  className={`p-0.5 rounded transition-colors ${isRoaming ? 'text-cyan-600' : 'text-slate-400'}`}
                  title={isRoaming ? 'Roaming screen enabled (Click to dock in corner)' : 'Docked in corner (Click to roam)'}
                  aria-label="Toggle Roam Mode"
                >
                  {isRoaming ? <Footprints size={12} /> : <Anchor size={12} />}
                </button>
                <button
                  onClick={toggleSound}
                  className="text-slate-400 hover:text-cyan-600 transition-colors p-0.5"
                  title={isMuted ? 'Enable retro 8-bit sound' : 'Mute sound'}
                  aria-label="Toggle Pet Sound"
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-cyan-600" />}
                </button>
              </div>
            </div>

            {/* Title */}
            <span className="text-[9px] font-mono text-cyan-700 dark:text-cyan-400 font-medium truncate max-w-[115px]">
              {levelInfo.title}
            </span>

            {/* Continuous XP Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
                animate={{ width: `${levelInfo.progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-500 dark:text-slate-400">
              <span>{xp} XP</span>
              <button
                onClick={() => setIsExpanded((v) => !v)}
                className="hover:text-cyan-600 transition-colors flex items-center gap-0.5 font-medium"
              >
                {isExpanded ? 'Hide' : 'Menu'}
                {isExpanded ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Expandable Feeding & Actions Drawer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.94 }}
              className="mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl rounded-xl p-2 flex items-center gap-1.5"
            >
              <button
                onClick={() => feedSnack('Coffee', 15, '☕')}
                className="flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-cyan-700 transition-colors text-[10px] font-mono"
                title="Feed Coffee (+15 XP)"
              >
                <Coffee size={13} className="text-amber-600" />
                <span>Coffee</span>
              </button>

              <button
                onClick={() => feedSnack('Byte Cookie', 10, '🍪')}
                className="flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-amber-700 transition-colors text-[10px] font-mono"
                title="Feed Cookie (+10 XP)"
              >
                <Cookie size={13} className="text-amber-500" />
                <span>Cookie</span>
              </button>

              <button
                onClick={() => feedSnack('Bug Treat', 25, '🐛')}
                className="flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-700 transition-colors text-[10px] font-mono"
                title="Squash Bug Treat (+25 XP)"
              >
                <Bug size={13} className="text-emerald-600" />
                <span>Bug</span>
              </button>

              <button
                onClick={() => feedSnack('Neural Boost', 40, '⚡')}
                className="flex-1 flex flex-col items-center gap-0.5 p-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-cyan-600 transition-colors text-[10px] font-mono"
                title="Supercharge with Neural Boost (+40 XP)"
              >
                <Zap size={13} className="text-cyan-500" />
                <span>Boost</span>
              </button>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

              <button
                onClick={() => setPetType((p) => (p === 'shiba' ? 'fox' : 'shiba'))}
                className="p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-700 transition-colors text-[10px] font-mono flex flex-col items-center gap-0.5"
                title="Switch between Shiba Dog and Cyber Fox"
              >
                <Sparkles size={13} className="text-purple-500" />
                <span>{petType === 'shiba' ? 'Fox' : 'Shiba'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
