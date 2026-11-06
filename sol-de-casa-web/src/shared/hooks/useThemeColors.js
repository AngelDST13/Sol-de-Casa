import { useEffect, useState } from 'react';

const TOKENS = ['ink', 'muted', 'line', 'surface', 'sun', 'meta', 'google', 'good', 'warn', 'bad'];

const readColors = () => {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(TOKENS.map((token) => [token, style.getPropertyValue(`--${token}`).trim()]));
};

/** Lee los colores de tokens.css para Chart.js y se actualiza al cambiar entre modo claro y oscuro. */
export const useThemeColors = () => {
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setColors(readColors());
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return colors;
};
