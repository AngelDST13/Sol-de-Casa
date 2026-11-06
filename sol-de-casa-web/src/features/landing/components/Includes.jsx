import { Button } from '../../../shared/components/Button.jsx';
import { INCLUDES } from '../content.js';
import styles from './Landing.module.css';

export const Includes = () => (
  <section className={styles.includes} aria-labelledby="incluye-title">
    <div className={`container ${styles.includesGrid}`}>
      <div>
        <h2 id="incluye-title" className={styles.sectionTitle} data-reveal>
          Usted pone el techo. Nosotros, todo lo demás.
        </h2>
        <ul className={styles.includeList}>
          {INCLUDES.map((item, index) => (
            <li key={item.title} data-reveal style={{ '--reveal-index': index }}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <aside className={`${styles.priceCard} panel-grid`} data-reveal>
        <p className={styles.priceLabel}>Instalación promedio</p>
        <p className={styles.price}>$6.500</p>
        <dl className={styles.priceFacts}>
          <div>
            <dt>Al firmar</dt>
            <dd>50 %</dd>
          </div>
          <div>
            <dt>Al terminar la instalación</dt>
            <dd>50 %</dd>
          </div>
          <div>
            <dt>Se recupera, con un recibo de $110</dt>
            <dd>≈ 7 años</dd>
          </div>
        </dl>
        <p className={styles.priceNote}>El técnico le da el precio exacto después de medir su techo.</p>
        <Button to="/agendar" block size="lg">
          Agendar la visita gratis
        </Button>
      </aside>
    </div>
  </section>
);
