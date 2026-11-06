import {
  BASE_VISIT_CAPACITY,
  BATTERY,
  CASH,
  EQUIPMENT_SHARE,
  EXTRA_TECH_MONTHLY_COST,
  GOOGLE_LEADS_HISTORY,
  META_FILTER_LEADS_FACTOR,
  META_LEADS_HISTORY,
  PAID_AT_SIGNING_SHARE,
  VISITS_PER_EXTRA_TECH,
} from './caseData.js';
import { interpolate } from './interpolate.js';

const pct = (value) => value / 100;
const safeDivide = (numerator, denominator) => (denominator > 0 ? numerator / denominator : 0);

/** Contribución de la batería por venta (supuesto: la tasa aplica a cada cliente que firma). */
export const batteryContributionPerSale = (params) =>
  pct(params.batteryRate) * (BATTERY.price * BATTERY.grossMargin - BATTERY.price * pct(params.commission));

/** Pregunta 1: contribución de una venta antes de marketing = precio × margen − comisión. */
export const contributionPerSale = (params) =>
  params.price * pct(params.grossMargin) - params.price * pct(params.commission) + batteryContributionPerSale(params);

export const visitCapacity = (extraTechs) => BASE_VISIT_CAPACITY + VISITS_PER_EXTRA_TECH * extraTechs;

const metaLeads = (params) => {
  const raw =
    params.agencyCpl > 0
      ? params.metaInvestment / params.agencyCpl
      : interpolate(META_LEADS_HISTORY, params.metaInvestment);
  return params.metaFilter ? raw * META_FILTER_LEADS_FACTOR : raw;
};

const buildFunnel = (leads, rates) => {
  const contacted = leads * pct(rates.contact);
  const scheduled = contacted * pct(rates.schedule);
  const requestedVisits = scheduled * pct(rates.visit);
  return { leads, contacted, scheduled, requestedVisits };
};

const channelMetrics = ({ investment, funnel, doneVisits, closeRate, visitCost, contribution }) => {
  const sales = doneVisits * pct(closeRate);
  const adsCac = safeDivide(investment, sales);
  const visitsCac = safeDivide(visitCost * doneVisits, sales);
  const realCac = adsCac + visitsCac;
  return {
    ...funnel,
    investment,
    doneVisits,
    lostVisits: funnel.requestedVisits - doneVisits,
    sales,
    cpl: safeDivide(investment, funnel.leads),
    adsCac,
    visitsCac,
    realCac,
    ltvCac: safeDivide(contribution, realCac),
    visitsPerSale: safeDivide(doneVisits, sales),
    visitValue: pct(closeRate) * contribution - visitCost,
  };
};

/**
 * Modelo de un mes estable (nivel 1 y 2).
 * Supuesto 4: si no caben las visitas, primero se hacen las de Google y después las de Meta.
 * @param {typeof import('./caseData.js').DEFAULT_PARAMS} params
 * @param {{ capacity?: number }} [options] capacidad forzada (el simulador la usa por el mes de capacitación)
 */
export const calculateMonth = (params, options = {}) => {
  const capacity = options.capacity ?? visitCapacity(params.extraTechs);
  const contribution = contributionPerSale(params);

  const metaFunnel = buildFunnel(metaLeads(params), params.metaRates);
  const googleFunnel = buildFunnel(interpolate(GOOGLE_LEADS_HISTORY, params.googleInvestment), params.googleRates);

  const googleDone = Math.min(googleFunnel.requestedVisits, capacity);
  const metaDone = Math.min(metaFunnel.requestedVisits, capacity - googleDone);

  const shared = { visitCost: params.visitCost, contribution };
  const meta = channelMetrics({
    ...shared,
    investment: params.metaInvestment,
    funnel: metaFunnel,
    doneVisits: metaDone,
    closeRate: params.metaRates.close,
  });
  const google = channelMetrics({
    ...shared,
    investment: params.googleInvestment,
    funnel: googleFunnel,
    doneVisits: googleDone,
    closeRate: params.googleRates.close,
  });

  const investment = meta.investment + google.investment;
  const doneVisits = meta.doneVisits + google.doneVisits;
  const requestedVisits = meta.requestedVisits + google.requestedVisits;
  const sales = meta.sales + google.sales;
  const realCac = safeDivide(investment + params.visitCost * doneVisits, sales);
  const techCost = EXTRA_TECH_MONTHLY_COST * params.extraTechs;

  return {
    meta,
    google,
    contribution,
    capacity,
    total: {
      investment,
      leads: meta.leads + google.leads,
      requestedVisits,
      doneVisits,
      lostVisits: requestedVisits - doneVisits,
      sales,
      realCac,
      ltvCac: safeDivide(contribution, realCac),
      capacityUse: safeDivide(requestedVisits, capacity),
      overCapacity: requestedVisits > capacity + 1e-9,
      monthlyResult: sales * contribution - investment - params.visitCost * doneVisits - CASH.fixedCosts - techCost,
    },
  };
};

/**
 * Pregunta 4: payback en caja de un cliente. Arranca en −CAC real y suma
 * lo que entra y sale el mes de la firma y el mes siguiente.
 */
export const cashPayback = (params, realCac) => {
  const installShare = 1 - pct(params.grossMargin) - EQUIPMENT_SHARE;
  const signingIn = params.price * PAID_AT_SIGNING_SHARE;
  const signingOut = params.price * (EQUIPMENT_SHARE + pct(params.commission));
  const nextIn = params.price * (1 - PAID_AT_SIGNING_SHARE);
  const nextOut = params.price * installShare;

  const afterSigning = -realCac + signingIn - signingOut;
  const afterNextMonth = afterSigning + nextIn - nextOut;
  const recoveredIn = afterSigning >= 0 ? 'el mes de la firma' : afterNextMonth >= 0 ? 'el mes siguiente' : 'después';

  return { realCac, signingIn, signingOut, nextIn, nextOut, afterSigning, afterNextMonth, recoveredIn };
};
