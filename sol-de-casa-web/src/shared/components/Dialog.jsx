import { useEffect, useRef } from 'react';
import styles from './Dialog.module.css';

/**
 * Diálogo modal accesible sobre <dialog>: atrapa el foco, cierra con Escape y devuelve el foco al cerrar.
 * En el celular se abre como hoja a pantalla completa.
 */
export const Dialog = ({ open, onClose, title, subtitle, children, footer, size = 'md' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-size={size}
      aria-labelledby="dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {open && (
        <div className={styles.inner}>
          <header className={styles.header}>
            <div>
              <h2 id="dialog-title">{title}</h2>
              {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </header>
          <div className={styles.body}>{children}</div>
          {footer && <footer className={styles.footer}>{footer}</footer>}
        </div>
      )}
    </dialog>
  );
};
