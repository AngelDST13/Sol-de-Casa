import styles from './Section.module.css';

/** Bloque con título dentro de un diálogo o una página de administración. */
export const Section = ({ title, actions, children }) => (
  <section className={styles.section}>
    {(title || actions) && (
      <header className={styles.header}>
        {title && <h3>{title}</h3>}
        {actions}
      </header>
    )}
    {children}
  </section>
);
