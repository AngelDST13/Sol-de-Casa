import { Card } from '../../../shared/components/index.js';
import { CYCLE } from '../content.js';
import styles from './GrowthSheet.module.css';

/** Pregunta 3: el ciclo dibujado. */
export const CycleCard = () => (
  <Card title="El ciclo: una familia que ahorra trae a la siguiente" eyebrow="Pregunta 3">
    <ol className={styles.cycle}>
      {CYCLE.map((step, index) => (
        <li key={step.title}>
          <span className={styles.cycleNumber}>{index + 1}</span>
          <strong>{step.title}</strong>
          <span>{step.body}</span>
        </li>
      ))}
    </ol>
    <p className={styles.loop}>↻ El paso 6 es el paso 1 de la siguiente familia.</p>
    <p className={styles.small}>
      Los anuncios y los letreros quedan como entradas al ciclo: traen las primeras familias de un barrio, y desde ahí
      el ciclo trabaja solo. El letrero lleva un QR al link de la familia de esa casa.
    </p>
  </Card>
);
