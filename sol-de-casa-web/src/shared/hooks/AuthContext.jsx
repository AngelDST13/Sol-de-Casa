import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as authService from '../../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getSessionUser());

  const login = useCallback(async (credentials) => {
    const next = await authService.login(credentials);
    setUser(next);
    return next;
  }, []);

  const register = useCallback(async (data) => {
    const next = await authService.register(data);
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
};
