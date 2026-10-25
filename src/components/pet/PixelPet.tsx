import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Volume2, VolumeX, Coffee, Cookie, Bug, ChevronUp, ChevronDown } from 'lucide-react';
import {
  BABY_CAT_FRAMES,
  ADULT_CAT_FRAMES,
  CAT_PALETTE,
  SHIBA_PALETTE,
  type SpriteMatrix,
  type PetPalette,
} from './PixelPetSprites';
import { petAudio } from './PixelPetAudio';

// Procedural SVG Pixel Matrix Renderer
const PixelCanvas = ({
  matrix,
  palette,
  scale = 3,
}: {
  matrix: SpriteMatrix;
  palette: PetPalette;
  scale?: number;
}) => {
  const height = matrix.length;
  const width = Math.max(...matrix.map((r) => r.length));

  const pixels = useMemo(() => {
    const list: { x: number; y: number; fill: string }[] = [];
    matrix.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        const color = palette[char];
        if (color && char !== '.') {
          list.push({ x, y, fill: color });
        }
      }
    });
    return list;
  }, [matrix, palette]);

  return (
    <svg
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      className="select-none"
      style={{ shapeRendering: 'crispEdges' }}
    >
      {pixels.map((p, i) => (
        <rect key={i} x={p.x} y={p.y} width={1} height={1} fill={p.fill} />
      ))}
    </svg>
  );
};

export const PixelPet = () => {
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_pet_xp');
      return saved ? parseInt(saved, 10) : 35;
    } catch {
      return 35;
    }
  });

  const [state, setState] = useState<'idle' | 'happy' | 'eating' | 'sleep'>('idle');
  const [frameIndex, setFrameIndex] = useState(0);
  const [petType, setPetType] = useState<'cat' | 'shiba'>('cat');
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [dialogue, setDialogue] = useState<string>("Hi! I'm Byte, Sridhar's cyber pet! 🐾");
  const [showDialogue, setShowDialogue] = useState(true);

  const stage = xp < 70 ? 'baby' : 'adult';
  const palette = petType === 'cat' ? CAT_PALETTE : SHIBA_PALETTE;

  // Save XP to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('portfolio_pet_xp', xp.toString());
    } catch {}
  }, [xp]);

  // Animation frame ticker
  useEffect(() => {
    const frames =
      stage === 'baby'
        ? BABY_CAT_FRAMES[state] || BABY_CAT_FRAMES.idle
        : ADULT_CAT_FRAMES[state] || ADULT_CAT_FRAMES.idle;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 450);

    return () => clearInterval(interval);
  }, [state, stage]);

  // Contextual speech based on scroll
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
        setDialogue("Git log commit history shows full evolution! 📜");
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

  const triggerPet = () => {
    petAudio.playChirp();
    setState('happy');
    setXp((prev) => {
      const next = prev + 5;
      if (prev < 70 && next >= 70) {
        petAudio.playLevelUp();
        setDialogue("Level Up! I evolved into a Cyber Companion! ✨");
        setShowDialogue(true);
      }
      return next;
    });

    const newHeart = { id: Date.now(), x: Math.random() * 20 - 10, y: -20 };
    setHearts((h) => [...h, newHeart]);
    setTimeout(() => {
      setHearts((h) => h.filter((item) => item.id !== newHeart.id));
    }, 1000);

    setTimeout(() => setState('idle'), 1200);
  };

  const feedSnack = (snackName: string, xpGain: number) => {
    petAudio.playMunch();
    setState('eating');
    setXp((prev) => {
      const next = prev + xpGain;
      if (prev < 70 && next >= 70) {
        petAudio.playLevelUp();
        setDialogue("Level Up! I grew into an adult familiar! 🌟");
      } else {
        setDialogue(`Mmm! Thanks for the ${snackName}! (+${xpGain} XP)`);
      }
      setShowDialogue(true);
      return next;
    });

    setTimeout(() => setState('idle'), 1500);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    petAudio.isMuted = nextMuted;
    if (!nextMuted) {
      petAudio.playChirp();
    }
  };

  const currentFrames =
    stage === 'baby'
      ? BABY_CAT_FRAMES[state] || BABY_CAT_FRAMES.idle
      : ADULT_CAT_FRAMES[state] || ADULT_CAT_FRAMES.idle;

  const currentMatrix = currentFrames[frameIndex % currentFrames.length];

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showDialogue && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-2 bg-slate-900/90 text-white border border-cyan-400/50 backdrop-blur-md rounded-xl px-3 py-2 text-xs font-mono shadow-xl max-w-[210px] relative pointer-events-none"
          >
            <p className="leading-snug">{dialogue}</p>
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-900 border-r border-b border-cyan-400/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
          animate={{ opacity: 0, y: -45, scale: 1.4 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute -top-4 left-6 pointer-events-none text-rose-500 font-bold"
        >
          ❤️
        </motion.div>
      ))}

      {/* Main Pet Container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="relative bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-lg hover:shadow-cyan-500/20 rounded-2xl p-2.5 flex items-center gap-3 transition-shadow"
      >
        {/* Interactive Pixel Sprite Canvas */}
        <div
          onClick={triggerPet}
          className="cursor-pointer p-1 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 transition-colors flex items-center justify-center min-w-[48px] min-h-[48px]"
          title="Click to pet Byte & earn XP!"
        >
          <PixelCanvas matrix={currentMatrix} palette={palette} scale={stage === 'baby' ? 3.4 : 2.8} />
        </div>

        {/* Pet Info & Growth Meter */}
        <div className="flex flex-col min-w-[100px]">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs font-bold text-slate-800">
              Byte <span className="text-[10px] text-cyan-600 font-semibold">Lv.{stage === 'baby' ? 1 : 2}</span>
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
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
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

      {/* Expandable Feeding & Customization Tray */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl rounded-xl p-2.5 flex items-center gap-1.5"
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
              onClick={() => feedSnack('Bug Snack', 25)}
              className="flex-1 flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors text-[10px] font-mono"
              title="Squash & Feed Bug (+25 XP)"
            >
              <Bug size={14} className="text-emerald-600" />
              <span>Bug</span>
            </button>

            <div className="w-px h-6 bg-slate-200" />

            <button
              onClick={() => setPetType((p) => (p === 'cat' ? 'shiba' : 'cat'))}
              className="p-1.5 rounded-lg hover:bg-purple-50 text-slate-600 hover:text-purple-700 transition-colors text-[10px] font-mono flex flex-col items-center gap-1"
              title="Switch form (Cat / Shiba)"
            >
              <Sparkles size={14} className="text-purple-500" />
              <span>{petType === 'cat' ? 'Shiba' : 'Cat'}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
