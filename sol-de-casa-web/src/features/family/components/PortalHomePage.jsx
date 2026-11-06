import { Link } from 'react-router-dom';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { formatInteger } from '../../../shared/utils/format.js';
import { useMyFamily } from '../hooks/useMyFamily.js';
import { useFamilyReferrals } from '../hooks/useFamilyReferrals.js';
import { SavingsHero } from './SavingsHero.jsx';
import { Milestones, PaybackCard, TipsCard } from './Insights.jsx';
import styles from './Family.module.css';

export const PortalHomePage = () => {
  const { user, family, history, summary } = useMyFamily();
  const game = useFamilyReferrals(family);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className={styles.page}>
      <header className={styles.greeting}>
        <p>
          {family.name} · {family.neighborhood} <SimTag />
        </p>
        <h1>
          {greeting}, {user.name.split(' ')[0]}.
        </h1>
      </header>
      <SavingsHero family={family} history={history} summary={summary} />
      <PaybackCard summary={summary} />
      <div className={styles.quick}>
        <Link to="/mi-cuenta/compartir" className={styles.quickCard} data-tone="sun">
          <span>Comparta su ahorro</span>
          <strong>Su vecino gana $40</strong>
          <small>Una tarjeta lista para WhatsApp →</small>
        </Link>
        <Link to="/mi-cuenta/vecinos" className={styles.quickCard}>
          <span>Sus premios</span>
          <strong>
            {formatInteger(game.monthsOfPlan)} {game.monthsOfPlan === 1 ? 'mes' : 'meses'} de mantenimiento
          </strong>
          <small>
            {formatInteger(game.neighbors.length)} vecinos referidos · {formatInteger(game.signed)} firmaron →
          </small>
        </Link>
      </div>
      <TipsCard summary={summary} sharesCount={game.sharesCount} monthsOfPlan={game.monthsOfPlan} />
      <Milestones summary={summary} />
    </div>
  );
};
