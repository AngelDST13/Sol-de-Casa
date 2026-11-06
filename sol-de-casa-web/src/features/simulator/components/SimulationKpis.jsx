import { Alert, StatTile } from '../../../shared/components/index.js';
import { CASH } from '../../../shared/model/index.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './Simulator.module.css';

export const SimulationKpis = ({ entry }) => {
  const { sim } = entry;
  const problems = [];
  if (sim.breaksFloor) problems.push(`la caja baja del piso de ${formatUsd(CASH.floor)}`);
  if (sim.breaksInvestmentRule) problems.push('la inversión total baja de un mes al siguiente desde el mes 19');

  return (
    <>
      <div className={styles.kpis}>
        <StatTile
          label="Caja en el mes 24"
          value={formatUsd(sim.finalCash)}
          tone={sim.finalCash < CASH.floor ? 'bad' : 'good'}
        />
        <StatTile
          label="Caja mínima"
          value={formatUsd(sim.minCash)}
          detail={`en el mes ${sim.minCashMonth}`}
          tone={sim.minCash < CASH.floor ? 'bad' : undefined}
        />
        <StatTile label="Instalaciones" value={formatInteger(sim.totalInstalls)} detail="meses 1 a 24" />
        <StatTile label="Piso de caja" value={formatUsd(CASH.floor)} detail="Sofía no acepta menos" />
      </div>
      {problems.length ? (
        <Alert tone="bad">Este plan rompe las reglas: {problems.join(' y ')}.</Alert>
      ) : (
        <Alert tone="good">Este plan respeta las dos reglas del juego.</Alert>
      )}
    </>
  );
};
