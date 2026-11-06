import { useId, useState } from 'react';
import styles from './Field.module.css';

/** Campo de formulario con etiqueta, ayuda y error accesibles. */
export const Field = ({ label, hint, error, type = 'text', as = 'input', children, ...rest }) => {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const isPassword = type === 'password';
  const Control = as;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.control}>
        <Control
          id={id}
          type={as === 'input' ? (isPassword && visible ? 'text' : type) : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={styles.input}
          {...rest}
        >
          {children}
        </Control>
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? 'Ocultar' : 'Ver'}
          </button>
        )}
      </div>
      {hint && !error && (
        <small id={`${id}-hint`} className={styles.hint}>
          {hint}
        </small>
      )}
      {error && (
        <small id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </small>
      )}
    </div>
  );
};
