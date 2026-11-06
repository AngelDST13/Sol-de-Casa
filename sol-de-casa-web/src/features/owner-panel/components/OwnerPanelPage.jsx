import { PageHeader } from '../../../shared/components/index.js';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { WeeklyNumber } from './WeeklyNumber.jsx';
import { ReferralFunnel } from './ReferralFunnel.jsx';
import { CostPerSale } from './CostPerSale.jsx';
import { ExperimentResult } from './ExperimentResult.jsx';
import { LiveDemo } from './LiveDemo.jsx';
import styles from './OwnerPanel.module.css';

/** Requisito 5: el panel de Andrés, con cuántos clientes llegan a cada paso. */
export const OwnerPanelPage = () => (
  <>
    <PageHeader level="Sesión 2 · Panel de Andrés" title="¿Las familias traen vecinos?">
      Prueba de 60 días con 50 clientes: 25 reciben la experiencia y 25 no. Los números de este panel son simulados{' '}
      <SimTag />, salvo el registro en vivo de esta demostración.
    </PageHeader>
    <div className={styles.stack}>
      <WeeklyNumber />
      <ReferralFunnel />
      <div className={styles.grid}>
        <ExperimentResult />
        <CostPerSale />
      </div>
      <LiveDemo />
    </div>
  </>
);
