const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

/** «hace 5 minutos», «ayer», «hace 3 días». */
export const timeAgo = (iso, now = Date.now()) => {
  const minutes = Math.round((new Date(iso).getTime() - now) / 60000);
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute');
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return rtf.format(hours, 'hour');
  return rtf.format(Math.round(hours / 24), 'day');
};

export const minutesSince = (iso, now = Date.now()) => (now - new Date(iso).getTime()) / 60000;
