import { Button } from '../../../shared/components/Button.jsx';
import styles from './Landing.module.css';

export const FinalCta = () => (
  <section className={styles.final} aria-labelledby="final-title">
    <div className={`container ${styles.finalInner}`} data-reveal>
      <h2 id="final-title">Mida su techo esta semana.</h2>
      <p>La visita técnica es gratis y lo llamamos en menos de 5 minutos.</p>
      <Button to="/agendar" variant="dark" size="lg">
        Medir mi techo gratis
      </Button>
    </div>
  </section>
);
