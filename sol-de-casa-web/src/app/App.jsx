import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '../shared/hooks/AuthContext.jsx';
import { CaseParamsProvider } from '../shared/hooks/CaseParamsContext.jsx';
import { SiteLayout } from './layouts/SiteLayout.jsx';
import { AuthLayout } from './layouts/AuthLayout.jsx';
import { ReferralLayout } from './layouts/ReferralLayout.jsx';
import { AppShell } from './layouts/AppShell.jsx';
import { RequireRole } from './RequireRole.jsx';
import { PANEL_GROUPS, PANEL_PRIMARY, PORTAL_GROUPS, PORTAL_PRIMARY } from './navigation.js';
import { LandingPage } from '../features/landing/index.js';
import { LoginPage, RegisterPage } from '../features/auth/index.js';
import { NeighborPage } from '../features/neighbor/index.js';
import { PortalHomePage, SharePage, NeighborsPage, SystemPage } from '../features/family/index.js';
import { PanelHomePage } from '../features/team-home/index.js';
import { LeadsPage } from '../features/crm/index.js';
import { OwnerPanelPage } from '../features/owner-panel/index.js';
import { GrowthSheetPage } from '../features/growth-sheet/index.js';
import { DashboardPage } from '../features/dashboard/index.js';
import { ScenariosPage } from '../features/scenarios/index.js';
import { SimulatorPage } from '../features/simulator/index.js';
import { ReportPage } from '../features/report/index.js';
import { NotFoundPage } from './NotFoundPage.jsx';

/** Lleva al inicio de la página al cambiar de ruta, salvo que el link apunte a una sección (#ahorro). */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
};

// Rutas de la versión anterior (#/tablero, #/vecino?ref=...) siguen funcionando.
const LEGACY = {
  '/tablero': '/panel/anuncios',
  '/escenarios': '/panel/escenarios',
  '/caja': '/panel/caja',
  '/informe': '/panel/recomendacion',
  '/familia': '/mi-cuenta',
  '/panel-referidos': '/panel/referidos',
  '/ficha': '/panel/ficha',
};

const LegacyNeighbor = () => {
  const ref = new URLSearchParams(useLocation().search).get('ref');
  return <Navigate to={ref ? `/r/${ref}` : '/agendar'} replace />;
};

export const App = () => (
  <HashRouter>
    <AuthProvider>
      <ScrollManager />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route element={<ReferralLayout />}>
          <Route path="agendar" element={<NeighborPage />} />
          <Route path="r/:code" element={<NeighborPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="iniciar-sesion" element={<LoginPage />} />
          <Route path="registro" element={<RegisterPage />} />
        </Route>

        <Route
          path="mi-cuenta"
          element={
            <RequireRole role="client">
              <AppShell title="Portal del cliente" groups={PORTAL_GROUPS} primary={PORTAL_PRIMARY} />
            </RequireRole>
          }
        >
          <Route index element={<PortalHomePage />} />
          <Route path="sistema" element={<SystemPage />} />
          <Route path="compartir" element={<SharePage />} />
          <Route path="vecinos" element={<NeighborsPage />} />
        </Route>

        <Route
          path="panel"
          element={
            <RequireRole role="team">
              <CaseParamsProvider>
                <AppShell title="Panel del equipo" groups={PANEL_GROUPS} primary={PANEL_PRIMARY} />
              </CaseParamsProvider>
            </RequireRole>
          }
        >
          <Route index element={<PanelHomePage />} />
          <Route path="solicitudes" element={<LeadsPage />} />
          <Route path="referidos" element={<OwnerPanelPage />} />
          <Route path="ficha" element={<GrowthSheetPage />} />
          <Route path="anuncios" element={<DashboardPage />} />
          <Route path="escenarios" element={<ScenariosPage />} />
          <Route path="caja" element={<SimulatorPage />} />
          <Route path="recomendacion" element={<ReportPage />} />
        </Route>

        {Object.entries(LEGACY).map(([from, to]) => (
          <Route key={from} path={from} element={<Navigate to={to} replace />} />
        ))}
        <Route path="vecino" element={<LegacyNeighbor />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  </HashRouter>
);
