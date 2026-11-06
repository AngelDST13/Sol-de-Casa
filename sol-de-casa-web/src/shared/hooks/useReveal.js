import { useEffect, useRef } from 'react';

/**
 * Revela los hijos con [data-reveal] cuando entran en pantalla (una sola vez).
 * Respeta prefers-reduced-motion desde el CSS; sin IntersectionObserver, muestra todo.
 */
export const useReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const items = Array.from(root.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.setAttribute('data-reveal', 'visible'));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-reveal', 'visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return ref;
};
