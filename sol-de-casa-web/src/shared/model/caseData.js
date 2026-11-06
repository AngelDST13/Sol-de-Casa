/**
 * Datos del Caso C · Sol de Casa. Todas las cifras son mensuales y en dólares.
 * Cada constante indica la sección del caso de donde sale.
 */

/** Sección 5: leads según la inversión. El punto (0, 0) es regla del modelo. */
export const META_LEADS_HISTORY = [
  [0, 0],
  [2000, 280],
  [4000, 500],
  [6000, 680],
  [8000, 840],
  [10000, 960],
];

/** Sección 5: Google no da más de 160 leads (no hay más búsquedas). */
export const GOOGLE_LEADS_HISTORY = [
  [0, 0],
  [2000, 55],
  [4000, 100],
  [6000, 135],
  [8000, 160],
];

export const META_MAX_INVESTMENT = 10000;
export const GOOGLE_MAX_INVESTMENT = 8000;

/** Sección 3: tasas del CRM, en porcentaje. */
export const META_RATES = { contact: 55, schedule: 30, visit: 70, close: 18 };
export const GOOGLE_RATES = { contact: 85, schedule: 55, visit: 85, close: 30 };

/** Supuesto 7: respuesta en menos de 5 minutos + 2 preguntas de filtro (no medido). */
export const META_FILTER_RATES = { contact: 80, schedule: 40, visit: 75, close: 22 };
export const META_FILTER_LEADS_FACTOR = 0.8;

/** Sección 1: lo que deja cada instalación. */
export const EQUIPMENT_SHARE = 0.55;
export const PAID_AT_SIGNING_SHARE = 0.5;

/** Sección 4: batería de respaldo del proveedor. */
export const BATTERY = { price: 3000, grossMargin: 0.2, trialTaken: 3, trialOffered: 20 };

/** Sección 2: visitas técnicas. */
export const BASE_VISIT_CAPACITY = 100;
export const VISITS_PER_EXTRA_TECH = 50;
export const EXTRA_TECH_MONTHLY_COST = 1800;
export const MAX_EXTRA_TECHS = 2;

/** Sección 7: datos de caja (nivel 3). */
export const CASH = {
  initial: 12000,
  floor: 5000,
  fixedCosts: 18000,
  month0Sales: 22,
  months: 24,
  nonDecreasingFromMonth: 19,
};

/** Propuesta de Leadly: CPL constante de $8 en Meta. */
export const AGENCY_CPL = 8;

/** Umbrales del semáforo de LTV:CAC. */
export const LTV_CAC_THRESHOLDS = { healthy: 3, breakEven: 1 };

/** Parámetros del tablero cuando se cargan los datos del caso. */
export const DEFAULT_PARAMS = Object.freeze({
  metaInvestment: 4000,
  googleInvestment: 4000,
  metaFilter: false,
  metaRates: { ...META_RATES },
  googleRates: { ...GOOGLE_RATES },
  visitCost: 60,
  extraTechs: 0,
  price: 6500,
  grossMargin: 28,
  commission: 3,
  batteryRate: 0,
  agencyCpl: 0,
});
