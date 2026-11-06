import { useMemo, useState } from 'react';
import { PageHeader, StatTile } from '../../../shared/components/index.js';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { useSettings, useTeam, useUsers } from '../../../shared/hooks/useStores.js';
import { addDays, formatShortDay, sameDay, startOfWeek } from '../../../shared/utils/dates.js';
import { formatInteger, formatPercent } from '../../../shared/utils/format.js';
import { LeadDialog } from '../../crm/index.js';
import { VisitCard } from './VisitCard.jsx';
import admin from '../../../shared/components/admin.module.css';
import styles from './Agenda.module.css';

/** Agenda semanal de visitas técnicas, con la capacidad del mes. */
export const AgendaPage = () => {
  const { user } = useAuth();
  const leads = useLeads();
  const users = useUsers();
  const technicians = useTeam(['tecnico']);
  const settings = useSettings();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [onlyMine, setOnlyMine] = useState(user.position === 'tecnico');
  const [openId, setOpenId] = useState(null);
  const nameOf = (id) => users.find((item) => item.id === id)?.name ?? '—';

  const visits = useMemo(
    () =>
      leads
        .filter((lead) => lead.visitAt && lead.status !== 'perdido' && (!onlyMine || lead.technicianId === user.id))
        .sort((a, b) => new Date(a.visitAt) - new Date(b.visitAt)),
    [leads, onlyMine, user.id],
  );

  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const today = new Date();
  const monthVisits = leads.filter((lead) => {
    if (!lead.visitAt || lead.status === 'perdido') return false;
    const date = new Date(lead.visitAt);
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }).length;
  const capacity = technicians.length * settings.visitsPerTechnician;
  const toSchedule = leads.filter((lead) => lead.status === 'contactado' && !lead.visitAt);

  return (
    <>
      <PageHeader level="Operación" title="Agenda de visitas">
        Las visitas técnicas de la semana. Cada técnico hace como máximo {settings.visitsPerTechnician} al mes; marque
        cada visita al terminarla.
      </PageHeader>

      <div className={styles.kpis}>
        <StatTile
          label="Visitas este mes"
          value={`${formatInteger(monthVisits)} / ${formatInteger(capacity)}`}
          detail={`${formatPercent(capacity ? (monthVisits / capacity) * 100 : 0)} de la capacidad`}
        />
        <StatTile
          label="Técnicos activos"
          value={formatInteger(technicians.length)}
          detail={`${formatInteger(settings.visitsPerTechnician)} visitas c/u al mes`}
        />
        <StatTile
          label="Por agendar"
          value={formatInteger(toSchedule.length)}
          detail="Contactados sin visita"
          tone={toSchedule.length ? 'bad' : undefined}
        />
      </div>

      <div className={styles.weekBar}>
        <div className={styles.weekNav}>
          <button type="button" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Semana anterior">
            ←
          </button>
          <strong>
            {days[0].toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })} –{' '}
            {days[6].toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </strong>
          <button type="button" onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Semana siguiente">
            →
          </button>
          <button type="button" className={styles.today} onClick={() => setWeekStart(startOfWeek(new Date()))}>
            Hoy
          </button>
        </div>
        <button type="button" className={admin.chip} aria-pressed={onlyMine} onClick={() => setOnlyMine(!onlyMine)}>
          Solo mis visitas
        </button>
      </div>

      <div className={styles.week}>
        {days.map((day) => {
          const dayVisits = visits.filter((visit) => sameDay(new Date(visit.visitAt), day));
          return (
            <section
              key={day.toISOString()}
              className={styles.day}
              data-today={sameDay(day, today)}
              aria-label={formatShortDay(day)}
            >
              <h2>
                {formatShortDay(day)}
                {dayVisits.length > 0 && <span>{dayVisits.length}</span>}
              </h2>
              {dayVisits.length === 0 ? (
                <p className={styles.free}>Sin visitas</p>
              ) : (
                dayVisits.map((visit) => (
                  <VisitCard
                    key={visit.id}
                    lead={visit}
                    technician={nameOf(visit.technicianId)}
                    onOpen={() => setOpenId(visit.id)}
                  />
                ))
              )}
            </section>
          );
        })}
      </div>

      {user.position !== 'tecnico' && (
        <section className={styles.pending} aria-labelledby="por-agendar">
          <h2 id="por-agendar">Contactados sin visita</h2>
          {toSchedule.length === 0 ? (
            <EmptyState title="Todo agendado">Los contactados ya tienen día de visita.</EmptyState>
          ) : (
            <ul>
              {toSchedule.map((lead) => (
                <li key={lead.id}>
                  <span>
                    <strong>{lead.name}</strong>
                    <small>
                      {lead.neighborhood || 'Sin barrio'} · {lead.phone}
                    </small>
                  </span>
                  <button type="button" className={admin.chip} onClick={() => setOpenId(lead.id)}>
                    Agendar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <LeadDialog leadId={openId} onClose={() => setOpenId(null)} />
    </>
  );
};
