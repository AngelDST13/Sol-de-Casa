import { createStore } from './storage.js';

/**
 * Lo que pasa en la página del vecino antes de agendar: abrió el link y usó la calculadora.
 * Sirve para el panel de Andrés (Parte 2, requisito 5). En producción iría a analítica o al CRM.
 */
const funnelStore = createStore('sol-de-casa:embudo-vecino', () => []);

export const getFunnelEvents = funnelStore.get;
export const subscribeFunnelEvents = funnelStore.subscribe;

export const trackNeighborEvent = (refCode, type) =>
  funnelStore.set([...funnelStore.get(), { refCode: refCode ?? null, type, at: new Date().toISOString() }]);

export const resetFunnelEvents = funnelStore.reset;
