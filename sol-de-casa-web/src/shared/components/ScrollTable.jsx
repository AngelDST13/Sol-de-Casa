import styles from './ScrollTable.module.css';

/** Tabla con desplazamiento horizontal propio: la página nunca se desborda en el celular. */
export const ScrollTable = ({ caption, children, compact = false }) => (
  <div className={styles.wrap} tabIndex={0} role="region" aria-label={caption}>
    <table className={styles.table} data-compact={compact}>
      {caption && <caption className="visually-hidden">{caption}</caption>}
      {children}
    </table>
  </div>
);
