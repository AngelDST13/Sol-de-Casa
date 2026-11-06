import { AnimatedNumber } from '../../../shared/components/AnimatedNumber.jsx';
import { PROOF } from '../content.js';
import styles from './Landing.module.css';

export const ProofStrip = () => (
  <section className={styles.proof} aria-label="Sol de Casa en números">
    <div className={`container ${styles.proofGrid}`}>
      {PROOF.map((item, index) => (
        <div key={item.label} className={styles.proofItem} data-reveal style={{ '--reveal-index': index }}>
          <strong>
            <AnimatedNumber
              value={item.to}
              startOnView
              duration={1200}
              format={(n) => `${n.toFixed(item.decimals).replace('.', ',')}${item.suffix}`}
            />
          </strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);
