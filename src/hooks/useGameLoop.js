import { useRef, useCallback, useEffect } from 'react';

export function useGameLoop() {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const callbackRef = useRef(null);

  const loop = useCallback((time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      const dt = Math.min(deltaTime, 50);
      if (typeof callbackRef.current === 'function') {
        callbackRef.current(dt);
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(loop);
  }, []);

  const startLoop = useCallback((callback) => {
    if (typeof callback === 'function') {
      callbackRef.current = callback;
    }
    if (!requestRef.current) {
      previousTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [loop]);

  const stopLoop = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = undefined;
    }
    previousTimeRef.current = undefined;
  }, []);

  useEffect(() => {
    return stopLoop;
  }, [stopLoop]);

  return { startLoop, stopLoop };
}
