import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../shared/hooks/AuthContext.jsx';

/** Protege una sección: sin sesión, al inicio de sesión; con otro rol, a su propia área. */
export const RequireRole = ({ role, children }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/iniciar-sesion" replace state={{ from: location.pathname }} />;
  if (user.role !== role) return <Navigate to={user.role === 'team' ? '/panel' : '/mi-cuenta'} replace />;
  return children;
};
