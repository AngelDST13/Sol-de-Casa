import { SimTag } from '../../../shared/components/SimTag.jsx';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Neighbor.module.css';

export const NeighborHero = ({ referrer }) => (
  <header className={styles.hero}>
    {referrer ? (
      <>
        <p className={styles.eyebrow}>
          {referrer.name}, de {referrer.neighborhood}, le compartió esto <SimTag />
        </p>
        <h1 className={styles.title}>Ahorraron {formatUsd(referrer.last12)} de luz en el último año.</h1>
        <p className={styles.lead}>
          Con paneles solares de Sol de Casa. ¿Cuánto ahorraría usted? Calcúlelo en 10 segundos.
        </p>
      </>
    ) : (
      <>
        <p className={styles.eyebrow}>420 familias ya ahorran con Sol de Casa</p>
        <h1 className={styles.title}>¿Cuánto ahorraría con paneles solares?</h1>
        <p className={styles.lead}>El cliente promedio ahorra el 70 % de su recibo de luz. Calcúlelo en 10 segundos.</p>
      </>
    )}
  </header>
);
