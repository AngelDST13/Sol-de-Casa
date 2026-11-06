import { describe, expect, it } from 'vitest';
import { DEFAULT_PARAMS } from './caseData.js';
import { interpolate } from './interpolate.js';
import { calculateMonth, cashPayback, contributionPerSale } from './monthlyModel.js';
import { PRESET_PLANS, simulatePlan } from './cashSimulator.js';
import { runScenarios } from './scenarios.js';
import { META_LEADS_HISTORY, GOOGLE_LEADS_HISTORY } from './caseData.js';

// Valores de referencia: Sol_de_Casa_Niveles_1_y_3.xlsx (hojas Resultados, Verificacion_Mes1 y Planes).
const close = (actual, expected, digits = 2) => expect(actual).toBeCloseTo(expected, digits);

describe('interpolación del historial', () => {
  it('devuelve los puntos del caso y la recta entre ellos', () => {
    expect(interpolate(META_LEADS_HISTORY, 4000)).toBe(500);
    expect(interpolate(META_LEADS_HISTORY, 7500)).toBe(800);
    expect(interpolate(META_LEADS_HISTORY, 1000)).toBe(140);
    expect(interpolate(GOOGLE_LEADS_HISTORY, 5000)).toBe(117.5);
    expect(interpolate(GOOGLE_LEADS_HISTORY, 9000)).toBe(160);
    expect(interpolate(META_LEADS_HISTORY, 0)).toBe(0);
  });
});

describe('escenario de hoy (nivel 1)', () => {
  const result = calculateMonth(DEFAULT_PARAMS);

  it('contribución por venta = 6.500 × 28 % − 3 %', () => {
    close(contributionPerSale(DEFAULT_PARAMS), 1625);
  });

  it('embudo y ventas', () => {
    close(result.meta.requestedVisits, 57.75);
    close(result.google.requestedVisits, 39.7375);
    close(result.meta.sales, 10.395);
    close(result.google.sales, 11.92125);
    close(result.total.sales, 22.31625);
  });

  it('CAC real, LTV:CAC y valor de la visita', () => {
    close(result.meta.realCac, 718.1337);
    close(result.google.realCac, 535.5353);
    close(result.meta.ltvCac, 2.2628);
    close(result.google.ltvCac, 3.0343);
    close(result.total.realCac, 620.5904);
    close(result.meta.visitValue, 232.5);
    close(result.google.visitValue, 427.5);
  });

  it('payback: se recupera el mes siguiente', () => {
    const payback = cashPayback(DEFAULT_PARAMS, result.meta.realCac);
    close(payback.afterSigning, -1238.1337);
    close(payback.afterNextMonth, 906.8663);
    expect(payback.recoveredIn).toBe('el mes siguiente');
  });
});

describe('escenarios lado a lado', () => {
  const [hoy, agenciaCpl, agenciaHistorial, ustedes] = runScenarios(DEFAULT_PARAMS);

  it('la agencia con su CPL de $8 pasa la capacidad', () => {
    close(agenciaCpl.result.meta.leads, 1000);
    close(agenciaCpl.result.total.requestedVisits, 115.5);
    close(agenciaCpl.result.total.sales, 18);
    expect(agenciaCpl.result.total.overCapacity).toBe(true);
  });

  it('la agencia con el historial vende menos que hoy', () => {
    close(agenciaHistorial.result.meta.cpl, 9.5238);
    close(agenciaHistorial.result.total.sales, 17.4636);
    close(agenciaHistorial.result.meta.realCac, 791.429);
    expect(agenciaHistorial.result.total.sales).toBeLessThan(hoy.result.total.sales);
  });

  it('nuestros dos cambios', () => {
    close(ustedes.result.meta.realCac, 462.1212);
    close(ustedes.result.total.sales, 33.04125);
    close(ustedes.result.total.realCac, 488.6089);
  });
});

describe('simulador de 24 meses (nivel 3)', () => {
  const byId = Object.fromEntries(PRESET_PLANS.map((plan) => [plan.id, simulatePlan(DEFAULT_PARAMS, plan)]));

  it('mes 1 del plan actual verificado a mano', () => {
    const [month1] = byId.actual.rows;
    close(month1.entries, 144027.8125);
    close(month1.outflows, 140291.5125);
    close(month1.cash, 15736.3);
  });

  it('resultados de la hoja «Planes»', () => {
    close(byId.actual.finalCash, 117273.39);
    close(byId.agencia.finalCash, -60897.82);
    close(byId.filtro.finalCash, 219162.045);
    close(byId.tecnico.finalCash, 403631.36);
    close(byId.ganador.finalCash, 677750.4);
    close(byId.ganador.minCash, 9007.53);
    expect(byId.ganador.minCashMonth).toBe(2);
    close(byId.ganador.totalInstalls, 1112.6478);
  });

  it('marca qué planes rompen las reglas', () => {
    expect(byId.agencia.respectsRules).toBe(false);
    expect(byId.ganador.respectsRules).toBe(true);
    expect(byId.actual.respectsRules).toBe(true);
  });
});
