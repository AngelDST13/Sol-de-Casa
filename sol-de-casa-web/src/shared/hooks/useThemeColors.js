import { useEffect, useState } from 'react';

const TOKENS = ['ink', 'muted', 'line', 'surface', 'sun', 'meta', 'google', 'good', 'warn', 'bad', 'cell', 'sky'];

const readColors = () => {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(TOKENS.map((token) => [token, style.getPropertyValue(`--${token}`).trim()]));
};

/** Colores de tokens.css para Chart.js; se actualizan al cambiar el tema del sistema o el elegido en la app. */
export const useThemeColors = () => {
  const [colors, setColors] = useState(readColors);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setColors(readColors());
    query.addEventListener('change', update);
    window.addEventListener('sol-de-casa:tema', update);
    return () => {
      query.removeEventListener('change', update);
      window.removeEventListener('sol-de-casa:tema', update);
    };
  }, []);

  return colors;
};
