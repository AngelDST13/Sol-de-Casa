import styles from './SimTag.module.css';

/** Regla del prototipo: todo lo inventado para la demostración lleva la palabra «simulado». */
export const SimTag = ({ children = 'simulado' }) => <span className={styles.tag}>{children}</span>;
