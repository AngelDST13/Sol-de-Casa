import { Card } from '../../../shared/components/index.js';
import { useCaseParams } from '../../../shared/hooks/CaseParamsContext.jsx';
import {
  DEFAULT_PARAMS,
  REFERRAL_SALE_MAX_COST,
  calculateMonth,
  referralSaleCost,
} from '../../../shared/model/index.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './OwnerPanel.module.css';

/** Pregunta 2: lo que cuesta un cliente referido frente a uno de anuncios. */
export const CostPerSale = () => {
  const { params } = useCaseParams();
  const ads = calculateMonth({ ...DEFAULT_PARAMS, visitCost: params.visitCost });
  const referral = referralSaleCost();
  const channels = [
    { label: 'Meta (anuncios)', value: ads.meta.realCac, tone: 'meta' },
    { label: 'Google (anuncios)', value: ads.google.realCac, tone: 'google' },
    { label: 'Referido (visitas + premios)', value: referral.totalCost, tone: 'sun' },
  ];
  const max = Math.max(...channels.map((channel) => channel.value));

  return (
    <Card title="Lo que cuesta un cliente" eyebrow="Referido frente a anuncios">
      <ul className={styles.costs}>
        {channels.map((channel) => (
          <li key={channel.label}>
            <span>{channel.label}</span>
            <span className={styles.costBar}>
              <span data-tone={channel.tone} style={{ width: `${(channel.value / max) * 100}%` }} />
            </span>
            <strong className="num">{formatUsd(channel.value)}</strong>
          </li>
        ))}
      </ul>
      <p className={styles.small}>
        Venta referida: {formatUsd(referral.visitsCost)} de visitas + {formatUsd(referral.rewardsCost)} de premios ={' '}
        {formatUsd(referral.totalCost)}. Regla de Andrés: máximo {formatUsd(REFERRAL_SALE_MAX_COST)}{' '}
        {referral.withinRule ? '✓' : '✗'}. Cuesta {formatUsd(ads.google.realCac - referral.totalCost)} menos que un
        cliente de Google.
      </p>
    </Card>
  );
};
