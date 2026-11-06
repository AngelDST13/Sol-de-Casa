import { createStore } from './storage.js';

/** Registro de actividad: quién hizo qué y cuándo. Se guardan los últimos 200 eventos. */
const MAX_EVENTS = 200;
const activityStore = createStore('sol-de-casa:actividad', () => []);

export const getActivity = activityStore.get;
export const subscribeActivity = activityStore.subscribe;

export const logActivity = ({ actor, action, detail = '', leadId = null }) => {
  const event = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: new Date().toISOString(),
    actor: actor ?? 'Sistema',
    action,
    detail,
    leadId,
  };
  activityStore.set([event, ...activityStore.get()].slice(0, MAX_EVENTS));
  return event;
};

export const resetActivity = activityStore.reset;
