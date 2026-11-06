import styles from './EmptyState.module.css';

export const EmptyState = ({ title, children, action }) => (
  <div className={styles.empty}>
    <svg viewBox="0 0 64 40" className={styles.art} aria-hidden="true">
      <circle cx="44" cy="12" r="8" fill="var(--sun)" />
      <path d="M6 22h44l-4 16H10z" fill="var(--cell)" />
      <path d="M20 22l-2 16M32 22v16M44 22l2 16M8 30h40" stroke="var(--cell-line)" strokeWidth="1.2" />
    </svg>
    <strong>{title}</strong>
    {children && <p>{children}</p>}
    {action}
  </div>
);
