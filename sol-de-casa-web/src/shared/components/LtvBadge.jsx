import { ltvTone } from '../utils/ltv.js';
import { formatRatio } from '../utils/format.js';
import styles from './LtvBadge.module.css';

const LABELS = { good: 'Sano', warn: 'Justo', bad: 'Pierde' };

/** Semáforo de LTV:CAC: verde 3 o más, amarillo de 1 a 3, rojo menos de 1. */
export const LtvBadge = ({ ratio }) => {
  if (!ratio) return <span className={styles.empty}>—</span>;
  const tone = ltvTone(ratio);
  return (
    <span className={`${styles.badge} num`} data-tone={tone}>
      <span className={styles.dot} aria-hidden="true" />
      {formatRatio(ratio)} · {LABELS[tone]}
    </span>
  );
};
