import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/Button.jsx';
import { Field } from '../../../shared/components/Field.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { DEMO_PASSWORD } from '../../../services/authService.js';
import styles from './Auth.module.css';

const DEMO_ACCOUNTS = [
  { email: 'familia@soldecasa.cr', label: 'Familia con paneles', detail: 'Ve su ahorro y comparte' },
  { email: 'andres@soldecasa.cr', label: 'Andrés (equipo)', detail: 'Panel, solicitudes y análisis' },
];

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const enter = async (credentials) => {
    setBusy(true);
    setErrors({});
    try {
      const user = await login(credentials);
      const fallback = user.role === 'team' ? '/panel' : '/mi-cuenta';
      const from = location.state?.from;
      const allowed = from && from.startsWith(user.role === 'team' ? '/panel' : '/mi-cuenta');
      navigate(allowed ? from : fallback, { replace: true });
    } catch (error) {
      setErrors({ [error.field ?? 'email']: error.message });
      setBusy(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (!form.email.includes('@')) next.email = 'Escriba su correo.';
    if (!form.password) next.password = 'Escriba su contraseña.';
    setErrors(next);
    if (Object.keys(next).length === 0) enter(form);
  };

  return (
    <>
      <p className={styles.eyebrow}>Iniciar sesión</p>
      <h1 className={styles.title}>Qué bueno verle de vuelta.</h1>
      <p className={styles.lead}>Vea cuánto ahorró este mes o entre al panel del equipo.</p>

      <form className={styles.form} onSubmit={submit} noValidate>
        <Field
          label="Correo"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          error={errors.email}
        />
        <Field
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          error={errors.password}
        />
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <div className={styles.demo}>
        <p>
          <strong>Cuentas de demostración</strong> · contraseña <code>{DEMO_PASSWORD}</code>
        </p>
        <div className={styles.demoButtons}>
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.email}
              type="button"
              disabled={busy}
              onClick={() => enter({ email: account.email, password: DEMO_PASSWORD })}
            >
              <strong>{account.label}</strong>
              <span>{account.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <p className={styles.switch}>
        ¿Tiene paneles y aún no tiene cuenta? <Link to="/registro">Créela aquí</Link>
      </p>
      <p className={styles.switch}>
        ¿Todavía no tiene paneles? <Link to="/agendar">Calcule su ahorro</Link>
      </p>
    </>
  );
};
