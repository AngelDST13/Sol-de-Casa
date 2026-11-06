import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useToast } from '../../../shared/components/Toast.jsx';
import { setLeadStatus, statusLabel, updateLead } from '../../../services/leadsService.js';
import { formatTime } from '../../../shared/utils/dates.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Agenda.module.css';

export const VisitCard = ({ lead, technician, onOpen }) => {
  const { user } = useAuth();
  const notify = useToast();
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
          <button
            type="button"
            onClick={() => {
              setLeadStatus(lead.id, 'visitado', user.name);
              notify(`Visita a ${lead.name.split(' ')[0]} marcada como hecha`);
            }}
          >
            Visita hecha
          </button>
          <button
            type="button"
            data-tone="muted"
            onClick={() => {
              updateLead(lead.id, { visitAt: null, technicianId: null });
              setLeadStatus(lead.id, 'contactado', user.name);
              notify('Visita liberada: vuelve a contactados sin visita', 'bad');
            }}
          >
            No estaba
          </button>
        </div>
      )}
      {lead.status === 'visitado' && user.position !== 'tecnico' && (
        <div className={styles.visitActions}>
          <button
            type="button"
            data-tone="good"
            onClick={() => {
              setLeadStatus(lead.id, 'firmado', user.name);
              notify(`${lead.name.split(' ')[0]} firmó`);
            }}
          >
            Firmó
          </button>
        </div>
      )}
    </article>
  );
};
