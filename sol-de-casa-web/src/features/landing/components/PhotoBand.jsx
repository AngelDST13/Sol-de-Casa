import roofs from '../../../assets/images/techos-paneles.webp';
import roofsSmall from '../../../assets/images/techos-paneles-sm.webp';
import styles from './Landing.module.css';

export const PhotoBand = () => (
  <section className={styles.band} aria-label="Casas con paneles solares">
    <img
      src={roofs}
      srcSet={`${roofsSmall} 700w, ${roofs} 1400w`}
      sizes="100vw"
      alt="Techos de varias casas con paneles solares bajo un cielo azul"
      loading="lazy"
      className={styles.bandPhoto}
    />
    <div className={`container ${styles.bandCopy}`}>
      <p data-reveal>
        Una familia compra paneles una vez cada 15 o 20 años. <span>Por eso los instalamos bien la primera vez.</span>
      </p>
    </div>
  </section>
);
