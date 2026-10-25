import { useState, Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { GlowingOrb, ORB_PALETTES, type OrbPalette } from './GlowingOrb';
import { useMouseVelocity } from '@/hooks/useMouseVelocity';

export const GlobalOrb = () => {
  const mouseStateRef = useMouseVelocity();
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);

  // Track scroll progress across the entire page
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to X position
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    ['0vw', '30vw', '30vw']
  );

  // Move orb slightly lower when scrolled
  const translateY = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    ['0vh', '5vh', '5vh']
  );

  // Keep same size to prevent cutting
  const scale = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    [1, 1, 1]
  );

  // Reduce opacity slightly in background
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    [1, 0.7, 0.7]
  );

  const activePalette = ORB_PALETTES[currentPaletteIndex] || ORB_PALETTES[0];

  const handleManualRandomize = () => {
    setCurrentPaletteIndex((prev) => (prev + 1) % ORB_PALETTES.length);
  };

  return (
    <motion.div
      className="fixed top-0 right-0 w-[55vw] h-screen z-[2] hidden md:flex items-center justify-center pointer-events-none"
      style={{
        x: translateX,
        y: translateY,
        scale,
        opacity,
      }}
    >
      {/* Dynamic ambient glow matching active palette */}
      <div
        className="absolute inset-0 z-0 pointer-events-none blur-[100px] opacity-35 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 60% 50%, ${activePalette.primary}77 0%, ${activePalette.attenuation}44 40%, transparent 70%)`,
        }}
      />

      {/* The actual orb container - enable pointer events on canvas */}
      <div className="w-full h-[85%] relative pointer-events-auto group">
        <Suspense fallback={null}>
          <GlowingOrb
            mouseStateRef={mouseStateRef}
            currentPaletteIndex={currentPaletteIndex}
            onPaletteChange={(_p, index) => setCurrentPaletteIndex(index)}
          />
        </Suspense>

        {/* Interactive Randomize Pill Badge */}
        <motion.button
          onClick={handleManualRandomize}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-6 right-10 z-10 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/60 shadow-md text-xs font-mono text-gray-700 hover:text-gray-950 transition-all opacity-40 hover:opacity-100 group-hover:opacity-100"
          title="Click to randomize 3D Liquid Orb shape & color"
        >
          <span
            className="w-2.5 h-2.5 rounded-full transition-colors duration-500 animate-pulse"
            style={{ backgroundColor: activePalette.primary }}
          />
          <span>{activePalette.name}</span>
          <Sparkles size={12} className="text-gray-400 group-hover:text-cyan-500" />
        </motion.button>
      </div>
    </motion.div>
  );
};
