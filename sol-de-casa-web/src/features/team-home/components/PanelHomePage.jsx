import { Link } from 'react-router-dom';
import { StatTile } from '../../../shared/components/index.js';
import { SourceTag } from '../../../shared/components/StatusBadge.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { useActivity, useSettings, useTeam } from '../../../shared/hooks/useStores.js';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';
import { calculateMonth, referralSaleCost } from '../../../shared/model/index.js';
import { can } from '../../../shared/utils/permissions.js';
import { formatInteger, formatPercent, formatUsd } from '../../../shared/utils/format.js';
import { minutesSince, timeAgo } from '../../../shared/utils/time.js';
import { useDashboardStats } from '../hooks/useDashboardStats.js';
import { ActivityCard, LeadsTrendChart, MoneyCard, OriginCard, PendingStrip, VisitsCard } from './DashboardBlocks.jsx';
import styles from './TeamHome.module.css';

/** Con pocas solicitudes, un porcentaje engaña (de 1 a 9 es «+800 %»): se muestran cantidades. */
const trendText = (current, previous) => {
  const diff = current - previous;
  if (diff === 0) return `Igual que la semana anterior (${formatInteger(previous)})`;
  return `${diff > 0 ? '▲' : '▼'} ${formatInteger(Math.abs(diff))} ${diff > 0 ? 'más' : 'menos'} que la semana anterior (${formatInteger(previous)})`;
};

/** Resumen del día. Cada puesto ve lo que le toca: el técnico, sus visitas; la asesora y Andrés, todo. */
export const PanelHomePage = () => {
  const { user } = useAuth();
  const leads = useLeads();
  const activity = useActivity();
  const settings = useSettings();
  const technicians = useTeam(['tecnico']);
  const { params } = useCaseParams();
  const isTechnician = user.position === 'tecnico';
  const stats = useDashboardStats(leads, {
    responseGoalMinutes: settings.responseGoalMinutes,
    onlyTechnicianId: isTechnician ? user.id : null,
  });
  const month = calculateMonth(params);
  const referral = referralSaleCost();
  const capacity = technicians.length * settings.visitsPerTechnician;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';
  const longDate = now.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' });
  const today = longDate.charAt(0).toUpperCase() + longDate.slice(1);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p>
          {greeting} · <span className={styles.date}>{today}</span>
        </p>
        <h1>{user.name.split(' ')[0]}.</h1>
      </header>

      {!isTechnician && <PendingStrip stats={stats} />}

      {!isTechnician && (
        <div className={styles.kpis}>
          <StatTile
            label="Solicitudes, 7 días"
            value={formatInteger(stats.last7.length)}
            detail={trendText(stats.last7.length, stats.prev7Count)}
          />
          <StatTile
            label="Firmas, 30 días"
            value={formatInteger(stats.signed30.length)}
            detail={`${formatUsd(stats.revenue)} en ventas`}
            tone="good"
          />
          <StatTile
            label="Visitas del mes"
            value={`${formatInteger(stats.monthVisits)} / ${formatInteger(capacity)}`}
            detail={`${formatPercent(capacity ? (stats.monthVisits / capacity) * 100 : 0)} de la capacidad`}
            tone={stats.monthVisits > capacity ? 'bad' : undefined}
          />
          <StatTile
            label="Primera respuesta"
            value={stats.responseAverage === null ? '—' : `${formatInteger(stats.responseAverage)} min`}
            detail={`Meta: menos de ${settings.responseGoalMinutes} min`}
            tone={
              stats.responseAverage !== null && stats.responseAverage > settings.responseGoalMinutes ? 'bad' : undefined
            }
          />
        </div>
      )}

      {can(user, 'solicitudes') && (
        <div className={styles.split2}>
          <section className={`${styles.callNow} panel-grid`} aria-labelledby="llamar-title">
            <div>
              <p className={styles.eyebrow}>Llamar ahora</p>
              <h2 id="llamar-title">
                {stats.pending.length === 0
                  ? 'Nadie espera su llamada.'
                  : `${formatInteger(stats.pending.length)} ${stats.pending.length === 1 ? 'persona espera' : 'personas esperan'} su llamada.`}
              </h2>
              <p className={styles.callHint}>
                Llamar en menos de {settings.responseGoalMinutes} minutos sube el contacto de Meta de 55 % a 80 %
                (supuesto 7).
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
          <LeadsTrendChart stats={stats} />
        </div>
      )}

      <div className={styles.grid}>
        <VisitsCard stats={stats} title={isTechnician ? 'Sus próximas visitas' : 'Visitas de hoy y esta semana'} />
        {!isTechnician && <ActivityCard activity={activity} />}
      </div>

      {!isTechnician && (
        <div className={styles.grid3}>
          <MoneyCard stats={stats} />
          <OriginCard stats={stats} />
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
