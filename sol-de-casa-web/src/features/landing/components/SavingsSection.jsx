import { useId, useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { SAVINGS, savingsCalculator } from '../../../shared/model/index.js';
import { formatCount, formatUsd } from '../../../shared/utils/format.js';
import styles from './Landing.module.css';

const MIN = 40;
const MAX = 400;

/** La calculadora con el recibo de la persona: lo primero que hay que poder hacer sin dar datos. */
export const SavingsSection = () => {
  const id = useId();
  const [bill, setBill] = useState(SAVINGS.averageBill);
  const result = savingsCalculator(bill);
  const fill = ((bill - MIN) / (MAX - MIN)) * 100;

  return (
    <section id="ahorro" className={styles.savings} aria-labelledby="ahorro-title">
      <div className={`container ${styles.savingsGrid}`}>
        <div className={styles.savingsCopy} data-reveal>
          <h2 id="ahorro-title" className={styles.sectionTitle}>
            Haga la cuenta con su propio recibo.
          </h2>
          <p className={styles.sectionLead}>
            Mueva la barra hasta lo que paga de luz al mes. Usamos el ahorro promedio de nuestros clientes (70 %) y una
            instalación promedio de {formatUsd(SAVINGS.installPrice)}. El número exacto se lo da el técnico al medir su
            techo.
          </p>
        </div>

        <div className={styles.calc} data-reveal style={{ '--reveal-index': 1 }}>
          <label htmlFor={id} className={styles.calcLabel}>
            Pago de luz al mes
            <output htmlFor={id} className={styles.calcBill}>
              {formatUsd(bill)}
            </output>
          </label>
          <input
            id={id}
            type="range"
            min={MIN}
            max={MAX}
            step={5}
            value={bill}
            onChange={(event) => setBill(Number(event.target.value))}
            className={styles.calcRange}
            style={{ '--fill': `${fill}%` }}
          />
          <div className={styles.calcScale} aria-hidden="true">
            <span>{formatUsd(MIN)}</span>
            <span>{formatUsd(MAX)}</span>
          </div>

          <div className={styles.calcResults}>
            <div className={styles.calcMain}>
              <span>Ahorraría al mes</span>
              <strong className="num">{formatUsd(result.monthly)}</strong>
              <small>Su recibo bajaría a unos {formatUsd(result.newBill)}</small>
            </div>
            <div>
              <span>Al año</span>
              <strong className="num">{formatUsd(result.yearly)}</strong>
            </div>
            <div>
              <span>Recupera la instalación</span>
              <strong className="num">{formatCount(result.paybackYears)} años</strong>
            </div>
            <div>
              <span>Le queda en {SAVINGS.panelLifeYears} años</span>
              <strong className="num">{formatUsd(result.lifetime)}</strong>
            </div>
          </div>
          <Button to={`/agendar?recibo=${bill}`} variant="dark" size="lg" block>
            Quiero la visita técnica gratis
          </Button>
        </div>
      </div>
    </section>
  );
};
