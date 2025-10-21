import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook otimizado para game loop usando requestAnimationFrame
 * Melhor performance que setInterval
 */
export const useGameLoop = (
  perSecond: number,
  onTick: (income: number) => void,
  enabled: boolean = true
) => {
  const rafRef = useRef<number>();
  const lastTimeRef = useRef(performance.now());
  const accumulatorRef = useRef(0);

  const tick = useCallback((currentTime: number) => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    accumulatorRef.current += deltaTime;

    const TICK_RATE = 100; // 10 ticks por segundo (100ms cada)

    // Fixed timestep para consistência
    while (accumulatorRef.current >= TICK_RATE) {
      const income = perSecond / 10; // Dividir por 10 pois são 10 ticks/segundo
      onTick(income);
      accumulatorRef.current -= TICK_RATE;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [perSecond, onTick]);

  useEffect(() => {
    if (!enabled || perSecond <= 0) return;

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, perSecond, tick]);
};
