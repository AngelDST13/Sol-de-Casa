import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext.jsx';
import { can } from '../shared/utils/permissions.js';
import { POSITIONS } from '../services/authService.js';
import { AppShell } from './layouts/AppShell.jsx';
import { panelMenuFor } from './navigation.js';

/** Panel del equipo con el menú que corresponde al puesto. */
export const PanelShell = () => {
  const { user } = useAuth();
  const menu = useMemo(() => panelMenuFor((area) => can(user, area)), [user]);
  return (
    <AppShell
      title={`Panel · ${POSITIONS[user.position]?.label ?? 'Equipo'}`}
      groups={menu.groups}
      primary={menu.primary}
    />
  );
};

/** Protege cada pantalla del panel por área. */
export const RequireArea = ({ area, children }) => {
  const { user } = useAuth();
  return can(user, area) ? children : <Navigate to="/panel" replace />;
};
