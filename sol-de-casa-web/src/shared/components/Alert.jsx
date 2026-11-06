import styles from './Alert.module.css';

export const Alert = ({ tone = 'good', children }) => (
  <div className={styles.alert} data-tone={tone} role={tone === 'bad' ? 'alert' : 'status'}>
    <span className={styles.icon} aria-hidden="true">
      {tone === 'bad' ? '!' : '✓'}
    </span>
    <div>{children}</div>
  </div>
);
