import { SimTag } from '../../../shared/components/SimTag.jsx';
import { SourceTag } from '../../../shared/components/StatusBadge.jsx';
import { LEAD_STATUSES, updateLead } from '../../../services/leadsService.js';
import { savingsCalculator } from '../../../shared/model/index.js';
import { formatUsd } from '../../../shared/utils/format.js';
import { minutesSince, timeAgo } from '../../../shared/utils/time.js';
import styles from './Crm.module.css';

const digits = (phone) => phone.replace(/\D/g, '');

export const LeadRow = ({ lead }) => {
  const saving = savingsCalculator(lead.monthlyBill).monthly;
  const waiting = lead.status === 'nuevo' && minutesSince(lead.createdAt) > 5;

  return (
    <article className={styles.row} data-status={lead.status}>
      <div className={styles.who}>
        <strong>
          {lead.name} {lead.simulated && <SimTag />}
        </strong>
        <span>
          {lead.neighborhood || 'Sin barrio'} · {timeAgo(lead.createdAt)}
          {waiting && <em className={styles.late}> · esperando llamada</em>}
        </span>
      </div>
      <div className={styles.meta}>
        <span>
          <small>Recibo</small>
          {formatUsd(lead.monthlyBill)}
        </span>
        <span>
          <small>Ahorro est.</small>
          {formatUsd(saving)}/mes
        </span>
        <span>
          <small>Origen</small>
          <SourceTag source={lead.source} />
          {lead.refCode && <code className={styles.ref}>{lead.refCode}</code>}
        </span>
      </div>
      <div className={styles.actions}>
        <label className={styles.statusSelect} data-status={lead.status}>
          <span className="visually-hidden">Estado de {lead.name}</span>
          <select value={lead.status} onChange={(event) => updateLead(lead.id, { status: event.target.value })}>
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
        <a
          className={styles.iconButton}
          href={`https://wa.me/506${digits(lead.phone)}`}
          target="_blank"
          rel="noreferrer"
          aria-label={`Escribir por WhatsApp a ${lead.name}`}
        >
          WhatsApp
        </a>
      </div>
    </article>
  );
};
