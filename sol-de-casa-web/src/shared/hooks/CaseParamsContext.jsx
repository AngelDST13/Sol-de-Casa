import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DEFAULT_PARAMS, META_FILTER_RATES, META_RATES } from '../model/index.js';

const CaseParamsContext = createContext(null);

const cloneDefaults = () => ({
  ...DEFAULT_PARAMS,
  metaRates: { ...DEFAULT_PARAMS.metaRates },
  googleRates: { ...DEFAULT_PARAMS.googleRates },
});

/**
 * Parámetros del modelo compartidos por el tablero, los escenarios y el simulador.
 * Así, cambiar el precio o una tasa en el tablero recalcula todo lo demás.
 */
export const CaseParamsProvider = ({ children }) => {
  const [params, setParams] = useState(cloneDefaults);

  const setParam = useCallback((key, value) => setParams((current) => ({ ...current, [key]: value })), []);

  const setRate = useCallback(
    (channel, step, value) =>
      setParams((current) => ({ ...current, [channel]: { ...current[channel], [step]: value } })),
    [],
  );

  // Supuesto 7: al activar el filtro, las tasas de Meta pasan a 80/40/75/22 %.
  const setMetaFilter = useCallback(
    (enabled) =>
      setParams((current) => ({
        ...current,
        metaFilter: enabled,
        metaRates: { ...(enabled ? META_FILTER_RATES : META_RATES) },
      })),
    [],
  );

  const resetParams = useCallback(() => setParams(cloneDefaults()), []);

  const value = useMemo(
    () => ({ params, setParam, setRate, setMetaFilter, resetParams }),
    [params, setParam, setRate, setMetaFilter, resetParams],
  );

  return <CaseParamsContext.Provider value={value}>{children}</CaseParamsContext.Provider>;
};

export const useCaseParams = () => {
  const context = useContext(CaseParamsContext);
  if (!context) throw new Error('useCaseParams debe usarse dentro de <CaseParamsProvider>');
  return context;
};
