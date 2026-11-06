import { LtvBadge } from '../../../shared/components/index.js';
import { formatCount, formatUsd } from '../../../shared/utils/format.js';
import styles from './SummaryBar.module.css';

/** Resumen fijo arriba en el celular: se ve el efecto de cada control sin subir la página. */
export const SummaryBar = ({ result }) => (
  <div className={styles.bar} aria-live="polite">
    <div>
      <span className={styles.label}>Ventas/mes</span>
      <strong className="num">{formatCount(result.total.sales)}</strong>
    </div>
    <div>
      <span className={styles.label}>CAC real total</span>
      <strong className="num">{formatUsd(result.total.realCac)}</strong>
    </div>
    <div>
      <span className={styles.label}>LTV:CAC</span>
      <LtvBadge ratio={result.total.ltvCac} />
    </div>
    <div>
      <span className={styles.label}>Resultado/mes</span>
      <strong className="num" data-negative={result.total.monthlyResult < 0}>
        {formatUsd(result.total.monthlyResult)}
      </strong>
    </div>
  </div>
);
