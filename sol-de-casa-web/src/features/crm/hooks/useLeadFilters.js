import { useMemo, useState } from 'react';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { LEAD_STATUSES } from '../../../services/leadsService.js';

const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Filtros del CRM: estado, origen y búsqueda por nombre, teléfono o barrio. */
export const useLeadFilters = () => {
  const leads = useLeads();
  const [status, setStatus] = useState('todos');
  const [source, setSource] = useState('todos');
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
        (!needle ||
          normalize(`${lead.name} ${lead.phone} ${lead.neighborhood} ${lead.refCode ?? ''}`).includes(needle)),
    );
  }, [leads, status, source, query]);

  return { visible, counts, status, setStatus, source, setSource, query, setQuery, total: leads.length };
};
