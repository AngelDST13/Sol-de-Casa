import { useMemo, useState } from 'react';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';
import { buildCustomPlan, META_RATES, PRESET_PLANS, simulatePlan } from '../../../shared/model/index.js';

const INITIAL_CUSTOM = { meta: 4000, google: 5000, filterFrom: 1, firstHire: 1, secondHire: 0 };

/**
 * El simulador usa la economía del tablero (precio, margen, comisión, visita, batería y tasas de Google)
 * con las tasas de Meta del caso; el filtro se activa según el plan.
 */
export const useSimulator = () => {
  const { params } = useCaseParams();
  const [planId, setPlanId] = useState('ganador');
  const [custom, setCustom] = useState(INITIAL_CUSTOM);

  const simParams = useMemo(
    () => ({
      ...params,
      metaFilter: false,
      agencyCpl: 0,
      metaRates: params.metaFilter ? META_RATES : params.metaRates,
    }),
    [params],
  );

  const customPlan = useMemo(() => buildCustomPlan(custom), [custom]);
  const allPlans = useMemo(() => [...PRESET_PLANS, customPlan], [customPlan]);

  const results = useMemo(
    () => allPlans.map((plan) => ({ plan, sim: simulatePlan(simParams, plan) })),
    [allPlans, simParams],
  );

  const selected = results.find((entry) => entry.plan.id === planId) ?? results[0];
  const best = results
    .filter((entry) => entry.sim.respectsRules)
    .reduce((top, entry) => (!top || entry.sim.finalCash > top.sim.finalCash ? entry : top), null);

  const updateCustom = (key, value) => setCustom((current) => ({ ...current, [key]: value }));

  return { planId, setPlanId, custom, updateCustom, results, selected, best };
};
