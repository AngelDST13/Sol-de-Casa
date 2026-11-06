import { useSyncExternalStore } from 'react';
import { getUsers, subscribeUsers } from '../../services/authService.js';
import { getActivity, subscribeActivity } from '../../services/activityService.js';
import { getSettings, subscribeSettings } from '../../services/settingsService.js';

/** Cuentas (sin contraseñas), en vivo. */
export const useUsers = () => useSyncExternalStore(subscribeUsers, getUsers, getUsers);

/** Registro de actividad, en vivo. */
export const useActivity = () => useSyncExternalStore(subscribeActivity, getActivity, getActivity);

/** Ajustes del negocio, en vivo. */
export const useSettings = () => useSyncExternalStore(subscribeSettings, getSettings, getSettings);

/** El equipo activo, filtrado por puesto. */
export const useTeam = (positions) => {
  const users = useUsers();
  return users.filter(
    (user) => user.role === 'team' && user.active !== false && (!positions || positions.includes(user.position)),
  );
};
