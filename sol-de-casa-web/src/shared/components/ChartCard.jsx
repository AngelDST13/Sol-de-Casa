import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Card } from './Card.jsx';
import styles from './ChartCard.module.css';

ChartJS.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
);
ChartJS.defaults.font.family = "'Archivo', system-ui, sans-serif";

/** Tarjeta con un gráfico de Chart.js; `caption` cuenta en una frase lo que muestra. */
export const ChartCard = ({ title, eyebrow, caption, type, data, options, plugins, height = 280 }) => (
  <Card title={title} eyebrow={eyebrow}>
    {caption && <p className={styles.caption}>{caption}</p>}
    <div className={styles.box} style={{ height }}>
      <Chart type={type} data={data} options={options} plugins={plugins} aria-label={title} role="img" />
    </div>
  </Card>
);
