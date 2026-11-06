import { Link } from 'react-router-dom';
import { EmptyState } from '../../../shared/components/EmptyState.jsx';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { formatInteger } from '../../../shared/utils/format.js';
import { timeAgo } from '../../../shared/utils/time.js';
import { useMyFamily } from '../hooks/useMyFamily.js';
import { useFamilyReferrals } from '../hooks/useFamilyReferrals.js';
import styles from './Family.module.css';

const STEPS = ['Compartió', 'Pidió visita', 'Agendó', 'Firmó'];

/** El juego: lo que gana la familia por cada vecino, con una barra de avance por vecino. */
export const NeighborsPage = () => {
  const { family } = useMyFamily();
  const game = useFamilyReferrals(family);

  return (
    <div className={styles.page}>
      <header className={styles.greeting}>
        <p>Mis vecinos y premios</p>
        <h1>Cada vecino que agenda, usted gana.</h1>
      </header>

      <div className={styles.earned}>
        <div>
          <span>Meses de mantenimiento gratis</span>
          <strong className="num">{formatInteger(game.monthsOfPlan)}</strong>
        </div>
        <div>
          <span>Limpiezas de paneles gratis</span>
          <strong className="num">{formatInteger(game.cleanings)}</strong>
        </div>
        <div>
          <span>Veces que compartió</span>
          <strong className="num">{formatInteger(game.sharesCount)}</strong>
        </div>
      </div>

      <section className={styles.panel}>
        <h2>Sus vecinos</h2>
        {game.neighbors.length === 0 ? (
          <EmptyState
            title="Todavía no hay vecinos"
            action={<Link to="/mi-cuenta/compartir">Compartir mi ahorro →</Link>}
          >
            Cuando alguien agenda desde su link, aparece aquí y puede seguir en qué paso va.
          </EmptyState>
        ) : (
          <ul className={styles.neighbors}>
            {game.neighbors.map((neighbor) => (
              <li key={neighbor.id}>
                <div className={styles.neighborHead}>
                  <strong>{neighbor.name}</strong>
                  {neighbor.simulated && <SimTag />}
                  <small>{timeAgo(neighbor.createdAt)}</small>
                </div>
                {neighbor.stage === -1 ? (
                  <p className={styles.lost}>No siguió adelante esta vez.</p>
                ) : (
                  <div
                    className={styles.track}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={3}
                    aria-valuenow={neighbor.stage}
                    aria-label={`Avance de ${neighbor.name}`}
                  >
                    {STEPS.map((label, index) => (
                      <span key={label} className={styles.trackStep} data-done={index <= neighbor.stage}>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.panel}>
        <h2>Cómo se gana</h2>
        <div className={styles.rules}>
          <div>
            <strong>Cuando un vecino agenda la visita</strong>
            <span>1 mes gratis del plan de mantenimiento ($12)</span>
          </div>
          <div>
            <strong>Cuando un vecino firma</strong>
            <span>Limpieza de paneles gratis + 2 meses más de mantenimiento</span>
          </div>
          <div>
            <strong>Su vecino recibe</strong>
            <span>$40 de descuento en su instalación</span>
          </div>
        </div>
        <p className={styles.note}>
          Los premios están calculados para que una venta por referido le cueste a Sol de Casa menos de $300, contando
          las visitas técnicas.
        </p>
      </section>
    </div>
  );
};
