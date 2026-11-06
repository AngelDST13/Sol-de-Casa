import { createStore } from './storage.js';
import { canMeasure } from './preferencesService.js';

/**
 * Lo que pasa en la página del vecino antes de agendar: abrió el link y usó la calculadora.
 * Sirve para el panel de Andrés (Parte 2, requisito 5). En producción iría a analítica o al CRM.
 */
const funnelStore = createStore('sol-de-casa:embudo-vecino', () => []);

export const getFunnelEvents = funnelStore.get;
export const subscribeFunnelEvents = funnelStore.subscribe;

/** Solo se registra si la persona aceptó la medición en el aviso de cookies. */
export const trackNeighborEvent = (refCode, type) =>
  canMeasure() &&
  funnelStore.set([...funnelStore.get(), { refCode: refCode ?? null, type, at: new Date().toISOString() }]);

export const resetFunnelEvents = funnelStore.reset;
