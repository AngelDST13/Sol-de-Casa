import { Link } from 'react-router-dom';
import { ChartCard, baseChartOptions } from '../../../shared/components/index.js';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { StatusBadge } from '../../../shared/components/StatusBadge.jsx';
import { useThemeColors } from '../../../shared/hooks/useThemeColors.js';
import { LEAD_SOURCES } from '../../../services/leadsService.js';
import { formatDateTime, formatTime } from '../../../shared/utils/dates.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import { timeAgo } from '../../../shared/utils/time.js';
import styles from './TeamHome.module.css';

/** Lo que hay que resolver hoy. Solo muestra lo que tiene algo pendiente. */
export const PendingStrip = ({ stats }) => {
  const items = [
    { count: stats.waiting.length, label: 'esperan llamada hace rato', tone: 'bad' },
    { count: stats.unassigned.length, label: 'sin asesora asignada', tone: 'warn' },
    { count: stats.noTechnician.length, label: 'visitas sin técnico', tone: 'warn' },
    { count: stats.overdue.length, label: 'visitas pasadas sin marcar', tone: 'warn' },
  ].filter((item) => item.count > 0);

  if (items.length === 0) {
    return (
      <p className={styles.allClear}>
        <span aria-hidden="true">✓</span> Todo al día: no hay solicitudes ni visitas pendientes.
      </p>
    );
  }
  return (
    <ul className={styles.pending} aria-label="Pendientes">
      {items.map((item) => (
        <li key={item.label} data-tone={item.tone}>
          <Link to={item.label.includes('visitas') ? '/panel/agenda' : '/panel/solicitudes'}>
            <strong>{formatInteger(item.count)}</strong> {item.label} →
          </Link>
        </li>
      ))}
    </ul>
  );
};

/** Solicitudes por día en las últimas dos semanas. */
export const LeadsTrendChart = ({ stats }) => {
  const colors = useThemeColors();
  const data = {
    labels: stats.daily.map((day) => day.label),
    datasets: [
      {
        label: 'Solicitudes',
        data: stats.daily.map((day) => day.count),
        backgroundColor: stats.daily.map((day) => (day.isToday ? colors.sun : colors.cell)),
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  };
  const options = baseChartOptions(colors, { legend: false, yFormat: (value) => formatInteger(value) });
  options.scales.y.ticks.stepSize = 1;
  options.scales.y.ticks.precision = 0;
  return (
    <ChartCard
      title="Solicitudes por día"
      eyebrow="Últimos 14 días"
      caption="La barra amarilla es hoy. Cuente las que llegan fuera de horario: esas son las que más esperan."
      type="bar"
      data={data}
      options={options}
      height={240}
    />
  );
};

/** Ventas firmadas y cuánto falta cobrar (50 % al firmar, 50 % al instalar). */
export const MoneyCard = ({ stats }) => (
  <section className={styles.card}>
    <h2>Ventas y cobros · 30 días</h2>
    <p className={styles.bigMoney}>{formatUsd(stats.revenue)}</p>
    <p className={styles.small}>{formatInteger(stats.signed30.length)} instalaciones firmadas a $6.500 promedio</p>
    <div className={styles.split}>
      <div>
        <span>Cobrado al firmar</span>
        <strong>{formatUsd(stats.collected)}</strong>
      </div>
      <div>
        <span>Por cobrar al instalar</span>
        <strong>{formatUsd(stats.toCollect)}</strong>
      </div>
    </div>
    <div className={styles.pipeline}>
      <span>
        En propuesta: <strong>{formatInteger(stats.inProposal.length)}</strong> visitas agendadas o hechas
      </span>
      <strong>{formatUsd(stats.proposalValue)}</strong>
    </div>
    <p className={styles.small}>Ojo con la caja: los equipos (55 %) se pagan el mismo día que el cliente firma.</p>
  </section>
);

/** Visitas de hoy y de los próximos 7 días. */
export const VisitsCard = ({ stats, title }) => (
  <section className={styles.card}>
    <div className={styles.cardHead}>
      <h2>{title}</h2>
      <Link to="/panel/agenda">Agenda</Link>
    </div>
    {stats.visitsToday.length === 0 && stats.upcoming.length === 0 ? (
      <EmptyState title="No hay visitas próximas">Agende desde Solicitudes.</EmptyState>
    ) : (
      <ul className={styles.recent}>
        {stats.visitsToday.map((lead) => (
          <li key={lead.id}>
            <span>
              <strong>
                Hoy {formatTime(lead.visitAt)} · {lead.name}
              </strong>
              <small>
                {lead.neighborhood || 'Sin barrio'} · {lead.phone}
              </small>
            </span>
            <StatusBadge status={lead.status} />
          </li>
        ))}
        {stats.upcoming.slice(0, 5).map((lead) => (
          <li key={lead.id}>
            <span>
              <strong>{lead.name}</strong>
              <small>
                {formatDateTime(lead.visitAt)} · {lead.neighborhood || 'Sin barrio'}
              </small>
            </span>
            <StatusBadge status={lead.status} />
          </li>
        ))}
      </ul>
    )}
  </section>
);

export const ActivityCard = ({ activity }) => (
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
);

/** Origen de las solicitudes y barrios que más piden. */
export const OriginCard = ({ stats }) => {
  const max = Math.max(1, ...stats.bySource.map((item) => item.count));
  return (
    <section className={styles.card}>
      <h2>De dónde llegan</h2>
      <ul className={styles.sources}>
        {stats.bySource.map((item) => (
          <li key={item.source}>
            <span>{LEAD_SOURCES[item.source]}</span>
            <span className={styles.sourceBar}>
              <span data-source={item.source} style={{ width: `${(item.count / max) * 100}%` }} />
            </span>
            <strong className="num">{formatInteger(item.count)}</strong>
          </li>
        ))}
      </ul>
      <h3 className={styles.subhead}>Barrios que más piden</h3>
      <ol className={styles.ranking}>
        {stats.neighborhoods.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <strong>{formatInteger(item.count)}</strong>
          </li>
        ))}
      </ol>
      <p className={styles.small}>
        Donde se juntan varias solicitudes conviene poner letreros: 20 casas trajeron 6 leads.
      </p>
    </section>
  );
};
