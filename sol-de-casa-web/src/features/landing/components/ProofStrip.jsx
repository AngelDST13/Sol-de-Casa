import { PROOF } from '../content.js';
import styles from './Landing.module.css';

export const ProofStrip = () => (
  <section className={styles.proof} aria-label="Sol de Casa en números">
    <div className={`container ${styles.proofGrid}`}>
      {PROOF.map((item, index) => (
        <div key={item.label} className={styles.proofItem} data-reveal style={{ '--reveal-index': index }}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);
