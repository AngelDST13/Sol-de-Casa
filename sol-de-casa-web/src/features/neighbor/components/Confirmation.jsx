import { Card } from '../../../shared/components/index.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Neighbor.module.css';

export const Confirmation = ({ saved, referrer, result }) => (
  <Card className={styles.done}>
    <p className={styles.check} aria-hidden="true">
      ✓
    </p>
    <h1 className={styles.title}>¡Listo, {saved.name.split(' ')[0]}!</h1>
    <p className={styles.lead}>
      Paola o Kevin lo llaman al {saved.phone} en menos de 5 minutos (de lunes a viernes, en horario de oficina) para
      escoger el día de la visita. La visita es gratis.
    </p>
    <ul className={styles.summary}>
      <li>
        <span>Su recibo hoy</span>
        <strong>{formatUsd(saved.monthlyBill)}</strong>
      </li>
      <li>
        <span>Ahorro estimado</span>
        <strong>{formatUsd(result.monthly)} al mes</strong>
      </li>
      <li>
        <span>Lo refirió</span>
        <strong>{referrer ? referrer.name : 'Nadie (llegó directo)'}</strong>
      </li>
      {referrer && (
        <li>
          <span>Si instala</span>
          <strong>$40 de descuento</strong>
        </li>
      )}
    </ul>
    <p className={styles.small}>Lleve a mano un recibo de luz reciente: el técnico lo usa para armar su propuesta.</p>
  </Card>
);
