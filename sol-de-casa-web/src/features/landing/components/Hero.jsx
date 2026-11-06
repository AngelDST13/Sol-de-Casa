import { Button } from '../../../shared/components/Button.jsx';
import technician from '../../../assets/images/tecnico-panel.webp';
import styles from './Landing.module.css';

export const Hero = () => (
  <section className={`${styles.hero} panel-grid`} aria-labelledby="hero-title">
    <div className={`container ${styles.heroGrid}`}>
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>
          <span className={styles.kickerDot} aria-hidden="true" /> Paneles solares para casas · 420 techos instalados
        </p>
        <h1 id="hero-title" className={styles.heroTitle}>
          <span>Su techo</span>
          <span>puede pagar</span>
          <em>el recibo de luz.</em>
        </h1>
        <p className={styles.heroLead}>
          Nuestros clientes ahorran en promedio el 70 % de su recibo. Medimos su techo gratis, armamos la propuesta con
          su recibo real y nos encargamos de todo.
        </p>
        <div className={styles.heroActions}>
          <Button to="/agendar" size="lg">
            Medir mi techo gratis
          </Button>
          <Button to="/#ahorro" variant="light" size="lg">
            Calcular mi ahorro
          </Button>
        </div>
        <p className={styles.heroTrust}>
          <strong>4,9 ★</strong> en Google con 210 reseñas · Lo llamamos en menos de 5 minutos
        </p>
      </div>

      <div className={styles.heroVisual} aria-hidden="true">
        <span className={styles.sun} />
        <img src={technician} alt="" className={styles.heroPhoto} width="900" height="868" fetchpriority="high" />
        <div className={styles.bill}>
          <span className={styles.billLabel}>Recibo de luz · promedio</span>
          <div className={styles.billRow}>
            <span>Antes</span>
            <s>$110</s>
          </div>
          <div className={styles.billRow}>
            <span>Con paneles</span>
            <strong>$33</strong>
          </div>
          <span className={styles.billSave}>−70 % cada mes</span>
        </div>
      </div>
    </div>
  </section>
);
