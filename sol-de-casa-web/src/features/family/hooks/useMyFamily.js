import { useMemo } from 'react';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { buildSavingsHistory, summarizeSavings } from '../../../shared/model/index.js';

/** La familia de la cuenta que entró, con su historial de ahorro (simulado con el 70 %). */
export const useMyFamily = () => {
  const { user } = useAuth();
  const family = user.family;
  const history = useMemo(() => buildSavingsHistory(family), [family]);
  const summary = useMemo(() => summarizeSavings(history), [history]);
  return { user, family, history, summary };
};
