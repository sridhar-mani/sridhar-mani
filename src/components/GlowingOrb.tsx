import { useEffect, useRef } from 'react';

interface MouseState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  speed: number;
}

interface GlowingOrbProps {
  mouseState: MouseState;
}

export const GlowingOrb = ({ mouseState }: GlowingOrbProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !('transferControlToOffscreen' in canvas)) {
      return;
    }

    const offscreen = canvas.transferControlToOffscreen();
    const worker = new Worker(new URL('../workers/orbRenderer.worker.ts', import.meta.url), {
      type: 'module',
    });

    workerRef.current = worker;

    const sendResize = () => {
      const rect = canvas.getBoundingClientRect();
      worker.postMessage({
        type: 'resize',
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
      });
    };

    const rect = canvas.getBoundingClientRect();
    worker.postMessage(
      {
        type: 'init',
        canvas: offscreen,
        width: rect.width,
        height: rect.height,
        dpr: window.devicePixelRatio || 1,
      },
      [offscreen]
    );

    const resizeObserver = new ResizeObserver(sendResize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', sendResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', sendResize);
      worker.postMessage({ type: 'dispose' });
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!workerRef.current) {
      return;
    }

    workerRef.current.postMessage({
      type: 'mouse',
      mouse: mouseState,
    });
  }, [mouseState]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};
