import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { setLeadStatus, statusLabel, updateLead } from '../../../services/leadsService.js';
import { formatTime } from '../../../shared/utils/dates.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Agenda.module.css';

export const VisitCard = ({ lead, technician, onOpen }) => {
  const { user } = useAuth();
  const pending = lead.status === 'agendado';
  return (
    <article className={styles.visit} data-status={lead.status}>
      <div className={styles.visitHead}>
        <time dateTime={lead.visitAt}>{formatTime(lead.visitAt)}</time>
        <span className={styles.visitStatus}>{statusLabel(lead.status)}</span>
      </div>
      <button type="button" className={styles.visitName} onClick={onOpen}>
        {lead.name}
      </button>
      <p>
        {lead.neighborhood || 'Sin barrio'} · recibo {formatUsd(lead.monthlyBill)}
      </p>
      <p className={styles.tech}>Técnico: {technician}</p>
      {pending && (
        <div className={styles.visitActions}>
          <button type="button" onClick={() => setLeadStatus(lead.id, 'visitado', user.name)}>
            Visita hecha
          </button>
          <button
            type="button"
            data-tone="muted"
            onClick={() => {
              updateLead(lead.id, { visitAt: null, technicianId: null });
              setLeadStatus(lead.id, 'contactado', user.name);
            }}
          >
            No estaba
          </button>
        </div>
      )}
      {lead.status === 'visitado' && user.position !== 'tecnico' && (
        <div className={styles.visitActions}>
          <button type="button" data-tone="good" onClick={() => setLeadStatus(lead.id, 'firmado', user.name)}>
            Firmó
          </button>
        </div>
      )}
    </article>
  );
};
