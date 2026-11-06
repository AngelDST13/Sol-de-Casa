import { useSyncExternalStore } from 'react';
import { getLeads, getShares, subscribeLeads, subscribeShares } from '../../services/leadsService.js';

/** Solicitudes de visita, en vivo entre pantallas. */
export const useLeads = () => useSyncExternalStore(subscribeLeads, getLeads, getLeads);

/** Tarjetas de ahorro compartidas. */
export const useShares = () => useSyncExternalStore(subscribeShares, getShares, getShares);
