import { SAVINGS } from './referralModel.js';

/**
 * Familia de demostración (simulado). El ahorro sale del 70 % del recibo de $110, con una variación
 * por temporada inventada para que el gráfico no sea plano: también es simulado.
 */
const SEASONAL_FACTOR = [0.94, 0.97, 1.04, 1.1, 1.12, 1.06, 0.98, 0.95, 0.96, 1.0, 0.99, 0.93];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const DEMO_FAMILY = {
  code: 'FAM-0137',
  name: 'Familia Rodríguez',
  firstName: 'Ana',
  neighborhood: 'Curridabat',
  billBefore: SAVINGS.averageBill,
  monthsInstalled: 14,
};

/** Ahorro mes a mes desde la instalación hasta el mes pasado (octubre de 2026). */
export const buildSavingsHistory = (family = DEMO_FAMILY, lastMonthIndex = 9, lastYear = 2026) => {
  const base = family.billBefore * (SAVINGS.savingsRate / 100);
  return Array.from({ length: family.monthsInstalled }, (_, offset) => {
    const back = family.monthsInstalled - 1 - offset;
    const absolute = lastYear * 12 + lastMonthIndex - back;
    const monthIndex = absolute % 12;
    const year = Math.floor(absolute / 12);
    return {
      label: `${MONTHS[monthIndex]} ${String(year).slice(2)}`,
      saved: Math.round(base * SEASONAL_FACTOR[monthIndex]),
    };
  });
};

export const summarizeSavings = (history) => {
  const lastMonth = history[history.length - 1];
  const previous = history[history.length - 2];
  const total = history.reduce((sum, month) => sum + month.saved, 0);
  const last12 = history.slice(-12).reduce((sum, month) => sum + month.saved, 0);
  return { lastMonth, previous, total, last12, months: history.length };
};
