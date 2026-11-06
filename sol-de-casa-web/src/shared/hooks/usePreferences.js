import { useSyncExternalStore } from 'react';
import { getPreferences, subscribePreferences } from '../../services/preferencesService.js';

export const usePreferences = () => useSyncExternalStore(subscribePreferences, getPreferences, getPreferences);
