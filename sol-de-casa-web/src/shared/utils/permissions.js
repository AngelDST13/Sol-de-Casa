/**
 * Qué áreas del panel ve cada puesto. El cliente nunca entra al panel.
 * En producción esto se valida también en el servidor.
 */
const ACCESS = {
  admin: [
    'resumen',
    'solicitudes',
    'agenda',
    'clientes',
    'referidos',
    'ficha',
    'reportes',
    'anuncios',
    'usuarios',
    'ajustes',
  ],
  asesora: ['resumen', 'solicitudes', 'agenda', 'clientes', 'referidos', 'ficha', 'reportes'],
  tecnico: ['resumen', 'agenda', 'clientes'],
};

export const can = (user, area) =>
  Boolean(user && user.role === 'team' && ACCESS[user.position ?? 'asesora']?.includes(area));

export const isAdmin = (user) => user?.role === 'team' && user.position === 'admin';
