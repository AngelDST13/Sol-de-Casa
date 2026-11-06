import { Link, Outlet } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo.jsx';
import roofs from '../../assets/images/techos-paneles.webp';
import styles from './AuthLayout.module.css';

/** Inicio de sesión y registro: foto de techos a un lado, formulario al otro. */
export const AuthLayout = () => (
  <div className={styles.shell}>
    <aside className={styles.visual}>
      <img src={roofs} alt="Techos de casas con paneles solares bajo un cielo azul" />
      <div className={styles.overlay}>
        <Link to="/" aria-label="Volver al inicio">
          <Logo tone="light" />
        </Link>
        <blockquote>
          «Cuando los vecinos vieron que el recibo de mi mamá bajaba a un tercio, empezaron a pedirme lo mismo.»
          <cite>Andrés Villalobos, fundador · 12 años de electricista</cite>
        </blockquote>
      </div>
    </aside>
    <main id="contenido" className={styles.panel}>
      <Link to="/" className={styles.mobileLogo} aria-label="Volver al inicio">
        <Logo />
      </Link>
      <div className={styles.form}>
        <Outlet />
      </div>
    </main>
  </div>
);
