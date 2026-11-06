import { useMemo } from 'react';
import { PageHeader } from '../../../shared/components/index.js';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';
import { runScenarios } from '../../../shared/model/index.js';
import { ContributionCard } from './ContributionCard.jsx';
import { ScenariosTable } from './ScenariosTable.jsx';
import { FunnelDropCard } from './FunnelDropCard.jsx';
import { PaybackCard } from './PaybackCard.jsx';
import { AgencyCheck } from './AgencyCheck.jsx';
import { ScenarioFunnelChart } from './ScenarioFunnelChart.jsx';
import styles from './Scenarios.module.css';

export const ScenariosPage = () => {
  const { params } = useCaseParams();
  const scenarios = useMemo(() => runScenarios(params), [params]);
  const [today] = scenarios;

  return (
    <>
      <PageHeader level="Nivel 1 · Calculadora" title="La calculadora de Andrés">
        Los escenarios lado a lado: hoy, la propuesta de la agencia (como ella la cuenta y con el historial real) y
        nuestros dos cambios. Toman el precio, el margen y las tasas del tablero, así que todo se recalcula solo.
      </PageHeader>

      <div className={styles.grid}>
        <ContributionCard params={params} contribution={today.result.contribution} />
        <AgencyCheck scenarios={scenarios} />
      </div>
      <ScenariosTable scenarios={scenarios} />
      <div style={{ marginTop: 16 }}>
        <ScenarioFunnelChart result={today.result} />
      </div>
      <div className={styles.grid}>
        <FunnelDropCard params={params} />
        <PaybackCard params={params} result={today.result} />
      </div>
    </>
  );
};
