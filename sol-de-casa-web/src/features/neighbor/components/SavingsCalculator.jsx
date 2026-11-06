import { useId } from 'react';
import { Card } from '../../../shared/components/index.js';
import { SAVINGS } from '../../../shared/model/index.js';
import { formatCount, formatUsd } from '../../../shared/utils/format.js';
import styles from './Neighbor.module.css';

const QUICK_BILLS = [60, 110, 150, 200];

export const SavingsCalculator = ({ flow }) => {
  const id = useId();
  const { bill, setBill, result, step, setStep } = flow;

  return (
    <Card className={styles.calculator}>
      <label htmlFor={id} className={styles.question}>
        ¿Cuánto paga de luz al mes?
      </label>
      <div className={styles.billInput}>
        <span aria-hidden="true">$</span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={2000}
          value={bill}
          onChange={(event) => setBill(Math.max(0, Number(event.target.value) || 0))}
        />
      </div>
      <div className={styles.chips}>
        {QUICK_BILLS.map((value) => (
          <button key={value} type="button" aria-pressed={bill === value} onClick={() => setBill(value)}>
            {formatUsd(value)}
          </button>
        ))}
      </div>

      <div className={styles.results}>
        <div className={styles.mainResult}>
          <span>Se ahorraría al mes</span>
          <strong className="num">{formatUsd(result.monthly)}</strong>
          <small>Su recibo pasaría a unos {formatUsd(result.newBill)}</small>
        </div>
        <div>
          <span>Al año</span>
          <strong className="num">{formatUsd(result.yearly)}</strong>
        </div>
        <div>
          <span>Recupera la instalación en</span>
          <strong className="num">
            {Number.isFinite(result.paybackYears) ? `${formatCount(result.paybackYears)} años` : '—'}
          </strong>
        </div>
        <div>
          <span>Le queda en {SAVINGS.panelLifeYears} años</span>
          <strong className="num">{formatUsd(result.lifetime)}</strong>
        </div>
      </div>
      <p className={styles.small}>
        Con el ahorro promedio de nuestros clientes ({SAVINGS.savingsRate} %) y una instalación promedio de{' '}
        {formatUsd(SAVINGS.installPrice)}. El técnico le da el número exacto al medir su techo.
      </p>

      {step === 'calculate' && (
        <button type="button" className={styles.cta} onClick={() => setStep('form')} disabled={bill <= 0}>
          Quiero que midan mi techo gratis
        </button>
      )}
    </Card>
  );
};
