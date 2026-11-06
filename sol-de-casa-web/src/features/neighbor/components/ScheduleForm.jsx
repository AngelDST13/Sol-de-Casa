import { Card } from '../../../shared/components/index.js';
import styles from './Neighbor.module.css';

/** Solo dos datos: lo demás (recibo, quién lo refirió) ya lo tenemos. */
export const ScheduleForm = ({ flow }) => {
  const { form, updateField, errors, submit } = flow;
  return (
    <Card title="¿A quién llamamos para agendar?" eyebrow="Visita técnica gratis">
      <form className={styles.form} onSubmit={submit} noValidate>
        <label>
          <span>Nombre</span>
          <input
            autoComplete="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <small id="name-error" className={styles.error}>
              {errors.name}
            </small>
          )}
        </label>
        <label>
          <span>Teléfono (WhatsApp)</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="8888 8888"
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <small id="phone-error" className={styles.error}>
              {errors.phone}
            </small>
          )}
        </label>
        <button type="submit" className={styles.cta}>
          Agendar mi visita
        </button>
        <p className={styles.small}>Lo llamamos en menos de 5 minutos, de lunes a viernes en horario de oficina.</p>
      </form>
    </Card>
  );
};
