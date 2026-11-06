import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/index.js';
import { StatusBadge } from '../../../shared/components/StatusBadge.jsx';
import { useLeads, useShares } from '../../../shared/hooks/useLeads.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import { timeAgo } from '../../../shared/utils/time.js';
import styles from './OwnerPanel.module.css';

/** Referidos reales del sistema: quién refirió a quién y en qué paso van. */
export const LiveDemo = () => {
  const leads = useLeads();
  const shares = useShares();
  const referrals = leads.filter((lead) => lead.source === 'referido');

  return (
    <Card title="Referidos en el sistema" eyebrow="Quién refirió a quién">
      <div className={styles.liveStats}>
        <div>
          <span>Tarjetas compartidas</span>
          <strong className="num">{formatInteger(shares.length)}</strong>
        </div>
        <div>
          <span>Vecinos referidos</span>
          <strong className="num">{formatInteger(referrals.length)}</strong>
        </div>
      </div>
      <ul className={styles.referralList}>
        {referrals.map((lead) => (
          <li key={lead.id}>
            <span>
              <strong>{lead.name}</strong>
              <small>
                Refirió {lead.refCode} · recibo {formatUsd(lead.monthlyBill)} · {timeAgo(lead.createdAt)}
              </small>
            </span>
            <StatusBadge status={lead.status} />
          </li>
        ))}
      </ul>
      <p className={styles.small}>
        Para probarlo: entre como familia, comparta su link y agende desde él. Después cambie el estado en{' '}
        <Link to="/panel/solicitudes">Solicitudes</Link>.
      </p>
    </Card>
  );
};
