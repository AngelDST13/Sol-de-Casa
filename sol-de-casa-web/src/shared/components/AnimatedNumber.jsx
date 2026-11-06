import { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const easeOut = (t) => 1 - (1 - t) ** 3;

/**
 * Número que se anima hasta su valor.
 * - `startOnView`: cuenta desde 0 la primera vez que entra en pantalla (cifras del inicio).
 * - Sin `startOnView`: pasa suavemente del valor anterior al nuevo (resultados de la calculadora).
 * Con «reducir movimiento» muestra el valor final de inmediato.
 */
export const AnimatedNumber = ({
  value,
  format = (n) => String(Math.round(n)),
  duration = 900,
  startOnView = false,
}) => {
  const [shown, setShown] = useState(startOnView ? 0 : value);
  const [visible, setVisible] = useState(!startOnView);
  const ref = useRef(null);
  const from = useRef(startOnView ? 0 : value);

  useEffect(() => {
    if (!startOnView || visible) return undefined;
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [startOnView, visible]);

  useEffect(() => {
    if (!visible) return undefined;
    if (prefersReducedMotion()) {
      setShown(value);
      from.current = value;
      return undefined;
    }
    const start = performance.now();
    const initial = from.current;
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(initial + (value - initial) * easeOut(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      from.current = value;
    };
  }, [value, visible, duration]);

  return (
    <span ref={ref} className="num">
      {format(shown)}
    </span>
  );
};
