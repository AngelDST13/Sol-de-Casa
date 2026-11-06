import { SimTag } from '../../../shared/components/SimTag.jsx';
import { SourceTag } from '../../../shared/components/StatusBadge.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useSettings } from '../../../shared/hooks/useStores.js';
import { LEAD_STATUSES, setLeadStatus } from '../../../services/leadsService.js';
import { savingsCalculator } from '../../../shared/model/index.js';
import { formatUsd } from '../../../shared/utils/format.js';
import { formatDateTime } from '../../../shared/utils/dates.js';
import { minutesSince, timeAgo } from '../../../shared/utils/time.js';
import styles from './Crm.module.css';

const digits = (phone) => phone.replace(/\D/g, '');

export const LeadRow = ({ lead, nameOf, onOpen }) => {
  const { user } = useAuth();
  const { responseGoalMinutes } = useSettings();
  const saving = savingsCalculator(lead.monthlyBill).monthly;
  const waiting = lead.status === 'nuevo' && minutesSince(lead.createdAt) > responseGoalMinutes;

  return (
    <article className={styles.row} data-status={lead.status}>
      <div className={styles.who}>
        <button type="button" className={styles.name} onClick={onOpen}>
          {lead.name}
        </button>
        {lead.simulated && <SimTag />}
        <span className={styles.sub}>
          {lead.neighborhood || 'Sin barrio'} · {timeAgo(lead.createdAt)}
          {waiting && <em className={styles.late}>Esperando llamada</em>}
        </span>
      </div>
      <div className={styles.meta}>
        <span>
          <small>Ahorro est.</small>
          {formatUsd(saving)}/mes
        </span>
        <span>
          <small>Origen</small>
          <SourceTag source={lead.source} />
        </span>
        <span>
          <small>Asesora</small>
          {nameOf(lead.assignedTo).split(' ')[0] || '—'}
        </span>
        <span>
          <small>Visita</small>
          {lead.visitAt ? formatDateTime(lead.visitAt) : '—'}
        </span>
      </div>
      <div className={styles.actions}>
        <label className={styles.statusSelect} data-status={lead.status}>
          <span className="visually-hidden">Estado de {lead.name}</span>
          <select value={lead.status} onChange={(event) => setLeadStatus(lead.id, event.target.value, user.name)}>
            {LEAD_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <a className={styles.iconButton} href={`tel:${digits(lead.phone)}`} aria-label={`Llamar a ${lead.name}`}>
          Llamar
        </a>
        <button type="button" className={styles.openButton} onClick={onOpen}>
          Abrir
        </button>
      </div>
    </article>
  );
};
