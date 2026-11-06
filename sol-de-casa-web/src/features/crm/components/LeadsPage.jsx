import { PageHeader } from '../../../shared/components/index.js';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { LEAD_SOURCES, LEAD_STATUSES, resetDemoData } from '../../../services/leadsService.js';
import { useLeadFilters } from '../hooks/useLeadFilters.js';
import { LeadRow } from './LeadRow.jsx';
import styles from './Crm.module.css';

/** Solicitudes de visita: lo que las asesoras trabajan todos los días. */
export const LeadsPage = () => {
  const filters = useLeadFilters();

  return (
    <>
      <PageHeader level="Operación" title="Solicitudes de visita">
        Cada persona que pidió que le midan el techo, de dónde llegó y en qué paso va. Cambie el estado al avanzar: si
        vino por referido, la familia que lo refirió ve el avance en su cuenta.
      </PageHeader>

      <div className={styles.toolbar}>
        <div className={styles.chips} role="group" aria-label="Filtrar por estado">
          {[{ id: 'todos', label: 'Todas' }, ...LEAD_STATUSES].map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filters.status === item.id}
              onClick={() => filters.setStatus(item.id)}
            >
              {item.label} <span>{filters.counts[item.id]}</span>
            </button>
          ))}
        </div>
        <div className={styles.filters}>
          <label className={styles.search}>
            <span className="visually-hidden">Buscar</span>
            <input
              type="search"
              placeholder="Buscar por nombre, teléfono, barrio o código"
              value={filters.query}
              onChange={(event) => filters.setQuery(event.target.value)}
            />
          </label>
          <label className={styles.select}>
            <span className="visually-hidden">Origen</span>
            <select value={filters.source} onChange={(event) => filters.setSource(event.target.value)}>
              <option value="todos">Todos los orígenes</option>
              {Object.entries(LEAD_SOURCES).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section className={styles.list} aria-label="Solicitudes">
        {filters.visible.length === 0 ? (
          <EmptyState title="No hay solicitudes con esos filtros">Pruebe con otro estado u origen.</EmptyState>
        ) : (
          filters.visible.map((lead) => <LeadRow key={lead.id} lead={lead} />)
        )}
      </section>

      <p className={styles.foot}>
        {filters.visible.length} de {filters.total} solicitudes. Las marcadas «simulado» son de ejemplo.{' '}
        <button type="button" onClick={resetDemoData}>
          Restablecer los datos de demostración
        </button>
      </p>
    </>
  );
};
