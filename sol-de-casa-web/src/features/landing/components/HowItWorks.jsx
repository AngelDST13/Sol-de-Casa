import { STEPS } from '../content.js';
import styles from './Landing.module.css';

export const HowItWorks = () => (
  <section id="como-funciona" className={styles.how} aria-labelledby="como-title">
    <div className={`container ${styles.howGrid}`}>
      <div className={styles.howHead} data-reveal>
        <h2 id="como-title" className={styles.sectionTitle}>
          De su recibo a su techo en cinco pasos.
        </h2>
      </div>
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step.title} className={styles.step} data-reveal style={{ '--reveal-index': index }}>
            <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <span className={styles.stepTag}>{step.tag}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
