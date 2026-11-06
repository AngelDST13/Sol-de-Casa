import styles from './StatTile.module.css';

export const StatTile = ({ label, value, detail, tone }) => (
  <div className={styles.tile} data-tone={tone}>
    <span className={styles.label}>{label}</span>
    <strong className={`${styles.value} num`}>{value}</strong>
    {detail && <span className={styles.detail}>{detail}</span>}
  </div>
);
