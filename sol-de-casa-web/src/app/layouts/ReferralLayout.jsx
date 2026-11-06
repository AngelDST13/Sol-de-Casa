import { Link, Outlet, useLocation } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo.jsx';
import styles from './ReferralLayout.module.css';

/**
 * Agenda de visita y link del vecino: pantalla enfocada en un solo paso,
 * pero siempre con una salida visible al inicio.
 */
export const ReferralLayout = () => {
  const { pathname } = useLocation();
  const fromReferral = pathname.startsWith('/r/');
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/" aria-label="Sol de Casa, ir al inicio">
            <Logo />
          </Link>
          <Link to="/" className={styles.back}>
            <span aria-hidden="true">←</span> {fromReferral ? 'Conocer Sol de Casa' : 'Volver al inicio'}
          </Link>
        </div>
      </header>
      <main id="contenido" className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <span>
          <strong>4,9 ★</strong> en Google con 210 reseñas · 420 casas instaladas
        </span>
        <span>Prototipo con fines educativos: lo marcado como «simulado» es inventado.</span>
      </footer>
    </div>
  );
};
