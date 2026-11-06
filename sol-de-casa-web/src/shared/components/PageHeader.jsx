import styles from './PageHeader.module.css';

export const PageHeader = ({ level, title, children }) => (
  <header className={styles.header}>
    {level && <span className={styles.badge}>{level}</span>}
    <h1 className={styles.title}>{title}</h1>
    {children && <p className={styles.lead}>{children}</p>}
  </header>
);
