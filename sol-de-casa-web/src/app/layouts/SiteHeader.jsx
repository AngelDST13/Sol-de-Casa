import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Logo } from '../../shared/components/Logo.jsx';
import { Button } from '../../shared/components/Button.jsx';
import { useAuth } from '../../shared/hooks/AuthContext.jsx';
import styles from './SiteHeader.module.css';

const LINKS = [
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/#ahorro', label: 'Calcule su ahorro' },
  { href: '/#clientes', label: 'Clientes' },
  { href: '/#preguntas', label: 'Preguntas' },
];

export const homeFor = (user) => (user?.role === 'team' ? '/panel' : '/mi-cuenta');

export const SiteHeader = ({ tone = 'dark' }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={styles.header} data-tone={tone} data-scrolled={scrolled || open}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" aria-label="Sol de Casa, inicio">
          <Logo tone={tone === 'dark' && !scrolled && !open ? 'light' : 'ink'} />
        </Link>
        <nav className={styles.nav} aria-label="Principal">
          {LINKS.map((link) => (
            <Link key={link.href} to={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          {user ? (
            <Button to={homeFor(user)} variant="sun" className={styles.cta}>
              {user.role === 'team' ? 'Ir al panel' : 'Mi ahorro'}
            </Button>
          ) : (
            <>
              <NavLink to="/iniciar-sesion" className={styles.login}>
                Iniciar sesión
              </NavLink>
              <Button to="/agendar" variant="sun" className={styles.cta}>
                Medir mi techo gratis
              </Button>
            </>
          )}
          <button
            type="button"
            className={styles.burger}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="menu-movil" className={styles.drawer} hidden={!open}>
        {LINKS.map((link) => (
          <Link key={link.href} to={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
        {!user && <Link to="/iniciar-sesion">Iniciar sesión</Link>}
        {!user && <Link to="/registro">Crear cuenta de cliente</Link>}
        <Button to={user ? homeFor(user) : '/agendar'} variant="sun" size="lg" block>
          {user ? 'Ir a mi cuenta' : 'Medir mi techo gratis'}
        </Button>
      </div>
    </header>
  );
};
