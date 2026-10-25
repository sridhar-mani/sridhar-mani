import { useEffect, useRef, useCallback } from 'react';

export interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
}

/**
 * Hook that tracks mouse position and velocity.
 * Returns a RefObject<MouseState> to completely avoid triggering React re-renders on mouse movement.
 * The values are updated directly in the ref and consumed by the Three.js useFrame loop.
 */
export const useMouseVelocity = () => {
  const mouseStateRef = useRef<MouseState>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    speed: 0,
  });

  const lastPosition = useRef({ x: 0, y: 0 });
  const lastTime = useRef(performance.now());
  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentTime = performance.now();
    const deltaTime = Math.max(currentTime - lastTime.current, 1);

    // Normalize coordinates to [-1, 1] range
    const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
    const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Calculate normalized velocity per 16ms frame
    const velocityX = (normalizedX - lastPosition.current.x) / (deltaTime / 16);
    const velocityY = (normalizedY - lastPosition.current.y) / (deltaTime / 16);
    const speed = Math.min(Math.sqrt(velocityX * velocityX + velocityY * velocityY), 2);

    lastPosition.current = { x: normalizedX, y: normalizedY };
    lastTime.current = currentTime;

    // Direct ref mutation: zero React re-render, zero worker context switch latency
    mouseStateRef.current = {
      x: normalizedX,
      y: normalizedY,
      velocityX,
      velocityY,
      speed,
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleMouseMove]);

  return mouseStateRef;
};
