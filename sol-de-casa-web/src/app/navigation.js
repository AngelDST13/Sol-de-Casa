// Menús de las dos áreas privadas.
export const PORTAL_GROUPS = [
  {
    title: 'Mi casa',
    items: [
      { to: '/mi-cuenta', end: true, label: 'Mi ahorro', short: 'Ahorro', icon: 'home' },
      { to: '/mi-cuenta/sistema', label: 'Mi sistema', short: 'Sistema', icon: 'panel' },
    ],
  },
  {
    title: 'Vecinos',
    items: [
      { to: '/mi-cuenta/compartir', label: 'Compartir mi ahorro', short: 'Compartir', icon: 'share' },
      { to: '/mi-cuenta/vecinos', label: 'Mis vecinos y premios', short: 'Premios', icon: 'users' },
    ],
  },
];

export const PANEL_GROUPS = [
  {
    title: 'Operación',
    items: [
      { to: '/panel', end: true, label: 'Resumen', short: 'Resumen', icon: 'home' },
      { to: '/panel/solicitudes', label: 'Solicitudes de visita', short: 'Solicitudes', icon: 'inbox' },
    ],
  },
  {
    title: 'Referidos (sesión 2)',
    items: [
      { to: '/panel/referidos', label: 'Panel de referidos', short: 'Referidos', icon: 'users' },
      { to: '/panel/ficha', label: 'Ficha de growth', icon: 'flag' },
    ],
  },
  {
    title: 'Anuncios (sesión 1)',
    items: [
      { to: '/panel/anuncios', label: 'Tablero de anuncios', short: 'Anuncios', icon: 'gauge' },
      { to: '/panel/escenarios', label: 'Escenarios', icon: 'columns' },
      { to: '/panel/caja', label: 'Caja 24 meses', icon: 'chart' },
      { to: '/panel/recomendacion', label: 'Recomendación', icon: 'doc' },
    ],
  },
];

const flat = (groups) => groups.flatMap((group) => group.items);
export const PORTAL_PRIMARY = flat(PORTAL_GROUPS);
export const PANEL_PRIMARY = flat(PANEL_GROUPS).filter((item) =>
  ['/panel', '/panel/solicitudes', '/panel/referidos', '/panel/anuncios'].includes(item.to),
);
