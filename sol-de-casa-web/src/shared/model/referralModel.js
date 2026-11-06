/**
 * Parte 2 · «El ahorro que se comparte». Datos de la sección 1 de la Parte 2 y cálculos del ciclo de referidos.
 * Todas las cifras son mensuales y en dólares.
 */

export const FAMILIES_WITH_PANELS = 420;

/** Encuesta a 60 clientes. */
export const FAMILY_SURVEY = { knowLastMonthSavings: 25, showedBillToNeighbor: 40, organicReferralsPerYear: 8 };

/** Embudo de los referidos, en porcentaje. */
export const REFERRAL_RATES = { contact: 95, schedule: 85, visit: 90, close: 45 };

/** Letrero en el jardín: 20 casas de un barrio trajeron 6 leads en 2 meses. */
export const YARD_SIGN = { houses: 20, leads: 6, months: 2 };

export const MAINTENANCE_PLAN = { monthlyPrice: 12, adoption: 25 };
export const CLEANING_COST = 60;
export const REFERRAL_VISIT_COST = 60;
export const NEW_TECH_VISITS = 50;

/** Regla de Andrés: recompensas + visitas de una venta referida ≤ $300. */
export const REFERRAL_SALE_MAX_COST = 300;

/** El cliente promedio pagaba $110 de luz y ahorra el 70 %. La instalación promedio cuesta $6.500. */
export const SAVINGS = { averageBill: 110, savingsRate: 70, installPrice: 6500, panelLifeYears: 20 };

/** La página web de hoy para alguien que llega por primera vez. */
export const TODAY_WEB_FLOW = [
  { step: 'Llegan a la página', detail: 'Fotos y un botón «Cotice»', people: 100 },
  { step: 'Abren el formulario', detail: 'Seis campos', people: 14 },
  { step: 'Dejan sus datos', detail: '«Una asesora lo llamará» (31 h)', people: 6 },
];

/**
 * Tabla de recompensas. `trigger` dice cuándo se paga: 'schedule' cuando el vecino agenda la visita,
 * 'sale' cuando firma. El costo es lo que le cuesta a Sol de Casa, no el valor para el cliente.
 */
export const REWARDS = [
  {
    id: 'family-schedule',
    who: 'Familia que comparte',
    trigger: 'schedule',
    when: 'Un vecino agenda la visita',
    reward: '1 mes del plan de mantenimiento gratis',
    cost: MAINTENANCE_PLAN.monthlyPrice,
  },
  {
    id: 'family-sale-cleaning',
    who: 'Familia que comparte',
    trigger: 'sale',
    when: 'El vecino firma',
    reward: 'Limpieza de paneles gratis',
    cost: CLEANING_COST,
  },
  {
    id: 'family-sale-plan',
    who: 'Familia que comparte',
    trigger: 'sale',
    when: 'El vecino firma',
    reward: '2 meses más del plan de mantenimiento',
    cost: 2 * MAINTENANCE_PLAN.monthlyPrice,
  },
  {
    id: 'neighbor-sale',
    who: 'Vecino',
    trigger: 'sale',
    when: 'Firma su instalación',
    reward: '$40 de descuento en la instalación',
    cost: 40,
  },
];

const pct = (value) => value / 100;

/** Embudo de N leads referidos. */
export const referralFunnel = (leads, rates = REFERRAL_RATES) => {
  const contacted = leads * pct(rates.contact);
  const scheduled = contacted * pct(rates.schedule);
  const visits = scheduled * pct(rates.visit);
  const sales = visits * pct(rates.close);
  return { leads, contacted, scheduled, visits, sales };
};

/**
 * Pregunta 2: cuánto cuesta una venta referida y cuánto queda para recompensas.
 * Las recompensas por agenda se pagan en todas las agendas, también en las que no firman.
 */
export const referralSaleCost = (rewards = REWARDS, rates = REFERRAL_RATES, visitCost = REFERRAL_VISIT_COST) => {
  const visitsPerSale = 1 / pct(rates.close);
  const schedulesPerSale = 1 / (pct(rates.visit) * pct(rates.close));
  const leadsPerSale = 1 / (pct(rates.contact) * pct(rates.schedule) * pct(rates.visit) * pct(rates.close));
  const visitsCost = visitsPerSale * visitCost;
  const rewardBudget = REFERRAL_SALE_MAX_COST - visitsCost;

  const rewardLines = rewards.map((reward) => {
    const timesPerSale = reward.trigger === 'schedule' ? schedulesPerSale : 1;
    return { ...reward, timesPerSale, costPerSale: reward.cost * timesPerSale };
  });
  const rewardsCost = rewardLines.reduce((sum, line) => sum + line.costPerSale, 0);
  const totalCost = visitsCost + rewardsCost;

  return {
    visitsPerSale,
    schedulesPerSale,
    leadsPerSale,
    visitsCost,
    rewardBudget,
    rewardLines,
    rewardsCost,
    totalCost,
    withinRule: totalCost <= REFERRAL_SALE_MAX_COST,
    headroom: REFERRAL_SALE_MAX_COST - totalCost,
  };
};

/** Pregunta 4: leads referidos para llenar las visitas de un técnico nuevo y familias que harían falta. */
export const leadsToFillVisits = (visits = NEW_TECH_VISITS, rates = REFERRAL_RATES) => {
  const visitsPerLead = pct(rates.contact) * pct(rates.schedule) * pct(rates.visit);
  const leadsPerMonth = visits / visitsPerLead;
  const leadsPerHousePerMonth = YARD_SIGN.leads / YARD_SIGN.houses / YARD_SIGN.months;
  const familiesNeeded = leadsPerMonth / leadsPerHousePerMonth;
  return {
    visitsPerLead,
    leadsPerMonth,
    leadsPerHousePerMonth,
    familiesNeeded,
    salesPerMonth: visits * pct(rates.close),
    exceedsFamilies: familiesNeeded > FAMILIES_WITH_PANELS,
  };
};

/** Referidos de hoy, sin que nadie los pida: 8 % de las 420 familias al año. */
export const organicReferralsToday = () => {
  const perYear = FAMILIES_WITH_PANELS * pct(FAMILY_SURVEY.organicReferralsPerYear);
  const perMonth = perYear / 12;
  return { perYear, perMonth, salesPerMonth: referralFunnel(perMonth).sales };
};

/** El paso del flujo de hoy donde más gente se pierde. */
export const biggestWebLoss = (flow = TODAY_WEB_FLOW) => {
  const steps = flow.slice(1).map((step, index) => {
    const previous = flow[index].people;
    return { from: flow[index].step, to: step.step, lostPct: ((previous - step.people) / previous) * 100 };
  });
  const worst = steps.reduce((max, step) => (step.lostPct > max.lostPct ? step : max));
  return { steps, worst, overallPct: (flow[flow.length - 1].people / flow[0].people) * 100 };
};

/** La calculadora del vecino. Supuesto: el precio promedio de $6.500 no cambia con el recibo. */
export const savingsCalculator = (monthlyBill, { savingsRate, installPrice, panelLifeYears } = SAVINGS) => {
  const monthly = monthlyBill * pct(savingsRate);
  const yearly = monthly * 12;
  const paybackYears = yearly > 0 ? installPrice / yearly : Infinity;
  const lifetime = yearly * panelLifeYears - installPrice;
  return { monthlyBill, monthly, yearly, paybackYears, lifetime, newBill: monthlyBill - monthly };
};
