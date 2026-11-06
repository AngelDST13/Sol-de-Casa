import { Button } from '../../../shared/components/Button.jsx';
import styles from './Landing.module.css';

export const ReferralCallout = () => (
  <section className={`${styles.referral} panel-grid`} aria-labelledby="referidos-title">
    <div className={`container ${styles.referralGrid}`}>
      <div data-reveal>
        <p className={styles.eyebrowLight}>¿Ya tiene paneles con nosotros?</p>
        <h2 id="referidos-title" className={styles.sectionTitleLight}>
          Comparta su ahorro. Su vecino gana $40 y usted, mantenimiento gratis.
        </h2>
        <div className={styles.heroActions}>
          <Button to="/iniciar-sesion" size="lg">
            Ver mi ahorro
          </Button>
          <Button to="/registro" variant="light" size="lg">
            Crear mi cuenta
          </Button>
        </div>
      </div>
      <ol className={styles.referralSteps}>
        {[
          ['Vea su ahorro', 'Cada mes, cuánto ahorró en plata y cuánto lleva desde que instaló.'],
          ['Compártalo', 'Una tarjeta lista para WhatsApp con su link personal.'],
          ['Su vecino agenda', 'Usted gana un mes de mantenimiento gratis.'],
          ['Su vecino firma', 'Usted gana una limpieza y dos meses más; su vecino, $40 de descuento.'],
        ].map(([title, body], index) => (
          <li key={title} data-reveal style={{ '--reveal-index': index }}>
            <strong>{title}</strong>
            <span>{body}</span>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
