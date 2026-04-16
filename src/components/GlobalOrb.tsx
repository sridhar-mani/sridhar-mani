import { Suspense } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlowingOrb } from './GlowingOrb';
import { useMouseVelocity } from '@/hooks/useMouseVelocity';

export const GlobalOrb = () => {
  // Track scroll progress across the entire page
  const { scrollYProgress } = useScroll();
  const mouseState = useMouseVelocity();

  // Transform scroll progress to X position
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    ['0vw', '30vw', '30vw']
  );

  const translateY = useTransform(
    scrollYProgress,
    [0, 0.08, 1],
    ['0vh', '5vh', '5vh']
  );

  const scale = useTransform(scrollYProgress, [0, 0.08, 1], [1, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.08, 1], [1, 0.7, 0.6]);

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
          background:
            'radial-gradient(circle at 60% 50%, hsla(188, 80%, 50%, 0.5) 0%, hsla(270, 80%, 60%, 0.3) 40%, transparent 70%)',
        }}
      />

      {/* Spline-only orb area - no template text here */}
      <div className="w-full h-[85%] relative flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <Suspense fallback={null}>
            <GlowingOrb mouseState={mouseState} />
          </Suspense>
        </div>
      </div>
    </motion.div>
  );
};
export default GlobalOrb;