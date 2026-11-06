import { useId } from 'react';
import styles from './RangeField.module.css';

/** Control deslizante con nombre, valor formateado y unidad (regla del reto: nada de «Variable 3»). */
export const RangeField = ({ label, value, min, max, step = 1, format, onChange, hint }) => {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        <span>{label}</span>
        <output htmlFor={id} className={`${styles.value} num`}>
          {format ? format(value) : value}
        </output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={styles.range}
        style={{ '--fill': `${fill}%` }}
      />
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
};
