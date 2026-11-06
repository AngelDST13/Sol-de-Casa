import { FAQ } from '../content.js';
import styles from './Landing.module.css';

export const Faq = () => (
  <section id="preguntas" className={styles.faq} aria-labelledby="preguntas-title">
    <div className={`container ${styles.faqGrid}`}>
      <div data-reveal>
        <h2 id="preguntas-title" className={styles.sectionTitle}>
          Lo que todos preguntan antes de la visita.
        </h2>
      </div>
      <div className={styles.faqList}>
        {FAQ.map((item) => (
          <details key={item.q} className={styles.faqItem}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
