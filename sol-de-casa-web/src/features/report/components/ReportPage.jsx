import { Card, PageHeader } from '../../../shared/components/index.js';
import { AI_ERRORS, ASSUMPTIONS, CHANGES, DECISION, FINDINGS, GROWTH, PITCH, PLAN, RISKS } from '../content.js';
import styles from './Report.module.css';

export const ReportPage = () => (
  <>
    <PageHeader level="Recomendación para Andrés" title="Más leads no siempre es mejor">
      Una página para decidir qué hacer con la propuesta de la agencia, con los números que la sostienen.
    </PageHeader>

    <div className={styles.decision}>
      <p className={styles.eyebrow}>Decisión</p>
      <p className={styles.decisionText}>{DECISION}</p>
    </div>

    <div className={styles.grid}>
      {FINDINGS.map((finding) => (
        <Card key={finding.title} title={finding.title}>
          <p className={styles.body}>{finding.body}</p>
        </Card>
      ))}
      {CHANGES.map((change) => (
        <Card key={change.title} title={change.title} eyebrow="Nuestros cambios">
          <p className={styles.body}>{change.body}</p>
        </Card>
      ))}
    </div>

    <Card title="Plan propuesto a 24 meses" eyebrow="Nivel 3" className={styles.block}>
      <p className={styles.body}>{PLAN}</p>
    </Card>

    <div className={styles.grid}>
      <Card title="Riesgos" eyebrow="Lo que puede salir mal">
        <ol className={styles.list}>
          {RISKS.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ol>
      </Card>
      <Card title="Para crecer más" eyebrow="Qué tendría que pasar">
        <p className={styles.body}>{GROWTH}</p>
      </Card>
    </div>

    <section className={styles.pitch} aria-labelledby="pitch-title">
      <p className={styles.eyebrow}>Pitch de 2 minutos · persona del banco</p>
      <h2 id="pitch-title" className={styles.pitchTitle}>
        «El problema no es la demanda, es la caja.»
      </h2>
      {PITCH.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className={styles.pitchText}>
          {paragraph}
        </p>
      ))}
    </section>

    <Card title="En qué se equivocó o nos confundió la IA" eyebrow="Sección obligatoria" className={styles.block}>
      <div className={styles.errors}>
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
      </div>
    </Card>

    <Card title="Supuestos usados" eyebrow="Cada supuesto va escrito" className={styles.block}>
      <ul className={styles.assumptions}>
        {ASSUMPTIONS.map((assumption) => (
          <li key={assumption.text}>
            <span>{assumption.text}</span>
            <span className={styles.source} data-own={assumption.source === 'Supuesto propio'}>
              {assumption.source}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  </>
);
