import { PageHeader } from '../../../shared/components/index.js';
import { CycleCard } from './CycleCard.jsx';
import { WebLossCard } from './WebLossCard.jsx';
import { GoalCard } from './GoalCard.jsx';
import { RetentionCard } from './RetentionCard.jsx';
import { ChannelMatrix } from './ChannelMatrix.jsx';
import { ExperimentCard } from './ExperimentCard.jsx';
import { RewardsTable } from './RewardsTable.jsx';
import { FourQuestions } from './FourQuestions.jsx';
import { AiErrorsCard } from './AiErrorsCard.jsx';
import styles from './GrowthSheet.module.css';

export const GrowthSheetPage = () => (
  <>
    <PageHeader level="Sesión 2 · Ficha de growth" title="El ahorro que se comparte">
      Por qué este prototipo hace crecer a Sol de Casa sin pagar más por cada cliente: el ciclo, la meta en números, el
      experimento y lo que cuesta.
    </PageHeader>
    <div className={styles.stack}>
      <CycleCard />
      <div className={styles.grid}>
        <WebLossCard />
        <RetentionCard />
      </div>
      <GoalCard />
      <RewardsTable />
      <div className={styles.grid}>
        <ChannelMatrix />
        <ExperimentCard />
      </div>
      <FourQuestions />
      <AiErrorsCard />
    </div>
  </>
);
