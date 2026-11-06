import { Card } from '../../../shared/components/index.js';
import { formatInteger, formatPercent } from '../../../shared/utils/format.js';
import { EXPERIMENT_GROUP } from '../data/simulatedPanel.js';
import styles from './OwnerPanel.module.css';

const STEPS = [
  { key: 'families', label: 'Familias con la experiencia' },
  { key: 'sawSavings', label: 'Vieron su ahorro' },
  { key: 'sharedFamilies', label: 'Compartieron su tarjeta' },
  { key: 'cardsShared', label: 'Tarjetas compartidas' },
  { key: 'linkOpens', label: 'Vecinos abrieron el link' },
  { key: 'calculatorUses', label: 'Usaron la calculadora' },
  { key: 'leads', label: 'Agendaron (dejaron sus datos)' },
  { key: 'visits', label: 'Visitas hechas' },
  { key: 'signed', label: 'Firmaron' },
];

export const ReferralFunnel = () => {
  const max = EXPERIMENT_GROUP.linkOpens;
  return (
    <Card title="Embudo del grupo con la experiencia" eyebrow="Cuántos llegan a cada paso · simulado">
      <ul className={styles.funnel}>
        {STEPS.map((step, index) => {
          const value = EXPERIMENT_GROUP[step.key];
          const previous = index > 0 ? EXPERIMENT_GROUP[STEPS[index - 1].key] : null;
          const showRate = previous && step.key !== 'cardsShared' && step.key !== 'linkOpens';
          return (
            <li key={step.key}>
              <span className={styles.funnelLabel}>{step.label}</span>
              <span className={styles.funnelBar}>
                <span style={{ width: `${Math.max((value / max) * 100, 1.5)}%` }} />
              </span>
              <strong className="num">{formatInteger(value)}</strong>
              <small className="num">{showRate ? formatPercent((value / previous) * 100) : ''}</small>
            </li>
          );
        })}
      </ul>
      <p className={styles.small}>
        De los vecinos que abren el link, agenda el{' '}
        {formatPercent((EXPERIMENT_GROUP.leads / EXPERIMENT_GROUP.linkOpens) * 100, 1)}. En la web de hoy, de 100
        visitas solo 6 dejan sus datos (6 %). Después de agendar se usan las tasas reales de los referidos: 95 %
        contacto, 85 % agenda, 90 % visita y 45 % cierre.
      </p>
    </Card>
  );
};
