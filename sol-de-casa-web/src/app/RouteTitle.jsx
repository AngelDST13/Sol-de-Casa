import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLES = [
  ['/', 'Paneles solares para casas'],
  ['/agendar', 'Calcule su ahorro'],
  ['/r/', 'Le compartieron un ahorro'],
  ['/iniciar-sesion', 'Iniciar sesión'],
  ['/registro', 'Crear cuenta'],
  ['/privacidad', 'Privacidad y cookies'],
  ['/mi-cuenta/compartir', 'Compartir mi ahorro'],
  ['/mi-cuenta/vecinos', 'Mis vecinos y premios'],
  ['/mi-cuenta/sistema', 'Mi sistema'],
  ['/mi-cuenta', 'Mi ahorro'],
  ['/panel/solicitudes', 'Solicitudes'],
  ['/panel/agenda', 'Agenda de visitas'],
  ['/panel/clientes', 'Clientes'],
  ['/panel/reportes', 'Reportes'],
  ['/panel/referidos', 'Referidos'],
  ['/panel/ficha', 'Ficha de growth'],
  ['/panel/anuncios', 'Tablero de anuncios'],
  ['/panel/escenarios', 'Escenarios'],
  ['/panel/caja', 'Caja 24 meses'],
  ['/panel/recomendacion', 'Recomendación'],
  ['/panel/usuarios', 'Usuarios'],
  ['/panel/ajustes', 'Ajustes'],
  ['/panel', 'Resumen'],
];

/** Pone un título claro en la pestaña del navegador según la página. */
export const RouteTitle = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const match = TITLES.find(([path]) => (path === '/' ? pathname === '/' : pathname.startsWith(path)));
    document.title = `${match ? match[1] : 'Página no encontrada'} · Sol de Casa`;
  }, [pathname]);
  return null;
};
