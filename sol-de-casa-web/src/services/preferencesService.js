import { createStore } from './storage.js';

/**
 * Preferencias de quien usa el sitio: tema y consentimiento de cookies.
 * «Necesarias» (sesión, solicitudes, preferencias) siempre están; «medición» es opcional.
 */
const DEFAULTS = { theme: 'system', consent: null, cookieSettingsOpen: false };

const prefsStore = createStore(
  'sol-de-casa:preferencias',
  () => ({ ...DEFAULTS }),
  (saved) => ({
    ...DEFAULTS,
    ...saved,
    cookieSettingsOpen: false,
  }),
);

export const getPreferences = prefsStore.get;
export const subscribePreferences = prefsStore.subscribe;

const update = (changes) => prefsStore.set({ ...prefsStore.get(), ...changes });

/** Aplica el tema al documento. «system» deja que mande el sistema operativo. */
export const applyTheme = (theme = prefsStore.get().theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'system') delete root.dataset.theme;
  else root.dataset.theme = theme;
  window.dispatchEvent(new Event('sol-de-casa:tema'));
};

export const setTheme = (theme) => {
  update({ theme });
  applyTheme(theme);
};

export const saveConsent = ({ measurement }) =>
  update({ consent: { measurement: Boolean(measurement), at: new Date().toISOString() }, cookieSettingsOpen: false });

export const openCookieSettings = () => update({ cookieSettingsOpen: true });
export const closeCookieSettings = () => update({ cookieSettingsOpen: false });

/** ¿La persona aceptó la medición? Sin decisión, no se mide. */
export const canMeasure = () => Boolean(prefsStore.get().consent?.measurement);
