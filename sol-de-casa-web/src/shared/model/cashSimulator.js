import {
  BATTERY,
  CASH,
  EQUIPMENT_SHARE,
  EXTRA_TECH_MONTHLY_COST,
  META_FILTER_RATES,
  PAID_AT_SIGNING_SHARE,
} from './caseData.js';
import { calculateMonth, visitCapacity } from './monthlyModel.js';

const pct = (value) => value / 100;
const EPSILON = 1e-9;

/**
 * @typedef {Object} Plan
 * @property {string} id
 * @property {string} name
 * @property {number[]} meta   inversión en Meta de los meses 1..24
 * @property {number[]} google inversión en Google de los meses 1..24
 * @property {number[]} hires  meses en que se contrata cada técnico extra
 * @property {number} filterFrom mes desde el que se activa el filtro de Meta (0 = nunca)
 */

const monthCashFlow = ({ params, sales, previousSales, doneVisits, investment, paidTechs }) => {
  const installShare = 1 - pct(params.grossMargin) - EQUIPMENT_SHARE;
  const batteryRate = pct(params.batteryRate);

  const entries =
    params.price * PAID_AT_SIGNING_SHARE * (sales + previousSales) +
    batteryRate * BATTERY.price * PAID_AT_SIGNING_SHARE * (sales + previousSales);

  const outflows =
    params.price * (EQUIPMENT_SHARE + pct(params.commission)) * sales +
    params.price * installShare * previousSales +
    params.visitCost * doneVisits +
    investment +
    CASH.fixedCosts +
    EXTRA_TECH_MONTHLY_COST * paidTechs +
    // Supuesto: el costo de la batería y su comisión se pagan el mes de la firma.
    batteryRate * sales * BATTERY.price * (1 - BATTERY.grossMargin + pct(params.commission));

  return { entries, outflows };
};

/**
 * Nivel 3: corre un plan durante 24 meses.
 * El técnico se paga desde el mes en que se contrata y suma capacidad desde el siguiente.
 * @param {typeof import('./caseData.js').DEFAULT_PARAMS} params precios, márgenes y tasas base
 * @param {Plan} plan
 */
export const simulatePlan = (params, plan) => {
  let cash = CASH.initial;
  let previousSales = CASH.month0Sales;
  let minCash = Infinity;
  let minCashMonth = 0;
  let totalInstalls = 0;
  let breaksFloor = false;
  let breaksInvestmentRule = false;
  const rows = [];

  for (let month = 1; month <= CASH.months; month += 1) {
    const paidTechs = plan.hires.filter((hireMonth) => hireMonth <= month).length;
    const workingTechs = plan.hires.filter((hireMonth) => hireMonth < month).length;
    const filterOn = plan.filterFrom > 0 && month >= plan.filterFrom;
    const metaInvestment = plan.meta[month - 1];
    const googleInvestment = plan.google[month - 1];

    const result = calculateMonth(
      {
        ...params,
        metaInvestment,
        googleInvestment,
        metaFilter: filterOn,
        metaRates: filterOn ? { ...META_FILTER_RATES } : params.metaRates,
        agencyCpl: 0,
        extraTechs: paidTechs,
      },
      { capacity: visitCapacity(workingTechs) },
    );

    const sales = result.total.sales;
    const investment = metaInvestment + googleInvestment;
    const { entries, outflows } = monthCashFlow({
      params,
      sales,
      previousSales,
      doneVisits: result.total.doneVisits,
      investment,
      paidTechs,
    });

    cash += entries - outflows;
    if (cash < minCash) {
      minCash = cash;
      minCashMonth = month;
    }

    const belowFloor = cash < CASH.floor - EPSILON;
    const previousInvestment = month > 1 ? plan.meta[month - 2] + plan.google[month - 2] : investment;
    const investmentDrop = month >= CASH.nonDecreasingFromMonth && investment < previousInvestment - EPSILON;
    breaksFloor ||= belowFloor;
    breaksInvestmentRule ||= investmentDrop;
    totalInstalls += sales;

    rows.push({
      month,
      metaInvestment,
      googleInvestment,
      paidTechs,
      filterOn,
      capacity: result.capacity,
      metaLeads: result.meta.leads,
      googleLeads: result.google.leads,
      requestedVisits: result.total.requestedVisits,
      doneVisits: result.total.doneVisits,
      sales,
      entries,
      outflows,
      cash,
      belowFloor,
      investmentDrop,
      detail: result,
      previousSales,
    });
    previousSales = sales;
  }

  return {
    rows,
    finalCash: cash,
    minCash,
    minCashMonth,
    totalInstalls,
    breaksFloor,
    breaksInvestmentRule,
    respectsRules: !breaksFloor && !breaksInvestmentRule,
  };
};

const repeat = (value, times = CASH.months) => Array(times).fill(value);

/** Los planes de la hoja «Planes» del Excel. */
export const PRESET_PLANS = [
  {
    id: 'actual',
    name: 'Actual',
    description: '$4.000 Meta + $4.000 Google, sin cambios',
    meta: repeat(4000),
    google: repeat(4000),
    hires: [],
    filterFrom: 0,
  },
  {
    id: 'agencia',
    name: 'Agencia (Leadly)',
    description: '$8.000 en Meta y $0 en Google',
    meta: repeat(8000),
    google: repeat(0),
    hires: [],
    filterFrom: 0,
  },
  {
    id: 'filtro',
    name: 'Propio 1: filtro',
    description: 'Mismo presupuesto + filtro y respuesta < 5 min desde el mes 1',
    meta: repeat(4000),
    google: repeat(4000),
    hires: [],
    filterFrom: 1,
  },
  {
    id: 'tecnico',
    name: 'Propio 2: filtro + técnico',
    description: 'Filtro desde el mes 1 y un técnico extra contratado en el mes 1',
    meta: repeat(4000),
    google: repeat(4000),
    hires: [1],
    filterFrom: 1,
  },
  {
    id: 'ganador',
    name: 'Propio 3: ganador',
    description: 'Filtro, técnicos en los meses 1 y 2, Google fijo en $5.000 y Meta $2.000 → $4.500 → $7.500',
    meta: [2000, 4500, ...repeat(7500, CASH.months - 2)],
    google: repeat(5000),
    hires: [1, 2],
    filterFrom: 1,
  },
];

/** Plan personalizado con inversiones fijas. */
export const buildCustomPlan = ({ meta, google, filterFrom, firstHire, secondHire }) => ({
  id: 'custom',
  name: 'Personalizado',
  description: 'Inversiones fijas elegidas por ustedes',
  meta: repeat(meta),
  google: repeat(google),
  hires: [firstHire, secondHire].filter((month) => month > 0),
  filterFrom,
});
