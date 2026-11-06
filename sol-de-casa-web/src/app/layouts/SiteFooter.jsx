import { Link } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo.jsx';
import styles from './SiteFooter.module.css';

export const SiteFooter = () => (
  <footer className={`${styles.footer} panel-grid`}>
    <div className={`container ${styles.grid}`}>
      <div className={styles.brand}>
        <Logo tone="light" />
        <p>
          Paneles solares para casas, instalados por gente que conoce la electricidad desde adentro. 420 casas y 4,9
          estrellas en Google.
        </p>
      </div>
      <div>
        <h2>Clientes</h2>
        <Link to="/agendar">Calcular mi ahorro</Link>
        <Link to="/iniciar-sesion">Ver mi ahorro</Link>
        <Link to="/registro">Crear cuenta</Link>
      </div>
      <div>
        <h2>Sol de Casa</h2>
        <Link to="/#como-funciona">Cómo funciona</Link>
        <Link to="/#preguntas">Preguntas frecuentes</Link>
        <Link to="/iniciar-sesion">Acceso del equipo</Link>
      </div>
    </div>
    <div className={`container ${styles.legal}`}>
      <span>© 2026 Sol de Casa</span>
      <span>
        Prototipo con fines educativos (Caso C). Lo marcado como «simulado» es inventado para la demostración.
      </span>
    </div>
  </footer>
);
