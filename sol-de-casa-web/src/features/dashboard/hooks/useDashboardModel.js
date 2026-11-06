import { useMemo } from 'react';
import { calculateMonth } from '../../../shared/model/index.js';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';

/** Resultado del mes con los controles actuales y la frase de la trampa. */
export const useDashboardModel = () => {
  const caseParams = useCaseParams();
  const result = useMemo(() => calculateMonth(caseParams.params), [caseParams.params]);

  const trap = useMemo(() => {
    const { meta, google } = result;
    if (!(meta.cpl > 0 && google.cpl > 0 && meta.realCac > 0 && google.realCac > 0)) return null;
    return {
      leadTimesCheaper: google.cpl / meta.cpl,
      customerExtraPct: (meta.realCac / google.realCac - 1) * 100,
    };
  }, [result]);

  return { ...caseParams, result, trap };
};
