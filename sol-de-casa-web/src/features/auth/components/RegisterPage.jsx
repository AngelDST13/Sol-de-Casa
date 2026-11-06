import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/Button.jsx';
import { Field } from '../../../shared/components/Field.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useSettings } from '../../../shared/hooks/useStores.js';
import styles from './Auth.module.css';

const INITIAL = {
  name: '',
  email: '',
  password: '',
  neighborhood: '',
  billBefore: 110,
  monthsInstalled: 12,
  teamCode: '',
  consent: false,
};

const validate = (role, form) => {
  const errors = {};
  if (form.name.trim().split(/\s+/).length < 2) errors.name = 'Escriba su nombre y apellido.';
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Escriba un correo válido.';
  if (form.password.length < 8) errors.password = 'Use al menos 8 caracteres.';
  if (role === 'client') {
    if (!form.neighborhood.trim()) errors.neighborhood = 'Escriba su barrio: así lo reconocen sus vecinos.';
    if (!(Number(form.billBefore) > 0)) errors.billBefore = 'Escriba cuánto pagaba de luz antes de los paneles.';
  }
  if (role === 'team' && !form.teamCode.trim()) errors.teamCode = 'Pida el código a Andrés.';
  if (!form.consent) errors.consent = 'Necesitamos su permiso para crear la cuenta.';
  return errors;
};

export const RegisterPage = () => {
  const { register } = useAuth();
  const settings = useSettings();
  const navigate = useNavigate();
  const [role, setRole] = useState('client');
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const set = (key) => (event) =>
    setForm({ ...form, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    const next = validate(role, form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const user = await register({ ...form, role });
      navigate(user.role === 'team' ? '/panel' : '/mi-cuenta', { replace: true });
    } catch (error) {
      setErrors({ [error.field ?? 'email']: error.message });
      setBusy(false);
    }
  };

  return (
    <>
      <p className={styles.eyebrow}>Crear cuenta</p>
      <h1 className={styles.title}>{role === 'client' ? 'Vea su ahorro cada mes.' : 'Entre al panel del equipo.'}</h1>

      <div className={styles.roles} role="radiogroup" aria-label="Tipo de cuenta">
        {[
          ['client', 'Tengo paneles', 'Cliente de Sol de Casa'],
          ['team', 'Trabajo en Sol de Casa', 'Asesoras, técnicos y Andrés'],
        ].map(([id, label, detail]) => (
          <button key={id} type="button" role="radio" aria-checked={role === id} onClick={() => setRole(id)}>
            <strong>{label}</strong>
            <span>{detail}</span>
          </button>
        ))}
      </div>

      <form className={styles.form} onSubmit={submit} noValidate>
        <Field
          label="Nombre y apellido"
          autoComplete="name"
          value={form.name}
          onChange={set('name')}
          error={errors.name}
        />
        <Field
          label="Correo"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={set('email')}
          error={errors.email}
        />
        <Field
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          hint="Al menos 8 caracteres."
        />

        {role === 'client' ? (
          <>
            <Field
              label="Barrio"
              autoComplete="address-level3"
              value={form.neighborhood}
              onChange={set('neighborhood')}
              error={errors.neighborhood}
            />
            <div className={styles.row}>
              <Field
                label="Recibo antes de los paneles"
                type="number"
                inputMode="numeric"
                min={1}
                value={form.billBefore}
                onChange={set('billBefore')}
                error={errors.billBefore}
                hint="En dólares al mes"
              />
              <Field
                as="select"
                label="Hace cuánto instaló"
                value={form.monthsInstalled}
                onChange={set('monthsInstalled')}
              >
                {[2, 3, 6, 9, 12, 18, 24, 36].map((months) => (
                  <option key={months} value={months}>
                    {months} meses
                  </option>
                ))}
              </Field>
            </div>
          </>
        ) : (
          <Field
            label="Código de equipo"
            value={form.teamCode}
            onChange={set('teamCode')}
            error={errors.teamCode}
            hint={`Para la demostración: ${settings.teamInviteCode}`}
          />
        )}

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={set('consent')}
            aria-invalid={Boolean(errors.consent)}
          />
          <span>
            Acepto que Sol de Casa use mis datos para mostrarme mi ahorro y contactarme sobre mi instalación.
            {errors.consent && <small role="alert">{errors.consent}</small>}
          </span>
        </label>

        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? 'Creando la cuenta…' : 'Crear mi cuenta'}
        </Button>
      </form>
      <p className={styles.note}>
        Prototipo: la cuenta se guarda solo en este navegador y el ahorro que verá es simulado con el 70 % de su recibo.
      </p>
      <p className={styles.switch}>
        ¿Ya tiene cuenta? <Link to="/iniciar-sesion">Inicie sesión</Link>
      </p>
    </>
  );
};
