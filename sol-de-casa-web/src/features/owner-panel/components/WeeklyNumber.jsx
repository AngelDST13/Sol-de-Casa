import { Card } from '../../../shared/components/index.js';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { formatInteger } from '../../../shared/utils/format.js';
import { WEEKLY_GOAL, WEEKLY_SCHEDULED } from '../data/simulatedPanel.js';
import styles from './OwnerPanel.module.css';

/** Pregunta 1: el número que Andrés mira cada semana. */
export const WeeklyNumber = () => {
  const thisWeek = WEEKLY_SCHEDULED[WEEKLY_SCHEDULED.length - 1];
  const max = Math.max(WEEKLY_GOAL, ...WEEKLY_SCHEDULED);
  return (
    <Card className={styles.weekly}>
      <div>
        <p className={styles.eyebrow}>El número de la semana</p>
        <p className={styles.weeklyNumber}>{formatInteger(thisWeek)}</p>
        <p className={styles.weeklyLabel}>
          vecinos referidos agendaron visita esta semana <SimTag />
        </p>
        <p className={styles.small}>
          Meta: {WEEKLY_GOAL} por semana (unos 34 al mes, la mitad de las visitas de un técnico nuevo).
        </p>
      </div>
      <div className={styles.spark} role="img" aria-label="Agendas por referido de las últimas 8 semanas">
        {WEEKLY_SCHEDULED.map((value, index) => (
          <span
            key={index}
            style={{ height: `${(value / max) * 100}%` }}
            data-last={index === WEEKLY_SCHEDULED.length - 1}
          />
        ))}
        <i style={{ bottom: `${(WEEKLY_GOAL / max) * 100}%` }} aria-hidden="true" />
      </div>
    </Card>
  );
};
