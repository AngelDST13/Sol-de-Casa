import { Card } from '../../../shared/components/index.js';
import { TODAY_WEB_FLOW, biggestWebLoss } from '../../../shared/model/index.js';
import { formatInteger, formatPercent } from '../../../shared/utils/format.js';
import styles from './GrowthSheet.module.css';

/** El paso del flujo de hoy donde más gente se pierde. */
export const WebLossCard = () => {
  const loss = biggestWebLoss();
  return (
    <Card title="Dónde se pierde más gente hoy" eyebrow="La web de hoy">
      <ul className={styles.flow}>
        {TODAY_WEB_FLOW.map((step) => (
          <li key={step.step}>
            <span className={styles.flowBar} style={{ width: `${step.people}%` }} />
            <span>
              <strong>{formatInteger(step.people)}</strong> {step.step.toLowerCase()} · {step.detail}
            </span>
          </li>
        ))}
      </ul>
      <p className={styles.highlight}>
        Entre «{loss.worst.from.toLowerCase()}» y «{loss.worst.to.toLowerCase()}» se pierde el{' '}
        {formatPercent(loss.worst.lostPct)}. Solo el {formatPercent(loss.overallPct)} termina dejando sus datos.
      </p>
      <p className={styles.small}>
        Cómo lo arregla el diseño: el vecino no llega a una página de fotos con un botón «Cotice», llega al ahorro de
        una familia que conoce y a una calculadora que ya muestra un resultado. Después pide solo 2 datos (no 6), y la
        llamada es en menos de 5 minutos (no en 31 horas).
      </p>
    </Card>
  );
};
