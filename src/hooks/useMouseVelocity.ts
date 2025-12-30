import { useState, useEffect, useRef, useCallback } from 'react';

interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
}

export const useMouseVelocity = () => {
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
  });

  const lastPosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const rafId = useRef<number>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentTime = Date.now();
    const deltaTime = Math.max(currentTime - lastTime.current, 1);
    
    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    
    const velocityX = (normalizedX - lastPosition.current.x) / (deltaTime / 16);
    const velocityY = (normalizedY - lastPosition.current.y) / (deltaTime / 16);
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    lastPosition.current = { x: normalizedX, y: normalizedY };
    lastTime.current = currentTime;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setMouseState({
        x: normalizedX,
        y: normalizedY,
        velocityX,
        velocityY,
        speed: Math.min(speed, 2), // Cap the speed
      });
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove]);

  return mouseState;
};
