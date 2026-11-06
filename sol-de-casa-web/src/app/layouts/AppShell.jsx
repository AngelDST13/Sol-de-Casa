import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo.jsx';
import { useAuth } from '../../shared/hooks/AuthContext.jsx';
import { NavIcon } from './NavIcon.jsx';
import styles from './AppShell.module.css';

/**
 * Armazón de la aplicación (portal del cliente y panel del equipo).
 * Escritorio: barra lateral. Celular: barra superior, menú desplegable y barra inferior con lo principal.
 */
export const AppShell = ({ title, groups, primary }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const signOut = () => {
    logout();
    navigate('/');
  };

  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const links = (onClick) =>
    groups.map((group) => (
      <div key={group.title} className={styles.group}>
        <p className={styles.groupTitle}>{group.title}</p>
        {group.items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={styles.link} onClick={onClick}>
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    ));

  return (
    <div className={styles.shell}>
      <a className={styles.skip} href="#contenido">
        Saltar al contenido
      </a>
      <aside className={`${styles.sidebar} panel-grid`}>
        <Link to="/" className={styles.brand} aria-label="Sol de Casa, sitio público">
          <Logo tone="light" />
        </Link>
        <p className={styles.area}>{title}</p>
        <nav aria-label={title}>{links()}</nav>
        <div className={styles.user}>
          <span className={styles.avatar}>{initials}</span>
          <span className={styles.userText}>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
          <button type="button" className={styles.logout} onClick={signOut}>
            Salir
          </button>
        </div>
      </aside>

      <header className={styles.topbar}>
        <Link to="/" aria-label="Sol de Casa">
          <Logo compact />
        </Link>
        <span className={styles.topTitle}>{title}</span>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="menu-app"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.avatar}>{initials}</span>
          <span className="visually-hidden">{open ? 'Cerrar menú' : 'Abrir menú'}</span>
        </button>
      </header>
      {open && (
        <div id="menu-app" className={styles.sheet}>
          <div className={styles.sheetUser}>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
          <nav aria-label={`${title} (menú)`}>{links(() => setOpen(false))}</nav>
          <button type="button" className={styles.sheetLogout} onClick={signOut}>
            Cerrar sesión
          </button>
        </div>
      )}

      <main id="contenido" className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.bottomNav} aria-label="Principal">
        {primary.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={styles.bottomLink}>
            <NavIcon name={item.icon} />
            <span>{item.short ?? item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
