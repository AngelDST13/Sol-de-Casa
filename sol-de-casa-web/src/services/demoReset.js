import { resetActivity } from './activityService.js';
import { resetUsers, logout } from './authService.js';
import { resetLeads } from './leadsService.js';
import { resetSettings } from './settingsService.js';
import { resetFunnelEvents } from './funnelService.js';

/** Vuelve todo a los datos de demostración (cuentas, solicitudes, actividad y ajustes). */
export const resetAllDemoData = () => {
  resetLeads();
  resetFunnelEvents();
  resetActivity();
  resetSettings();
  resetUsers();
  logout();
};
