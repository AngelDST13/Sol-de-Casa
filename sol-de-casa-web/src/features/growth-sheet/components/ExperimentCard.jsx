import { Card } from '../../../shared/components/index.js';
import styles from './GrowthSheet.module.css';

/** Pregunta 5: el experimento con 50 clientes. */
export const ExperimentCard = () => (
  <Card title="El experimento con 50 clientes" eyebrow="Pregunta 5 · Prueba A/B">
    <blockquote className={styles.quote}>
      «Si 25 familias reciben cada mes su ahorro y su tarjeta para compartir, entonces las familias que traen al menos
      un vecino que agenda pasan de 1,3 % a 20 % en 60 días, y vigilamos que el cierre de los referidos no baje del 45 %
      y que la venta referida no cueste más de $300.»
    </blockquote>
    <ul className={styles.list}>
      <li>
        <strong>Qué cambia:</strong> 25 familias reciben la experiencia; las otras 25 siguen como hoy (no reciben nada).
      </li>
      <li>
        <strong>Métrica:</strong> % de familias con al menos un vecino que agenda. Hoy: 8 % al año, unos 1,3 % en 60
        días.
      </li>
      <li>
        <strong>Contramétricas:</strong> cierre de los referidos (45 %) y costo por venta referida (menos de $300).
      </li>
      <li>
        <strong>Si sale mal:</strong> si comparten pero nadie agenda, el problema está en la página del vecino; si nadie
        comparte, en la tarjeta o en el premio.
      </li>
    </ul>
  </Card>
);
