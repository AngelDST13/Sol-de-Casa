import { SimTag } from '../../../shared/components/SimTag.jsx';
import { TESTIMONIALS } from '../content.js';
import styles from './Landing.module.css';

export const Testimonials = () => {
  const [featured, ...rest] = TESTIMONIALS;
  return (
    <section id="clientes" className={styles.testimonials} aria-labelledby="clientes-title">
      <div className="container">
        <div className={styles.testimonialsHead} data-reveal>
          <h2 id="clientes-title" className={styles.sectionTitle}>
            Lo que cuentan los vecinos.
          </h2>
          <p className={styles.rating}>
            <strong>4,9</strong>
            <span aria-hidden="true">★★★★★</span> 210 reseñas en Google
          </p>
        </div>
        <div className={styles.quotes}>
          <figure className={styles.quoteFeatured} data-reveal>
            <blockquote>«{featured.quote}»</blockquote>
            <figcaption>
              {featured.name} · {featured.place} <SimTag />
            </figcaption>
          </figure>
          {rest.map((item, index) => (
            <figure key={item.name} className={styles.quote} data-reveal style={{ '--reveal-index': index + 1 }}>
              <blockquote>«{item.quote}»</blockquote>
              <figcaption>
                {item.name} · {item.place} <SimTag />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
