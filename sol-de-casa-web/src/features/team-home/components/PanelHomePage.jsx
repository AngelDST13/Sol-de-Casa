import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { StatTile } from '../../../shared/components/index.js';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { StatusBadge, SourceTag } from '../../../shared/components/StatusBadge.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { useActivity, useSettings, useTeam } from '../../../shared/hooks/useStores.js';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';
import { LEAD_SOURCES } from '../../../services/leadsService.js';
import { calculateMonth, referralSaleCost } from '../../../shared/model/index.js';
import { can } from '../../../shared/utils/permissions.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import { formatTime, sameDay } from '../../../shared/utils/dates.js';
import { minutesSince, timeAgo } from '../../../shared/utils/time.js';
import styles from './TeamHome.module.css';

const DAY = 24 * 60;

/** Resumen del día. Cada puesto ve lo que le toca: el técnico, sus visitas; la asesora y Andrés, todo. */
export const PanelHomePage = () => {
  const { user } = useAuth();
  const leads = useLeads();
  const activity = useActivity();
  const settings = useSettings();
  const technicians = useTeam(['tecnico']);
  const { params } = useCaseParams();
  const month = calculateMonth(params);
  const referral = referralSaleCost();
  const isTechnician = user.position === 'tecnico';

  const stats = useMemo(() => {
    const today = new Date();
    const pending = leads.filter((lead) => lead.status === 'nuevo');
    const visitsToday = leads
      .filter(
        (lead) =>
          lead.visitAt &&
          lead.status !== 'perdido' &&
          sameDay(new Date(lead.visitAt), today) &&
          (!isTechnician || lead.technicianId === user.id),
      )
      .sort((a, b) => new Date(a.visitAt) - new Date(b.visitAt));
    const week = leads.filter((lead) => minutesSince(lead.createdAt) <= 7 * DAY);
    const scheduled = leads.filter((lead) => lead.status === 'agendado');
    const signedMonth = leads.filter((lead) => lead.status === 'firmado' && minutesSince(lead.createdAt) <= 30 * DAY);
    const monthVisits = leads.filter((lead) => {
      if (!lead.visitAt || lead.status === 'perdido') return false;
      const date = new Date(lead.visitAt);
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }).length;
    const bySource = Object.keys(LEAD_SOURCES).map((source) => ({
      source,
      count: leads.filter((lead) => lead.source === source).length,
    }));
    return { pending, visitsToday, week, scheduled, signedMonth, monthVisits, bySource };
  }, [leads, isTechnician, user.id]);

  const capacity = technicians.length * settings.visitsPerTechnician;
  const maxSource = Math.max(1, ...stats.bySource.map((item) => item.count));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p>{greeting},</p>
        <h1>{user.name.split(' ')[0]}.</h1>
      </header>

      {can(user, 'solicitudes') && (
        <section className={`${styles.callNow} panel-grid`} aria-labelledby="llamar-title">
          <div>
            <p className={styles.eyebrow}>Llamar ahora</p>
            <h2 id="llamar-title">
              {stats.pending.length === 0
                ? 'No hay solicitudes esperando.'
                : `${formatInteger(stats.pending.length)} ${stats.pending.length === 1 ? 'persona espera' : 'personas esperan'} su llamada.`}
            </h2>
            <p className={styles.callHint}>
              La meta es llamar en menos de {settings.responseGoalMinutes} minutos: con eso el contacto de Meta sube de
              55 % a 80 % (supuesto 7).
            </p>
          </div>
          <ul className={styles.callList}>
            {stats.pending.slice(0, 4).map((lead) => {
              const late = minutesSince(lead.createdAt) > settings.responseGoalMinutes;
              return (
                <li key={lead.id}>
                  <div>
                    <strong>{lead.name}</strong>
                    <span>
                      <SourceTag source={lead.source} /> · {timeAgo(lead.createdAt)}
                      {late && <em className={styles.late}>Esperando</em>}
                    </span>
                  </div>
                  <a href={`tel:${lead.phone.replace(/\s/g, '')}`} className={styles.callButton}>
                    Llamar
                  </a>
                </li>
              );
            })}
          </ul>
          <Link to="/panel/solicitudes" className={styles.allLink}>
            Ver todas las solicitudes →
          </Link>
        </section>
      )}

      {!isTechnician && (
        <div className={styles.kpis}>
          <StatTile label="Solicitudes, últimos 7 días" value={formatInteger(stats.week.length)} />
          <StatTile label="Visitas agendadas" value={formatInteger(stats.scheduled.length)} />
          <StatTile label="Firmas, últimos 30 días" value={formatInteger(stats.signedMonth.length)} tone="good" />
          <StatTile
            label="Visitas del mes"
            value={`${formatInteger(stats.monthVisits)} / ${formatInteger(capacity)}`}
            detail="Agendadas frente a la capacidad de los técnicos"
            tone={stats.monthVisits > capacity ? 'bad' : undefined}
          />
        </div>
      )}

      <div className={styles.grid}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2>{isTechnician ? 'Sus visitas de hoy' : 'Visitas de hoy'}</h2>
            <Link to="/panel/agenda">Agenda</Link>
          </div>
          {stats.visitsToday.length === 0 ? (
            <EmptyState title="No hay visitas hoy">Las próximas aparecen en la agenda de la semana.</EmptyState>
          ) : (
            <ul className={styles.recent}>
              {stats.visitsToday.map((lead) => (
                <li key={lead.id}>
                  <span>
                    <strong>
                      {formatTime(lead.visitAt)} · {lead.name}
                    </strong>
                    <small>
                      {lead.neighborhood || 'Sin barrio'} · {lead.phone}
                    </small>
                  </span>
                  <StatusBadge status={lead.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {!isTechnician && (
          <section className={styles.card}>
            <h2>Actividad reciente</h2>
            {activity.length === 0 ? (
              <EmptyState title="Sin actividad todavía">Aquí aparece cada cambio que hace el equipo.</EmptyState>
            ) : (
              <ul className={styles.activity}>
                {activity.slice(0, 7).map((event) => (
                  <li key={event.id}>
                    <span>
                      <strong>{event.actor}</strong> {event.action.charAt(0).toLowerCase() + event.action.slice(1)}
                      {event.detail && <em> · {event.detail}</em>}
                    </span>
                    <small>{timeAgo(event.at)}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {!isTechnician && (
        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>De dónde llegan</h2>
            <ul className={styles.sources}>
              {stats.bySource
                .filter((item) => item.count > 0)
                .map((item) => (
                  <li key={item.source}>
                    <span>{LEAD_SOURCES[item.source]}</span>
                    <span className={styles.sourceBar}>
                      <span data-source={item.source} style={{ width: `${(item.count / maxSource) * 100}%` }} />
                    </span>
                    <strong className="num">{formatInteger(item.count)}</strong>
                  </li>
                ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2>Lo que cuesta un cliente</h2>
            <ul className={styles.costs}>
              <li>
                <span>Meta</span>
                <strong>{formatUsd(month.meta.realCac)}</strong>
              </li>
              <li>
                <span>Google</span>
                <strong>{formatUsd(month.google.realCac)}</strong>
              </li>
              <li data-best="true">
                <span>Referido</span>
                <strong>{formatUsd(referral.totalCost)}</strong>
              </li>
            </ul>
            <p className={styles.small}>
              CAC real: anuncios más visitas técnicas. El referido incluye visitas y premios (regla: menos de $300).
            </p>
            {can(user, 'anuncios') && (
              <Link to="/panel/anuncios" className={styles.allLink}>
                Abrir el tablero de anuncios →
              </Link>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
