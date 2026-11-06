// Menús de las dos áreas privadas. `area` se cruza con los permisos de cada puesto.
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

export const PORTAL_PRIMARY = PORTAL_GROUPS.flatMap((group) => group.items);

export const PANEL_GROUPS = [
  {
    title: 'Operación',
    items: [
      { to: '/panel', end: true, area: 'resumen', label: 'Resumen', short: 'Resumen', icon: 'home' },
      { to: '/panel/solicitudes', area: 'solicitudes', label: 'Solicitudes', short: 'Solicitudes', icon: 'inbox' },
      { to: '/panel/agenda', area: 'agenda', label: 'Agenda de visitas', short: 'Agenda', icon: 'calendar' },
      { to: '/panel/clientes', area: 'clientes', label: 'Clientes', short: 'Clientes', icon: 'users' },
    ],
  },
  {
    title: 'Crecimiento',
    items: [
      { to: '/panel/reportes', area: 'reportes', label: 'Reportes', short: 'Reportes', icon: 'bars' },
      { to: '/panel/referidos', area: 'referidos', label: 'Referidos', short: 'Referidos', icon: 'share' },
      { to: '/panel/ficha', area: 'ficha', label: 'Ficha de growth', icon: 'flag' },
    ],
  },
  {
    title: 'Análisis de anuncios',
    items: [
      { to: '/panel/anuncios', area: 'anuncios', label: 'Tablero de anuncios', short: 'Anuncios', icon: 'gauge' },
      { to: '/panel/escenarios', area: 'anuncios', label: 'Escenarios', icon: 'columns' },
      { to: '/panel/caja', area: 'anuncios', label: 'Caja 24 meses', icon: 'chart' },
      { to: '/panel/recomendacion', area: 'anuncios', label: 'Recomendación', icon: 'doc' },
    ],
  },
  {
    title: 'Administración',
    items: [
      { to: '/panel/usuarios', area: 'usuarios', label: 'Usuarios', short: 'Usuarios', icon: 'key' },
      { to: '/panel/ajustes', area: 'ajustes', label: 'Ajustes', short: 'Ajustes', icon: 'gear' },
    ],
  },
];

const PRIMARY_ORDER = ['/panel', '/panel/solicitudes', '/panel/agenda', '/panel/reportes', '/panel/clientes'];

/** Menú del panel según los permisos de quien entró. */
export const panelMenuFor = (canAccess) => {
  const groups = PANEL_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canAccess(item.area)),
  })).filter((group) => group.items.length);
  const items = groups.flatMap((group) => group.items);
  const primary = PRIMARY_ORDER.map((to) => items.find((item) => item.to === to))
    .filter(Boolean)
    .slice(0, 4);
  return { groups, primary };
};
