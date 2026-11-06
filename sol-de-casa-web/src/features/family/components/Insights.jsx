import { Link } from 'react-router-dom';
import { AnimatedNumber } from '../../../shared/components/AnimatedNumber.jsx';
import { familyTips, milestones, paybackProgress } from '../../../shared/model/index.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './Insights.module.css';

/** Cuánto de la instalación ya pagó el sol. */
export const PaybackCard = ({ summary }) => {
  const payback = paybackProgress(summary);
  const percent = Math.round(payback.share * 100);
  return (
    <section className={styles.payback} aria-labelledby="payback-title">
      <div className={styles.paybackHead}>
        <h2 id="payback-title">Su instalación se está pagando sola</h2>
        <strong>
          <AnimatedNumber value={percent} startOnView format={(n) => `${Math.round(n)} %`} />
        </strong>
      </div>
      <div
        className={styles.progress}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Parte de la instalación pagada con el ahorro"
      >
        <span style={{ width: `${Math.max(percent, 2)}%` }} />
      </div>
      <p>
        Lleva {formatUsd(payback.recovered)} de {formatUsd(6500)}. Al ritmo de {formatUsd(payback.monthlyAverage)} al
        mes, la termina de pagar en <strong>{payback.finishLabel}</strong>
        {Number.isFinite(payback.monthsLeft) && ` (${formatInteger(payback.monthsLeft)} meses)`}. Después, todo el
        ahorro es suyo.
      </p>
    </section>
  );
};

/** Consejos según su ahorro y lo que ha hecho en la cuenta. */
export const TipsCard = ({ summary, sharesCount, monthsOfPlan }) => {
  const tips = familyTips({ summary, sharesCount, monthsOfPlan });
  return (
    <section className={styles.tips} aria-labelledby="tips-title">
      <h2 id="tips-title">Consejos para usted</h2>
      <ul>
        {tips.map((tip) => (
          <li key={tip.id} data-tone={tip.tone}>
            <strong>{tip.title}</strong>
            <p>{tip.body}</p>
            {tip.action && (
              <Link to={tip.action.to} className={styles.tipAction}>
                {tip.action.label} →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

/** Metas alcanzadas: pequeñas celebraciones del ahorro. */
export const Milestones = ({ summary }) => (
  <section className={styles.milestones} aria-labelledby="metas-title">
    <h2 id="metas-title">Sus metas</h2>
    <ul>
      {milestones(summary).map((item) => (
        <li key={item.id} data-done={item.done}>
          <span aria-hidden="true">{item.done ? '★' : '○'}</span>
          {item.label}
          <span className="visually-hidden">{item.done ? '(alcanzada)' : '(pendiente)'}</span>
        </li>
      ))}
    </ul>
  </section>
);
