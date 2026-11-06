/** Link absoluto a una ruta de la app (HashRouter), para compartir fuera de ella. */
export const buildShareUrl = (path) => `${window.location.origin}${window.location.pathname}#${path}`;
