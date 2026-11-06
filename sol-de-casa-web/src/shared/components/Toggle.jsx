import { useId } from 'react';
import styles from './Toggle.module.css';

export const Toggle = ({ label, description, checked, onChange }) => {
  const id = useId();
  return (
    <div className={styles.row}>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={id} className={styles.label}>
        <span className={styles.track} aria-hidden="true" />
        <span>
          <strong>{label}</strong>
          {description && <span className={styles.description}>{description}</span>}
        </span>
      </label>
    </div>
  );
};
