import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { PageHeader } from '../../../shared/components/index.js';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useUsers } from '../../../shared/hooks/useStores.js';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../../services/leadsService.js';
import { downloadCsv, toCsv } from '../../../shared/utils/csv.js';
import { useLeadFilters } from '../hooks/useLeadFilters.js';
import { leadColumns } from '../leadsCsv.js';
import { LeadRow } from './LeadRow.jsx';
import { LeadDialog } from './LeadDialog.jsx';
import { NewLeadDialog } from './NewLeadDialog.jsx';
import admin from '../../../shared/components/admin.module.css';
import styles from './Crm.module.css';

/** Solicitudes de visita: lo que las asesoras trabajan todos los días. */
export const LeadsPage = () => {
  const { user } = useAuth();
  const users = useUsers();
  const filters = useLeadFilters(user.id);
  const [openId, setOpenId] = useState(null);
  const [creating, setCreating] = useState(false);
  const nameOf = (id) => users.find((item) => item.id === id)?.name ?? '';

  const exportCsv = () =>
    downloadCsv(
      `solicitudes-sol-de-casa-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(filters.visible, leadColumns(nameOf)),
    );

  return (
    <>
      <PageHeader level="Operación" title="Solicitudes de visita">
        Cada persona que pidió que le midan el techo. Abra una para asignarla, agendar la visita o dejar notas. Si vino
        por referido, la familia ve el avance en su cuenta.
      </PageHeader>

      <div className={admin.toolbar}>
        <input
          type="search"
          className={`${admin.input} ${admin.grow}`}
          placeholder="Buscar por nombre, teléfono, barrio o código"
          aria-label="Buscar solicitudes"
          value={filters.query}
          onChange={(event) => filters.setQuery(event.target.value)}
        />
        <select
          className={admin.select}
          aria-label="Filtrar por origen"
          value={filters.source}
          onChange={(event) => filters.setSource(event.target.value)}
        >
          <option value="todos">Todos los orígenes</option>
          {Object.entries(LEAD_SOURCES).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <Button variant="dark" onClick={() => setCreating(true)}>
          + Nueva solicitud
        </Button>
        <Button variant="ghost" onClick={exportCsv}>
          Exportar CSV
        </Button>
      </div>

      <div className={admin.chips} role="group" aria-label="Filtrar por estado">
        <button
          type="button"
          className={admin.chip}
          aria-pressed={filters.onlyMine}
          onClick={() => filters.setOnlyMine(!filters.onlyMine)}
        >
          Solo las mías
        </button>
        {[{ id: 'todos', label: 'Todas' }, ...LEAD_STATUSES].map((item) => (
          <button
            key={item.id}
            type="button"
            className={admin.chip}
            aria-pressed={filters.status === item.id}
            onClick={() => filters.setStatus(item.id)}
          >
            {item.label} <span>{filters.counts[item.id]}</span>
          </button>
        ))}
      </div>

      <section className={styles.list} aria-label="Solicitudes">
        {filters.visible.length === 0 ? (
          <EmptyState title="No hay solicitudes con esos filtros">Pruebe con otro estado u origen.</EmptyState>
        ) : (
          filters.visible.map((lead) => (
            <LeadRow key={lead.id} lead={lead} nameOf={nameOf} onOpen={() => setOpenId(lead.id)} />
          ))
        )}
      </section>

      <p className={styles.foot}>
        {filters.visible.length} de {filters.leads.length} solicitudes. Las marcadas «simulado» son de ejemplo.
      </p>

      <LeadDialog leadId={openId} onClose={() => setOpenId(null)} />
      <NewLeadDialog open={creating} onClose={() => setCreating(false)} onCreated={(id) => setOpenId(id)} />
    </>
  );
};
