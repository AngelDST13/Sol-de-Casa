import { SAVINGS } from '../../../shared/model/index.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './Family.module.css';

export const SavingsHero = ({ family, history, summary }) => {
  const max = Math.max(...history.map((month) => month.saved));
  const billAfter = family.billBefore - summary.lastMonth.saved;
  const change = summary.previous ? summary.lastMonth.saved - summary.previous.saved : 0;

  return (
    <section className={`${styles.hero} panel-grid`} aria-label="Su ahorro">
      <p className={styles.heroEyebrow}>Su ahorro de {summary.lastMonth.label}</p>
      <p className={styles.bigNumber}>{formatUsd(summary.lastMonth.saved)}</p>
      <p className={styles.heroSub}>
        Su recibo bajó de {formatUsd(family.billBefore)} a unos {formatUsd(billAfter)}.
        {summary.previous &&
          ` ${change >= 0 ? `${formatUsd(change)} más` : `${formatUsd(-change)} menos`} que el mes anterior.`}
      </p>

      <div className={styles.totals}>
        <div>
          <span>Desde que instalaron</span>
          <strong className="num">{formatUsd(summary.total)}</strong>
          <small>{formatInteger(summary.months)} meses</small>
        </div>
        <div>
          <span>Últimos 12 meses</span>
          <strong className="num">{formatUsd(summary.last12)}</strong>
          <small>{SAVINGS.savingsRate} % de su recibo</small>
        </div>
      </div>

      <div className={styles.bars} role="img" aria-label="Ahorro de cada mes desde la instalación">
        {history.slice(-14).map((month, index, list) => (
          <div key={month.label} className={styles.barCol} data-last={index === list.length - 1}>
            <span
              className={styles.bar}
              style={{ height: `${(month.saved / max) * 100}%` }}
              title={`${month.label}: ${formatUsd(month.saved)}`}
            />
            <span className={styles.barLabel}>{month.label.split(' ')[0]}</span>
          </div>
        ))}
      </div>
      <p className={styles.heroNote}>
        Datos del inversor de su casa, mes por mes. En este prototipo son simulados con el 70 % de ahorro.
      </p>
    </section>
  );
};
