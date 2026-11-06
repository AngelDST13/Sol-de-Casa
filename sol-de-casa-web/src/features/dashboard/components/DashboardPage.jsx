import { PageHeader } from '../../../shared/components/index.js';
import { useDashboardModel } from '../hooks/useDashboardModel.js';
import { ControlsPanel } from './ControlsPanel.jsx';
import { TrapBanner } from './TrapBanner.jsx';
import { SummaryBar } from './SummaryBar.jsx';
import { ResultsTable } from './ResultsTable.jsx';
import { CapacityStatus } from './CapacityStatus.jsx';
import { FunnelChart, CplVsCacChart, CapacityChart, TrapChart } from './DashboardCharts.jsx';
import styles from './Dashboard.module.css';

export const DashboardPage = () => {
  const model = useDashboardModel();
  const { result, trap } = model;

  return (
    <>
      <PageHeader level="Nivel 2 · Tablero" title="¿Más leads siempre es mejor?">
        Mueva los controles y mire cuánto cuesta de verdad conseguir un cliente. Cifras mensuales en dólares, con los
        datos del caso cargados.
      </PageHeader>

      <SummaryBar result={result} />
      <div className={styles.layout}>
        <ControlsPanel model={model} />

        <div className={styles.main}>
          <TrapBanner trap={trap} result={result} />
          <TrapChart result={result} />
          <CapacityStatus result={result} />
          <ResultsTable result={result} />
          <div className={styles.charts}>
            <FunnelChart result={result} />
            <CplVsCacChart result={result} />
            <CapacityChart result={result} />
          </div>
        </div>
      </div>
    </>
  );
};
