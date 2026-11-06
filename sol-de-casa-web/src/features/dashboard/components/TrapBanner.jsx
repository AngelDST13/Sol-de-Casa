import { formatCount, formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './TrapBanner.module.css';

/** Requisito 4 del nivel 2: la trampa del caso en una sola frase con números. */
export const TrapBanner = ({ trap, result }) => {
  if (!trap) {
    return (
      <div className={styles.banner}>
        <p className={styles.text}>Ponga inversión en los dos canales para comparar el lead con el cliente.</p>
      </div>
    );
  }
  const moreExpensive = trap.customerExtraPct >= 0;
  return (
    <div className={styles.banner}>
      <p className={styles.eyebrow}>La trampa del caso</p>
      <p className={styles.text}>
        El lead de Meta es <mark>{formatCount(trap.leadTimesCheaper)} veces más barato</mark>, pero el cliente cuesta{' '}
        <mark data-tone={moreExpensive ? 'bad' : 'good'}>
          {formatInteger(Math.abs(trap.customerExtraPct))} % {moreExpensive ? 'más' : 'menos'}
        </mark>
        .
      </p>
      <p className={styles.detail}>
        CPL {formatUsd(result.meta.cpl)} contra {formatUsd(result.google.cpl)} · CAC real{' '}
        {formatUsd(result.meta.realCac)} contra {formatUsd(result.google.realCac)}. Meta necesita{' '}
        {formatCount(result.meta.visitsPerSale)} visitas por venta; Google, {formatCount(result.google.visitsPerSale)}.
      </p>
    </div>
  );
};
