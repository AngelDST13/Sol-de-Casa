import { createStore } from './storage.js';

/** Ajustes del negocio que el administrador puede cambiar. */
export const DEFAULT_SETTINGS = {
  teamInviteCode: 'SOLDECASA-2026',
  responseGoalMinutes: 5,
  visitsPerTechnician: 50,
};

const settingsStore = createStore(
  'sol-de-casa:ajustes',
  () => ({ ...DEFAULT_SETTINGS }),
  (saved) => ({
    ...DEFAULT_SETTINGS,
    ...saved,
  }),
);

export const getSettings = settingsStore.get;
export const subscribeSettings = settingsStore.subscribe;
export const updateSettings = (changes) => settingsStore.set({ ...settingsStore.get(), ...changes });
export const resetSettings = settingsStore.reset;

export const generateInviteCode = () => `SOLDECASA-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
