import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

type CursorMode = 'default' | 'card' | 'link' | 'close' | 'drag' | 'text';

export const CustomCursor = () => {
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring animation for smoother movement
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Rotation value for dynamic effects
  const rotation = useMotionValue(0);
  const rotationSpring = useSpring(rotation, { damping: 15, stiffness: 150 });

  useEffect(() => {
    // Detect touch / coarse pointer devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isCoarse) {
      setIsTouchDevice(true);
      return;
    }

    let lastHoverCheck = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const velocityX = e.movementX || 0;
      rotation.set(Math.max(-25, Math.min(25, velocityX * 2)));
      
      if (!isVisible) {
        setIsVisible(true);
      }

      // Throttle hover detection to ~60ms to avoid DOM traversal on every sub-pixel move
      const now = performance.now();
      if (now - lastHoverCheck > 60) {
        lastHoverCheck = now;
        const target = e.target as HTMLElement | null;
        if (!target) return;

        const isClose = target.closest('[data-cursor="close"]') ||
                        target.closest('button[aria-label*="close"]') ||
                        target.closest('.close-button');
        
        const isCard = target.closest('[data-cursor="card"]') || 
                       target.closest('.project-card');
        
        const isLink = target.closest('a') || 
                       target.closest('button') ||
                       target.closest('[data-cursor="pointer"]') ||
                       target.closest('[role="button"]');
        
        const isDrag = target.closest('[data-cursor="drag"]') ||
                       target.closest('[draggable="true"]');
        
        const isText = target.closest('[data-cursor="text"]');

        if (isClose) {
          setCursorMode('close');
        } else if (isDrag) {
          setCursorMode('drag');
        } else if (isCard && !isLink) {
          setCursorMode('card');
        } else if (isLink) {
          setCursorMode('link');
        } else if (isText) {
          setCursorMode('text');
        } else {
          setCursorMode('default');
        }
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible, rotation]);

  if (isTouchDevice) {
    return null;
  }

  // Cursor size based on mode
  const getCursorSize = () => {
    switch (cursorMode) {
      case 'card':
        return 56;
      case 'link':
        return 44;
      case 'close':
        return 48;
      case 'drag':
        return 48;
      case 'text':
        return 28;
      default:
        return 20;
    }
  };

  const getCursorStyle = () => {
    switch (cursorMode) {
      case 'card':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        };
      case 'link':
        return {
          backgroundColor: 'rgba(0, 217, 255, 0.15)',
          border: '1.5px solid rgba(0, 217, 255, 0.8)',
          boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
        };
      case 'close':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.9)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
        };
      case 'drag':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          border: '2px dashed rgba(16, 185, 129, 0.8)',
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          border: '1px solid rgba(100, 116, 139, 0.6)',
        };
      default:
        return {
          backgroundColor: 'transparent',
          border: '1.5px solid rgba(0, 217, 255, 0.6)',
        };
    }
  };

  return (
    <>
      {/* Outer cursor ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center backdrop-blur-[1px]"
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

      {/* Center dot (only for default/link modes) */}
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
