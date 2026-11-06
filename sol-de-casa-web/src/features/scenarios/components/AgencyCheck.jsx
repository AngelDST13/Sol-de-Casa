import { Card } from '../../../shared/components/index.js';
import { formatCount, formatInteger, formatUsd, formatUsdCents } from '../../../shared/utils/format.js';
import styles from './Scenarios.module.css';

/** Pregunta 5: la propuesta de Leadly contada dos veces. */
export const AgencyCheck = ({ scenarios }) => {
  const [today, agencyClaim, agencyHistory] = scenarios;
  const salesDrop = today.result.total.sales - agencyHistory.result.total.sales;

  return (
    <Card title="La propuesta de la agencia, contada dos veces" eyebrow="Pregunta 5">
      <div className={styles.compare}>
        <div>
          <span>Leadly promete</span>
          <strong className="num">{formatInteger(agencyClaim.result.meta.leads)} leads</strong>
          <p className={styles.note} style={{ margin: 0 }}>
            a {formatUsdCents(agencyClaim.result.meta.cpl)} por lead
          </p>
        </div>
        <div>
          <span>El historial dice</span>
          <strong className="num">{formatInteger(agencyHistory.result.meta.leads)} leads</strong>
          <p className={styles.note} style={{ margin: 0 }}>
            a {formatUsdCents(agencyHistory.result.meta.cpl)} por lead
          </p>
        </div>
      </div>
      <div className={styles.lines}>
        <div>
          <span>Ventas al mes hoy</span>
          <span className="num">{formatCount(today.result.total.sales)}</span>
        </div>
        <div>
          <span>Ventas con la cuenta de la agencia</span>
          <span className="num">{formatCount(agencyClaim.result.total.sales)}</span>
        </div>
        <div>
          <span>Ventas con el historial</span>
          <span className="num">{formatCount(agencyHistory.result.total.sales)}</span>
        </div>
        <div>
          <span>Resultado del mes hoy</span>
          <span className="num">{formatUsd(today.result.total.monthlyResult)}</span>
        </div>
        <div>
          <span>Resultado del mes con la agencia</span>
          <span
            className="num"
            style={{ color: agencyHistory.result.total.monthlyResult < 0 ? 'var(--bad)' : undefined }}
          >
            {formatUsd(agencyHistory.result.total.monthlyResult)}
          </span>
        </div>
      </div>
      <p className={styles.note}>
        Más leads no es más ventas: con la propuesta se venden {formatCount(salesDrop)} instalaciones menos al mes,
        porque se pierde a Google (el canal que cierra) y, contada como la agencia, las visitas pedidas (
        {formatCount(agencyClaim.result.total.requestedVisits)}) ni siquiera caben en las{' '}
        {formatInteger(agencyClaim.result.capacity)} posibles.
      </p>
    </Card>
  );
};
