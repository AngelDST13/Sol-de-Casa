import { FAMILY_SURVEY, referralFunnel } from '../../../shared/model/index.js';

/**
 * Datos del panel: SIMULADOS para la demostración (regla del reto). Prueba A/B de 60 días con 50 familias:
 * 25 reciben la experiencia y 25 no. Los pasos después de «agendan» usan las tasas del caso.
 */
const LEADS_GROUP_A = 22;
const caseFunnel = referralFunnel(LEADS_GROUP_A);

export const EXPERIMENT_GROUP = {
  families: 25,
  sawSavings: 23,
  sharedFamilies: 15,
  cardsShared: 34,
  linkOpens: 210,
  calculatorUses: 128,
  leads: LEADS_GROUP_A,
  visits: Math.round(caseFunnel.visits),
  signed: Math.round(caseFunnel.sales),
  familiesWithNeighborScheduled: 6,
};

/** Grupo de control: sin la experiencia, solo los referidos de hoy (8 % de las familias al año). */
const controlLeads = (25 * FAMILY_SURVEY.organicReferralsPerYear) / 100 / 6;
export const CONTROL_GROUP = {
  families: 25,
  leads: controlLeads,
  familiesWithNeighborScheduled: controlLeads,
};

/** Vecinos referidos que agendan visita, semana a semana (simulado). */
export const WEEKLY_SCHEDULED = [0, 1, 2, 2, 3, 4, 5, 5];
export const WEEKLY_GOAL = 8;
