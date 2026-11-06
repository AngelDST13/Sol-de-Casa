import { Card } from '../../../shared/components/index.js';
import { RETENTION } from '../content.js';
import styles from './GrowthSheet.module.css';

/** Pregunta 1: qué es retener y el número de cada semana. */
export const RetentionCard = () => (
  <Card title="¿Qué es «retener» si nadie recompra?" eyebrow="Pregunta 1">
    <p>{RETENTION.meaning}</p>
    <p className={styles.highlight}>Número de cada semana: {RETENTION.weeklyNumber.toLowerCase()}.</p>
    <p className={styles.small}>{RETENTION.why}</p>
  </Card>
);
