import { AGENCY_CPL, DEFAULT_PARAMS, META_FILTER_RATES } from './caseData.js';
import { calculateMonth } from './monthlyModel.js';

/** Nivel 1: los escenarios lado a lado de la hoja «Supuestos» (filas 43 a 48). */
export const SCENARIOS = [
  { id: 'hoy', name: 'Hoy', note: '$4.000 Meta + $4.000 Google', overrides: {} },
  {
    id: 'agencia-cpl',
    name: 'Agencia (su cuenta)',
    note: '$8.000 Meta, CPL fijo de $8',
    overrides: { metaInvestment: 8000, googleInvestment: 0, agencyCpl: AGENCY_CPL },
  },
  {
    id: 'agencia-historial',
    name: 'Agencia (historial)',
    note: '$8.000 Meta según el historial',
    overrides: { metaInvestment: 8000, googleInvestment: 0 },
  },
  {
    id: 'ustedes',
    name: 'Nuestros 2 cambios',
    note: 'Filtro + respuesta < 5 min y 1 técnico extra',
    overrides: { metaFilter: true, metaRates: { ...META_FILTER_RATES }, extraTechs: 1 },
  },
];

/**
 * Corre los escenarios usando la economía (precio, margen, comisión, visita, tasas de Google)
 * de los parámetros recibidos.
 */
export const runScenarios = (baseParams = DEFAULT_PARAMS) => {
  // Las tasas de Meta sin filtro salen del tablero, salvo que allí esté activo el filtro.
  const metaRates = baseParams.metaFilter ? DEFAULT_PARAMS.metaRates : baseParams.metaRates;
  const base = {
    ...baseParams,
    metaInvestment: 4000,
    googleInvestment: 4000,
    metaFilter: false,
    metaRates,
    extraTechs: 0,
    agencyCpl: 0,
  };
  return SCENARIOS.map((scenario) => ({
    ...scenario,
    result: calculateMonth({ ...base, ...scenario.overrides }),
  }));
};
