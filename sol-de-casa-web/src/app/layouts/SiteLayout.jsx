import { Outlet, useLocation } from 'react-router-dom';
import { SiteHeader } from './SiteHeader.jsx';
import { SiteFooter } from './SiteFooter.jsx';

/** Sitio público. En el inicio el encabezado arranca transparente sobre el hero oscuro. */
export const SiteLayout = () => {
  const { pathname } = useLocation();
  return (
    <>
      <SiteHeader tone={pathname === '/' ? 'dark' : 'light'} />
      <main id="contenido">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
};
