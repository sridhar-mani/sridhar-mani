import { Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlowingOrb } from './GlowingOrb';
import { useMouseVelocity } from '@/hooks/useMouseVelocity';

export const GlobalOrb = () => {
  const mouseState = useMouseVelocity();
  
  // Track scroll progress across the entire page
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to X position (using translateX for smoother animation)
  // At 0% scroll (Hero): translateX = 0 (orb at original position, fully visible)
  // At 8%+ scroll: translateX = 30vw (moves right, showing approximately half the orb)
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
    [1, 0.7, 0.6]
  );

  return (
    <motion.div 
      className="fixed top-0 right-0 w-[55vw] h-screen z-[2] pointer-events-none hidden md:flex items-center justify-center"
      style={{ 
        x: translateX,
        y: translateY,
        scale,
        opacity,
      }}
    >
      {/* Ambient glow */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none blur-[100px] opacity-30"
        style={{
          background: 'radial-gradient(circle at 60% 50%, hsla(188, 80%, 50%, 0.5) 0%, hsla(270, 80%, 60%, 0.3) 40%, transparent 70%)'
        }}
      />
      
      {/* The actual orb - sized for prominence */}
      <div className="w-full h-[85%] relative">
        <Suspense fallback={null}>
          <GlowingOrb mouseState={mouseState} />
        </Suspense>
      </div>
    </motion.div>
  );
};


