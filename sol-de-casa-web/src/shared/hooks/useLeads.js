import { useSyncExternalStore } from 'react';
import { getLeads, getShares, subscribeLeads, subscribeShares } from '../../services/leadsService.js';
import { getFunnelEvents, subscribeFunnelEvents } from '../../services/funnelService.js';

/** Solicitudes de visita, en vivo entre pantallas. */
export const useLeads = () => useSyncExternalStore(subscribeLeads, getLeads, getLeads);

/** Tarjetas de ahorro compartidas. */
export const useShares = () => useSyncExternalStore(subscribeShares, getShares, getShares);

/** Aperturas del link y usos de la calculadora en la página del vecino. */
export const useFunnelEvents = () => useSyncExternalStore(subscribeFunnelEvents, getFunnelEvents, getFunnelEvents);
