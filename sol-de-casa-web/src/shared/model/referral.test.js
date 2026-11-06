import { describe, expect, it } from 'vitest';
import {
  biggestWebLoss,
  leadsToFillVisits,
  organicReferralsToday,
  referralFunnel,
  referralSaleCost,
  savingsCalculator,
} from './referralModel.js';
import { buildSavingsHistory, summarizeSavings } from './simulatedFamily.js';

const close = (actual, expected, digits = 2) => expect(actual).toBeCloseTo(expected, digits);

describe('Parte 2 · costo de una venta referida (pregunta 2)', () => {
  const cost = referralSaleCost();

  it('las visitas de una venta referida cuestan $133,33', () => {
    close(cost.visitsPerSale, 2.2222);
    close(cost.visitsCost, 133.33);
    close(cost.rewardBudget, 166.67);
  });

  it('la recompensa por agenda se paga 2,47 veces por venta', () => {
    close(cost.schedulesPerSale, 2.4691);
    close(cost.rewardLines[0].costPerSale, 29.63);
  });

  it('la tabla de recompensas respeta la regla de $300', () => {
    close(cost.rewardsCost, 153.63);
    close(cost.totalCost, 286.96);
    expect(cost.withinRule).toBe(true);
  });

  it('una recompensa de más rompe la regla', () => {
    const tooMuch = referralSaleCost([...cost.rewardLines, { trigger: 'sale', cost: 20 }]);
    expect(tooMuch.withinRule).toBe(false);
  });
});

describe('Parte 2 · capacidad y letrero (pregunta 4)', () => {
  it('68,8 leads llenan las 50 visitas de un técnico nuevo', () => {
    const fill = leadsToFillVisits();
    close(fill.visitsPerLead, 0.72675, 4);
    close(fill.leadsPerMonth, 68.8, 1);
    close(fill.leadsPerHousePerMonth, 0.15);
    close(fill.familiesNeeded, 458.7, 1);
    expect(fill.exceedsFamilies).toBe(true);
    close(fill.salesPerMonth, 22.5);
  });
});

describe('Parte 2 · flujo de hoy y referidos', () => {
  it('donde más se pierde es entre la página y el formulario (86 %)', () => {
    const loss = biggestWebLoss();
    expect(loss.worst.to).toBe('Abren el formulario');
    close(loss.worst.lostPct, 86);
    close(loss.overallPct, 6);
  });

  it('hoy llegan 2,8 referidos al mes sin pedirlos', () => {
    const organic = organicReferralsToday();
    close(organic.perYear, 33.6);
    close(organic.perMonth, 2.8);
    close(referralFunnel(1).sales, 0.327, 3);
  });
});

describe('Parte 2 · calculadora del vecino', () => {
  it('un recibo de $110 ahorra $77 al mes y recupera la instalación en 7 años', () => {
    const result = savingsCalculator(110);
    close(result.monthly, 77);
    close(result.yearly, 924);
    close(result.paybackYears, 7.03);
  });

  it('el ahorro simulado de la familia usa el 70 %', () => {
    const history = buildSavingsHistory();
    expect(history).toHaveLength(14);
    expect(history[history.length - 1].label).toBe('oct 26');
    expect(summarizeSavings(history).total).toBeGreaterThan(1000);
  });
});
