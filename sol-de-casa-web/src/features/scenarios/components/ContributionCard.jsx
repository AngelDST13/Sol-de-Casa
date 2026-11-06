import { Card } from '../../../shared/components/index.js';
import { EQUIPMENT_SHARE } from '../../../shared/model/index.js';
import { formatPercent, formatUsd } from '../../../shared/utils/format.js';
import styles from './Scenarios.module.css';

/** Pregunta 1: cuánto deja una venta, antes de marketing. */
export const ContributionCard = ({ params, contribution }) => {
  const equipment = EQUIPMENT_SHARE * 100;
  const install = 100 - params.grossMargin - equipment;
  const commission = (params.price * params.commission) / 100;

  return (
    <Card title="¿Cuánto deja una venta?" eyebrow="Pregunta 1">
      <p className={styles.big}>{formatUsd(contribution)}</p>
      <p className={styles.note} style={{ marginTop: 4 }}>
        Contribución por instalación, antes de marketing
      </p>
      <div className={styles.split} aria-label="Reparto del precio">
        <span className={styles.equipment} style={{ flex: equipment }}>
          {formatPercent(equipment)}
        </span>
        <span className={styles.install} style={{ flex: Math.max(install, 0) }}>
          {formatPercent(install)}
        </span>
        <span className={styles.margin} style={{ flex: params.grossMargin }}>
          {formatPercent(params.grossMargin)}
        </span>
      </div>
      <div className={styles.lines}>
        <div>
          <span>Precio promedio</span>
          <span className="num">{formatUsd(params.price)}</span>
        </div>
        <div>
          <span>Margen bruto ({formatPercent(params.grossMargin)})</span>
          <span className="num">{formatUsd((params.price * params.grossMargin) / 100)}</span>
        </div>
        <div>
          <span>− Comisión de la asesora ({formatPercent(params.commission, 1)})</span>
          <span className="num">{formatUsd(-commission)}</span>
        </div>
        <div>
          <span>Contribución por venta</span>
          <span className="num">{formatUsd(contribution)}</span>
        </div>
      </div>
      <p className={styles.note}>
        Negro: equipos (se pagan el mes de la firma). Gris: instalación (mes siguiente). Verde: margen bruto. La
        comisión va en la contribución y no en el CAC porque se paga en todas las ventas.
      </p>
    </Card>
  );
};
