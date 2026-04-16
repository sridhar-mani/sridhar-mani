import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

type CursorMode = 'default' | 'card' | 'link' | 'close' | 'drag' | 'text';

export const CustomCursor = () => {
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const rotation = useMotionValue(0);
  const rotationSpring = useSpring(rotation, { damping: 15, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const velocityX = e.movementX;
      rotation.set(velocityX * 2); // Max ~20deg rotation
      
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isClose = target.closest('[data-cursor="close"]') ||
                      target.closest('button[aria-label*="close"]') ||
                      target.closest('.close-button') ||
                      (target.closest('button') && target.closest('button')?.querySelector('svg[class*="X"]'));
      
      const isCard = target.closest('[data-cursor="card"]') || 
                     target.closest('.project-card') ||
                     target.closest('[class*="card"]');
      
      const isLink = target.closest('a') || 
                     target.closest('button') ||
                     target.closest('[data-cursor="pointer"]') ||
                     target.closest('[role="button"]');
      
      const isDrag = target.closest('[data-cursor="drag"]') ||
                     target.closest('[draggable="true"]');
      
      const isText = target.closest('[data-cursor="text"]') ||
                     target.matches('h1, h2, h3, h4, h5, h6, p, span, li') ||
                     target.closest('h1, h2, h3, h4, h5, h6, p');
      
      if (isClose) {
        setCursorMode('close');
      } else if (isDrag) {
        setCursorMode('drag');
      } else if (isCard && !isLink) {
        setCursorMode('card');
      } else if (isLink) {
        setCursorMode('link');
      } else if (isText && !isCard && !isLink) {
        setCursorMode('text');
      } else {
        setCursorMode('default');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', handleElementHover);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', handleElementHover);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible, rotation]);

  const getCursorSize = () => {
    switch (cursorMode) {
      case 'card': return 70;
      case 'link': return 45;
      case 'close': return 50;
      case 'drag': return 60;
      case 'text': return 8;
      default: return 24;
    }
  };

  const getCursorStyle = () => {
    switch (cursorMode) {
      case 'card':
        return { mixBlendMode: 'difference' as const, backgroundColor: 'white' };
      case 'link':
        return { mixBlendMode: 'difference' as const, backgroundColor: 'white' };
      case 'close':
        return { mixBlendMode: 'normal' as const, backgroundColor: 'rgba(239, 68, 68, 0.9)', border: 'none' };
      case 'drag':
        return { mixBlendMode: 'normal' as const, backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '2px dashed rgba(34, 197, 94, 0.8)' };
      case 'text':
        return { mixBlendMode: 'normal' as const, backgroundColor: 'hsl(188 80% 45%)', border: 'none', borderRadius: '2px', width: '2px', height: '24px' };
      default:
        return { mixBlendMode: 'normal' as const, backgroundColor: 'transparent', border: '2px solid hsl(188 80% 45%)' };
    }
  };

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <style>{`
        *:not(input):not(textarea):not([contenteditable="true"]) {
          cursor: none !important;
        }
        input, textarea, [contenteditable="true"] {
          cursor: text !important;
        }
      `}</style>
      
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
          rotate: cursorMode === 'drag' ? rotationSpring : 0,
          ...getCursorStyle(),
        }}
        animate={{
          width: getCursorSize(),
          height: getCursorSize(),
          opacity: isVisible ? 1 : 0,
          rotate: cursorMode === 'close' ? 90 : 0,
        }}
        transition={{
          width: { type: 'spring', damping: 20, stiffness: 300 },
          height: { type: 'spring', damping: 20, stiffness: 300 },
          opacity: { duration: 0.2 },
          rotate: { type: 'spring', damping: 15, stiffness: 200 },
        }}
      >
        <AnimatePresence mode="wait">
          {cursorMode === 'close' && (
            <motion.div
              key="close"
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="text-white"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </motion.div>
          )}
          
          {cursorMode === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-black"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </motion.div>
          )}
          
          {cursorMode === 'drag' && (
            <motion.div
              key="drag"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, rotate: [0, 360] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' } }}
              className="text-green-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-1.5 h-1.5 rounded-full bg-cyan-500"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isVisible && cursorMode === 'default' ? 1 : 0,
          scale: cursorMode === 'default' ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
};

