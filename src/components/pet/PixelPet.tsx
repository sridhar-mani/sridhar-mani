import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Coffee, Cookie, Bug, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { petAudio } from './PixelPetAudio';

type PetType = 'shiba' | 'fox';
type PetState = 'idle' | 'happy' | 'walk' | 'sleep';

export const PixelPet = () => {
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_pet_xp');
      return saved ? parseInt(saved, 10) : 40;
    } catch {
      return 40;
    }
  });

  const [petType, setPetType] = useState<PetType>('shiba');
  const [state, setState] = useState<PetState>('idle');
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [dialogue, setDialogue] = useState<string>("Hi! I'm Byte, Sridhar's cyber familiar! 🐾");
  const [showDialogue, setShowDialogue] = useState(true);

  const stage = xp < 90 ? 'baby' : 'adult';

  // Save XP
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_pet_xp', xp.toString());
    } catch {}
  }, [xp]);

  // Contextual portfolio dialogue based on scroll position
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const progress = scrollPos / (height > 0 ? height : 1);

      if (progress < 0.2) {
        setDialogue("Sridhar is building AI agents at Zenteiq! ⚡");
      } else if (progress < 0.45) {
        setDialogue("Check out the package.json tech stack! 📦");
      } else if (progress < 0.7) {
        setDialogue("NPC Code & WebGPU Worker are my favorites! 🚀");
      } else if (progress < 0.9) {
        setDialogue("Git commit log shows full architectural evolution! 📜");
      } else {
        setDialogue("Type 'email' in the terminal to connect! 📬");
      }

      setShowDialogue(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowDialogue(false), 5000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  // Inactivity detection -> sleep
  useEffect(() => {
    let sleepTimer: NodeJS.Timeout;

    const resetSleepTimer = () => {
      if (state === 'sleep') {
        setState('idle');
      }
      clearTimeout(sleepTimer);
      sleepTimer = setTimeout(() => {
        setState('sleep');
        setDialogue("Zzz... dreaming of clean pull requests... 🌙");
        setShowDialogue(true);
      }, 35000);
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

    setXp((prev) => {
      const next = prev + 6;
      if (prev < 90 && next >= 90) {
        petAudio.playLevelUp();
        setDialogue("Level Up! I evolved into a Cyber Familiar! ✨");
        setShowDialogue(true);
      }
      return next;
    });

    const newHeart = { id: Date.now(), x: Math.random() * 24 - 12 };
    setHearts((h) => [...h, newHeart]);
    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
    }, 1200);

    setTimeout(() => setState('idle'), 2200);
  };

  const feedSnack = (snackName: string, xpGain: number) => {
    petAudio.playMunch();
    setState('happy');
    setXp((prev) => {
      const next = prev + xpGain;
      if (prev < 90 && next >= 90) {
        petAudio.playLevelUp();
        setDialogue("Level Up! Max Evolution achieved! 🌟");
      } else {
        setDialogue(`Yum! Thanks for the ${snackName}! (+${xpGain} XP)`);
      }
      setShowDialogue(true);
      return next;
    });

    setTimeout(() => setState('idle'), 2200);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    petAudio.isMuted = nextMuted;
    if (!nextMuted) {
      petAudio.playChirp();
    }
  };

  // Select sprite URL based on pet type and state
  const spriteSrc = `${import.meta.env.BASE_URL}pets/${petType}_${state}.gif`;

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* Dialogue Speech Bubble */}
      <AnimatePresence>
        {showDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 bg-slate-900/95 text-white border border-cyan-400/50 backdrop-blur-md rounded-xl px-3 py-2 text-xs font-mono shadow-2xl max-w-[220px] relative pointer-events-none"
          >
            <p className="leading-snug">{dialogue}</p>
            <div className="absolute -bottom-1.5 left-7 w-3 h-3 bg-slate-900 border-r border-b border-cyan-400/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts Animation */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
          animate={{ opacity: 0, y: -50, scale: 1.4 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute -top-3 left-7 pointer-events-none text-rose-500 font-bold text-sm"
        >
          ❤️
        </motion.div>
      ))}

      {/* Main Pet Pill Card */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="relative bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-xl hover:shadow-cyan-500/20 rounded-2xl p-2.5 flex items-center gap-3 transition-shadow"
      >
        {/* Animated Sprite */}
        <div
          onClick={triggerPet}
          className="cursor-pointer p-1 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 transition-colors flex items-center justify-center min-w-[54px] min-h-[54px] overflow-hidden"
          title="Click to pet Byte & earn XP!"
        >
          <img
            src={spriteSrc}
            alt="Byte Pet"
            className={`w-12 h-12 object-contain transition-transform duration-300 ${
              stage === 'baby' ? 'scale-90' : 'scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]'
            }`}
            style={{
              imageRendering: 'pixelated',
            }}
          />
        </div>

        {/* Info & Level Meter */}
        <div className="flex flex-col min-w-[105px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1">
              Byte{' '}
              <span className="text-[10px] text-cyan-600 font-semibold bg-cyan-50 px-1.5 py-0.2 rounded-full border border-cyan-200">
                Lv.{stage === 'baby' ? 1 : 2}
              </span>
            </span>
            <button
              onClick={toggleSound}
              className="text-slate-400 hover:text-cyan-600 transition-colors p-0.5"
              title={isMuted ? 'Enable retro 8-bit sound' : 'Mute sound'}
              aria-label="Toggle Pet Sound"
            >
              {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-cyan-600" />}
            </button>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (xp / 150) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-500">
            <span>{xp} XP</span>
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="hover:text-cyan-600 transition-colors flex items-center gap-0.5 font-medium"
            >
              {isExpanded ? 'Hide' : 'Treats'}
              {isExpanded ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Expandable Feeding & Skin Tray */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl rounded-xl p-2.5 flex items-center gap-1.5"
          >
            <button
              onClick={() => feedSnack('Coffee', 15)}
              className="flex-1 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 transition-colors text-[10px] font-mono"
              title="Feed Coffee (+15 XP)"
            >
              <Coffee size={14} className="text-amber-600" />
              <span>Coffee</span>
            </button>

            <button
              onClick={() => feedSnack('Byte Cookie', 10)}
              className="flex-1 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-amber-50 text-slate-700 hover:text-amber-700 transition-colors text-[10px] font-mono"
              title="Feed Cookie (+10 XP)"
            >
              <Cookie size={14} className="text-amber-500" />
              <span>Cookie</span>
            </button>

            <button
              onClick={() => feedSnack('Bug Treat', 25)}
              className="flex-1 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors text-[10px] font-mono"
              title="Squash & Feed Bug (+25 XP)"
            >
              <Bug size={14} className="text-emerald-600" />
              <span>Bug</span>
            </button>

            <div className="w-px h-6 bg-slate-200" />

            <button
              onClick={() => setPetType((p) => (p === 'shiba' ? 'fox' : 'shiba'))}
              className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-colors text-[10px] font-mono flex flex-col items-center gap-1"
              title="Switch between Shiba Dog and Cyber Fox"
            >
              <Sparkles size={14} className="text-purple-500" />
              <span>{petType === 'shiba' ? 'Fox' : 'Shiba'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
