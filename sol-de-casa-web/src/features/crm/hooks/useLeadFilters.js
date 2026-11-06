import { useMemo, useState } from 'react';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { LEAD_STATUSES } from '../../../services/leadsService.js';

const normalize = (text) =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

/** Filtros del CRM: estado, origen, asignación y búsqueda por nombre, teléfono, barrio o código. */
export const useLeadFilters = (userId) => {
  const leads = useLeads();
  const [status, setStatus] = useState('todos');
  const [source, setSource] = useState('todos');
  const [onlyMine, setOnlyMine] = useState(false);
  const [query, setQuery] = useState('');

  const counts = useMemo(
    () =>
      Object.fromEntries([
        ['todos', leads.length],
        ...LEAD_STATUSES.map((item) => [item.id, leads.filter((lead) => lead.status === item.id).length]),
      ]),
    [leads],
  );

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    return leads.filter(
      (lead) =>
        (status === 'todos' || lead.status === status) &&
        (source === 'todos' || lead.source === source) &&
        (!onlyMine || lead.assignedTo === userId) &&
        (!needle || normalize(`${lead.name} ${lead.phone} ${lead.neighborhood} ${lead.refCode}`).includes(needle)),
    );
  }, [leads, status, source, onlyMine, query, userId]);

  return { leads, visible, counts, status, setStatus, source, setSource, onlyMine, setOnlyMine, query, setQuery };
};
