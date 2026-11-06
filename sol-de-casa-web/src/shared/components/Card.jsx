import styles from './Card.module.css';

export const Card = ({ title, eyebrow, actions, children, className = '', as: Tag = 'section', ...rest }) => (
  <Tag className={`${styles.card} ${className}`} {...rest}>
    {(title || eyebrow || actions) && (
      <header className={styles.header}>
        <div>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          {title && <h2 className={styles.title}>{title}</h2>}
        </div>
        {actions}
      </header>
    )}
    {children}
  </Tag>
);
