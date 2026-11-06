import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo.jsx';
import styles from './ReferralLayout.module.css';

/** Lo que ve el vecino que abre el link compartido: solo la marca y su página. */
export const ReferralLayout = () => (
  <div className={styles.shell}>
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" aria-label="Sol de Casa">
          <Logo />
        </Link>
        <span className={styles.trust}>
          <strong>4,9 ★</strong> 210 reseñas
        </span>
      </div>
    </header>
    <main id="contenido" className={styles.main}>
      <Outlet />
    </main>
    <footer className={styles.footer}>
      Prototipo con fines educativos: los nombres y ahorros marcados como «simulado» son inventados.
    </footer>
  </div>
);
