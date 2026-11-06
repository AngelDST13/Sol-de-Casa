import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { StatTile } from '../../../shared/components/index.js';
import { StatusBadge, SourceTag } from '../../../shared/components/StatusBadge.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';
import { LEAD_SOURCES } from '../../../services/leadsService.js';
import { calculateMonth, referralSaleCost } from '../../../shared/model/index.js';
import { formatCount, formatInteger, formatUsd } from '../../../shared/utils/format.js';
import { minutesSince, timeAgo } from '../../../shared/utils/time.js';
import styles from './TeamHome.module.css';

const DAY = 24 * 60;

/** Resumen del día para Andrés y las asesoras. */
export const PanelHomePage = () => {
  const { user } = useAuth();
  const leads = useLeads();
  const { params } = useCaseParams();
  const month = calculateMonth(params);
  const referral = referralSaleCost();

  const stats = useMemo(() => {
    const pending = leads.filter((lead) => lead.status === 'nuevo');
    const week = leads.filter((lead) => minutesSince(lead.createdAt) <= 7 * DAY);
    const scheduled = leads.filter((lead) => lead.status === 'agendado');
    const signedMonth = leads.filter((lead) => lead.status === 'firmado' && minutesSince(lead.createdAt) <= 30 * DAY);
    const bySource = Object.keys(LEAD_SOURCES).map((source) => ({
      source,
      count: leads.filter((lead) => lead.source === source).length,
    }));
    return { pending, week, scheduled, signedMonth, bySource };
  }, [leads]);

  const maxSource = Math.max(1, ...stats.bySource.map((item) => item.count));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p>{greeting},</p>
        <h1>{user.name.split(' ')[0]}.</h1>
      </header>

      <section className={`${styles.callNow} panel-grid`} aria-labelledby="llamar-title">
        <div>
          <p className={styles.eyebrow}>Llamar ahora</p>
          <h2 id="llamar-title">
            {stats.pending.length === 0
              ? 'No hay solicitudes esperando.'
              : `${formatInteger(stats.pending.length)} ${stats.pending.length === 1 ? 'persona espera' : 'personas esperan'} su llamada.`}
          </h2>
          <p className={styles.callHint}>
            La meta es llamar en menos de 5 minutos: con eso el contacto de Meta sube de 55 % a 80 % (supuesto 7).
          </p>
        </div>
        <ul className={styles.callList}>
          {stats.pending.slice(0, 4).map((lead) => {
            const late = minutesSince(lead.createdAt) > 5;
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

      <div className={styles.kpis}>
        <StatTile label="Solicitudes, últimos 7 días" value={formatInteger(stats.week.length)} />
        <StatTile label="Visitas agendadas" value={formatInteger(stats.scheduled.length)} />
        <StatTile label="Firmas, últimos 30 días" value={formatInteger(stats.signedMonth.length)} tone="good" />
        <StatTile
          label="Uso de visitas (anuncios)"
          value={`${formatCount(month.total.requestedVisits)} / ${formatInteger(month.capacity)}`}
          detail="Visitas pedidas al mes frente a la capacidad"
          tone={month.total.overCapacity ? 'bad' : undefined}
        />
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>De dónde llegan</h2>
          <ul className={styles.sources}>
            {stats.bySource.map((item) => (
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
          <Link to="/panel/anuncios" className={styles.allLink}>
            Abrir el tablero de anuncios →
          </Link>
        </section>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2>Últimas solicitudes</h2>
          <Link to="/panel/solicitudes">Ver todas</Link>
        </div>
        <ul className={styles.recent}>
          {leads.slice(0, 5).map((lead) => (
            <li key={lead.id}>
              <span>
                <strong>{lead.name}</strong>
                <small>
                  {lead.neighborhood || 'Sin barrio'} · {timeAgo(lead.createdAt)}
                </small>
              </span>
              <SourceTag source={lead.source} />
              <StatusBadge status={lead.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
