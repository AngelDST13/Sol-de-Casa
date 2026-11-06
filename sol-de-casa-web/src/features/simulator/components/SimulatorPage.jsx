import { PageHeader } from '../../../shared/components/index.js';
import { useSimulator } from '../hooks/useSimulator.js';
import { PlanPicker } from './PlanPicker.jsx';
import { CustomPlanForm } from './CustomPlanForm.jsx';
import { SimulationKpis } from './SimulationKpis.jsx';
import { CashChart, VisitsChart } from './SimulatorCharts.jsx';
import { PlansComparison } from './PlansComparison.jsx';
import { MonthlyTable } from './MonthlyTable.jsx';
import { Month1Check } from './Month1Check.jsx';
import styles from './Simulator.module.css';

export const SimulatorPage = () => {
  const simulator = useSimulator();
  const { selected, planId } = simulator;

  return (
    <>
      <PageHeader level="Nivel 3 · Simulador" title="La caja de Sol de Casa, 24 meses">
        Cuánto invertir en cada canal y cuándo contratar técnicos para terminar con la mayor caja posible sin bajar del
        piso de $5.000. Arranca con $12.000 y las 22 ventas de septiembre.
      </PageHeader>

      <PlanPicker simulator={simulator} />
      {planId === 'custom' && <CustomPlanForm simulator={simulator} />}

      <div className={styles.stack}>
        <SimulationKpis entry={selected} />
        <div className={styles.charts}>
          <CashChart sim={selected.sim} />
          <VisitsChart sim={selected.sim} />
        </div>
        <PlansComparison simulator={simulator} />
        <MonthlyTable entry={selected} />
        <Month1Check />
      </div>
    </>
  );
};
