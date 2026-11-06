/** Lunes de la semana de una fecha. */
export const startOfWeek = (date) => {
  const day = new Date(date);
  const offset = (day.getDay() + 6) % 7;
  day.setDate(day.getDate() - offset);
  day.setHours(0, 0, 0, 0);
  return day;
};

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const formatDay = (date) => date.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });
export const formatShortDay = (date) => date.toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric' });
export const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', hour12: false });
export const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('es-CR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

/** Valor para <input type="datetime-local"> en hora local. */
export const toLocalInput = (iso) => {
  const date = iso ? new Date(iso) : new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
