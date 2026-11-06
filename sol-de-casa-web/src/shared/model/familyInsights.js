import { BATTERY } from './caseData.js';
import { MAINTENANCE_PLAN, SAVINGS } from './referralModel.js';

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Cuánto de la instalación ($6.500 promedio) ya se pagó con el ahorro y cuándo termina,
 * al ritmo de los últimos 12 meses (o de los que haya).
 */
export const paybackProgress = (summary, { installPrice = SAVINGS.installPrice, today = new Date() } = {}) => {
  const monthsCounted = Math.min(12, summary.months);
  const monthlyAverage = monthsCounted ? summary.last12 / monthsCounted : 0;
  const recovered = Math.min(summary.total, installPrice);
  const remaining = Math.max(0, installPrice - summary.total);
  const monthsLeft = monthlyAverage > 0 ? Math.ceil(remaining / monthlyAverage) : Infinity;
  const finish = new Date(today.getFullYear(), today.getMonth() + (Number.isFinite(monthsLeft) ? monthsLeft : 0), 1);
  return {
    recovered,
    remaining,
    share: recovered / installPrice,
    monthlyAverage,
    monthsLeft,
    finishLabel: `${MONTHS[finish.getMonth()]} de ${finish.getFullYear()}`,
  };
};

/** Metas que la familia ya alcanzó o que vienen. */
export const milestones = (summary) => [
  { id: 'first', label: 'Primer mes ahorrando', done: summary.months >= 1 },
  { id: '500', label: '$500 ahorrados', done: summary.total >= 500 },
  { id: 'year', label: 'Un año con paneles', done: summary.months >= 12 },
  { id: '1000', label: '$1.000 ahorrados', done: summary.total >= 1000 },
  { id: 'quarter', label: '25 % de la instalación pagada', done: summary.total >= SAVINGS.installPrice * 0.25 },
  { id: 'half', label: 'La mitad de la instalación pagada', done: summary.total >= SAVINGS.installPrice * 0.5 },
];

/**
 * Consejos según la situación de la familia. Ningún consejo inventa cifras: los montos salen del caso.
 * Cada uno dice por qué aparece.
 */
export const familyTips = ({ summary, sharesCount, monthsOfPlan }) => {
  const tips = [];
  const drop = summary.previous ? (summary.previous.saved - summary.lastMonth.saved) / summary.previous.saved : 0;

  if (drop > 0.02) {
    tips.push({
      id: 'clean',
      tone: 'warn',
      title: `Su ahorro bajó ${Math.round(drop * 100)} % frente al mes anterior`,
      body: 'Puede ser el clima o polvo sobre los paneles. Si lleva meses sin limpieza, una limpieza ayuda a que vuelvan a producir lo de siempre.',
      action: { to: '/mi-cuenta/sistema', label: 'Ver el plan de mantenimiento' },
    });
  }

  tips.push({
    id: 'daytime',
    tone: 'sun',
    title: 'Use los aparatos que más gastan de día',
    body: 'Los paneles producen con sol. La lavadora, la plancha o la bomba de agua entre las 10 a. m. y las 3 p. m. usan su propia energía y no la de la red.',
  });

  if (sharesCount === 0) {
    tips.push({
      id: 'share',
      tone: 'green',
      title: 'Todavía no ha compartido su ahorro',
      body: 'Si un vecino agenda desde su link, usted gana un mes de mantenimiento y él $40 de descuento si instala.',
      action: { to: '/mi-cuenta/compartir', label: 'Compartir mi ahorro' },
    });
  }

  if (monthsOfPlan > 0) {
    tips.push({
      id: 'plan',
      tone: 'green',
      title: `Tiene ${monthsOfPlan} ${monthsOfPlan === 1 ? 'mes' : 'meses'} de mantenimiento gratis`,
      body: `Son premios por sus vecinos. Equivalen a $${monthsOfPlan * MAINTENANCE_PLAN.monthlyPrice} del plan.`,
      action: { to: '/mi-cuenta/sistema', label: 'Activarlo' },
    });
  }

  tips.push({
    id: 'battery',
    tone: 'night',
    title: '¿Se le va la luz a veces?',
    body: `Con la batería de respaldo ($${BATTERY.price.toLocaleString('de-DE')}) sigue con luz durante los cortes.`,
    action: { to: '/mi-cuenta/sistema', label: 'Ver la batería' },
  });

  return tips;
};
