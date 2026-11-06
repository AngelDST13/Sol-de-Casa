import { Card } from '../../../shared/components/index.js';
import { META_RATES } from '../../../shared/model/index.js';
import { formatCount } from '../../../shared/utils/format.js';
import styles from './Scenarios.module.css';

const STEPS = [
  { key: 'contact', label: 'Contactados' },
  { key: 'schedule', label: 'Agendan' },
  { key: 'visit', label: 'Visitas hechas' },
  { key: 'close', label: 'Ventas' },
];

const per100 = (rates) => {
  let current = 100;
  return STEPS.map((step) => {
    const next = (current * rates[step.key]) / 100;
    const row = { ...step, value: next, lost: current - next };
    current = next;
    return row;
  });
};

/** Pregunta 2: el embudo por cada 100 leads y dónde se cae más gente. */
export const FunnelDropCard = ({ params }) => {
  const metaRates = params.metaFilter ? META_RATES : params.metaRates;
  const meta = per100(metaRates);
  const google = per100(params.googleRates);
  const worst = (rows) => rows.reduce((max, row) => (row.lost > max.lost ? row : max));
  const metaSales = meta[meta.length - 1].value;
  const googleSales = google[google.length - 1].value;

  return (
    <Card title="De cada 100 leads, ¿cuántos firman?" eyebrow="Pregunta 2">
      <div className={styles.dropRow} style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--muted)' }}>
        <span>PASO</span>
        <span className="meta-text">META</span>
        <span className="google-text">GOOGLE</span>
      </div>
      {meta.map((row, index) => (
        <div className={styles.dropRow} key={row.key}>
          <span>{row.label}</span>
          <span className={styles.barWrap}>
            <span className={styles.bar} style={{ width: `${row.value * 0.8}%`, background: 'var(--meta)' }} />
            <span className="num">{formatCount(row.value)}</span>
          </span>
          <span className={styles.barWrap}>
            <span
              className={styles.bar}
              style={{ width: `${google[index].value * 0.8}%`, background: 'var(--google)' }}
            />
            <span className="num">{formatCount(google[index].value)}</span>
          </span>
        </div>
      ))}
      <p className={styles.note}>
        En Meta se cae más gente en el paso «{worst(meta).label}» ({formatCount(worst(meta).lost)} de cada 100 leads no
        contestan). En Google, en «{worst(google).label}». Por cada 100 leads, Google cierra{' '}
        {formatCount(googleSales / metaSales)} veces más ventas que Meta.
      </p>
    </Card>
  );
};
