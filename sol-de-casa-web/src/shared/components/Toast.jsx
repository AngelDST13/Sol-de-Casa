import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styles from './Toast.module.css';

const ToastContext = createContext(() => {});

/**
 * Avisos breves que confirman una acción («Visita agendada»). Se leen con lector de pantalla
 * (aria-live) y desaparecen solos en 3,5 segundos.
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const notify = useCallback(
    (message, tone = 'good') => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  const value = useMemo(() => notify, [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.region} aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={styles.toast} data-tone={toast.tone} role="status">
            <span className={styles.icon} aria-hidden="true">
              {toast.tone === 'bad' ? '!' : '✓'}
            </span>
            <span>{toast.message}</span>
            <button type="button" onClick={() => dismiss(toast.id)} aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
