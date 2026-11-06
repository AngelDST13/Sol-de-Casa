import { Card } from '../../../shared/components/index.js';
import { AI_ERRORS, ASSUMPTIONS } from '../content.js';
import styles from './GrowthSheet.module.css';

export const AiErrorsCard = () => (
  <div className={styles.grid}>
    <Card title="En qué se equivocó o nos confundió la IA" eyebrow="Sección obligatoria">
      {AI_ERRORS.map((error) => (
        <article key={error.said} className={styles.error}>
          <p>
            <strong>Qué dijo:</strong> {error.said}
          </p>
          <p>
            <strong>Por qué estaba mal:</strong> {error.why}
          </p>
          <p>
            <strong>Cómo se corrigió:</strong> {error.fix}
          </p>
        </article>
      ))}
      <p className={styles.small}>Agreguen aquí los errores que encuentren ustedes al usar la IA durante el reto.</p>
    </Card>
    <Card title="Supuestos" eyebrow="Cada supuesto va escrito">
      <ul className={styles.assumptions}>
        {ASSUMPTIONS.map((item) => (
          <li key={item.text}>
            <span>{item.text}</span>
            <small data-kind={item.source}>{item.source}</small>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);
