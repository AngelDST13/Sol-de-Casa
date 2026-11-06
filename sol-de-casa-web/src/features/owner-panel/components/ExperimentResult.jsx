import { Card } from '../../../shared/components/index.js';
import { formatCount, formatInteger, formatPercent } from '../../../shared/utils/format.js';
import { CONTROL_GROUP, EXPERIMENT_GROUP } from '../data/simulatedPanel.js';
import styles from './OwnerPanel.module.css';

/** Pregunta 5: la prueba A/B con 50 clientes. */
export const ExperimentResult = () => {
  const groupA = (EXPERIMENT_GROUP.familiesWithNeighborScheduled / EXPERIMENT_GROUP.families) * 100;
  const control = (CONTROL_GROUP.familiesWithNeighborScheduled / CONTROL_GROUP.families) * 100;
  return (
    <Card title="Prueba A/B · 60 días" eyebrow="Métrica principal · simulado">
      <p className={styles.small} style={{ marginTop: 0 }}>
        Familias que traen al menos un vecino que agenda
      </p>
      <div className={styles.ab}>
        <div>
          <span>Sin la experiencia (25)</span>
          <strong className="num">{formatPercent(control, 1)}</strong>
          <small>{formatCount(CONTROL_GROUP.leads)} vecinos esperados</small>
        </div>
        <div data-win="true">
          <span>Con la experiencia (25)</span>
          <strong className="num">{formatPercent(groupA)}</strong>
          <small>{formatInteger(EXPERIMENT_GROUP.familiesWithNeighborScheduled)} familias</small>
        </div>
      </div>
      <p className={styles.small}>
        Meta: pasar de 1,3 % a 20 %. Contramétricas que no pueden empeorar: el cierre de los referidos (45 %) y el costo
        por venta referida (menos de $300).
      </p>
    </Card>
  );
};
