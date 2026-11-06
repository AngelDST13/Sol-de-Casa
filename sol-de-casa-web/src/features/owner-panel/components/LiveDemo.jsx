import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/index.js';
import { StatusBadge } from '../../../shared/components/StatusBadge.jsx';
import { useFunnelEvents, useLeads, useShares } from '../../../shared/hooks/useLeads.js';
import { referralStage } from '../../../services/leadsService.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import { timeAgo } from '../../../shared/utils/time.js';
import styles from './OwnerPanel.module.css';

/**
 * Requisito 5 con datos reales del sistema (no simulados): lo que las familias comparten
 * y lo que hacen los vecinos en su página, paso a paso.
 */
export const LiveDemo = () => {
  const leads = useLeads();
  const shares = useShares();
  const events = useFunnelEvents();
  const referrals = leads.filter((lead) => lead.source === 'referido');
  const live = referrals.filter((lead) => !lead.simulated);

  const steps = [
    { label: 'Tarjetas compartidas', value: shares.length },
    {
      label: 'Vecinos que abrieron el link',
      value: events.filter((event) => event.type === 'abrio' && event.refCode).length,
    },
    {
      label: 'Usaron la calculadora',
      value: events.filter((event) => event.type === 'calculo' && event.refCode).length,
    },
    { label: 'Agendaron', value: live.length },
    { label: 'Firmaron', value: live.filter((lead) => referralStage(lead.status) === 3).length },
  ];

  return (
    <Card title="Medición en vivo" eyebrow="Lo que pasa de verdad en el sistema">
      <ol className={styles.liveFunnel}>
        {steps.map((step) => (
          <li key={step.label}>
            <strong className="num">{formatInteger(step.value)}</strong>
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
      <p className={styles.small}>
        Se cuenta cada vez que una familia comparte (WhatsApp, imagen o link), cada vez que un vecino abre su link y la
        primera vez que mueve la calculadora. Para probarlo: entre como familia, comparta y abra «Ver lo que ve su
        vecino».
      </p>

      <h3 className={styles.subhead}>Quién refirió a quién</h3>
      <ul className={styles.referralList}>
        {referrals.map((lead) => (
          <li key={lead.id}>
            <span>
              <strong>{lead.name}</strong>
              <small>
                Refirió {lead.refCode} · recibo {formatUsd(lead.monthlyBill)} · {timeAgo(lead.createdAt)}
                {lead.simulated && ' · simulado'}
              </small>
            </span>
            <StatusBadge status={lead.status} />
          </li>
        ))}
      </ul>
      <p className={styles.small}>
        El estado se cambia en <Link to="/panel/solicitudes">Solicitudes</Link>; la familia ve el avance en su cuenta.
      </p>
    </Card>
  );
};
