import { Card } from '../../../shared/components/index.js';
import { CHANNELS } from '../content.js';
import styles from './GrowthSheet.module.css';

const ORDER = ['cheap-big', 'expensive-big', 'cheap-small', 'expensive-small'];

/** Matriz de canales a 90 días, con los anuncios en su cuadrante. */
export const ChannelMatrix = () => (
  <Card title="Matriz de canales a 90 días" eyebrow="Pregunta 3 · Qué lugar les queda a los anuncios">
    <div className={styles.matrixWrap}>
      <span className={styles.axisY}>Más volumen ↑</span>
      <div className={styles.matrix}>
        {ORDER.map((quadrant) => {
          const channel = CHANNELS.find((item) => item.quadrant === quadrant);
          return (
            <div key={quadrant} className={styles.quadrant} data-quadrant={quadrant}>
              <strong>{channel.name}</strong>
              <small>
                {channel.cost} · {channel.volume}
              </small>
              <span>{channel.action}</span>
            </div>
          );
        })}
      </div>
      <span className={styles.axisX}>Menos costo por cliente ← → Más costo</span>
    </div>
  </Card>
);
