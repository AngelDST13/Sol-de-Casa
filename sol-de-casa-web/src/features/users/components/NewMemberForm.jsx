import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { Field } from '../../../shared/components/Field.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { DEMO_PASSWORD, POSITIONS, createTeamMember } from '../../../services/authService.js';
import admin from '../../../shared/components/admin.module.css';
import styles from './Users.module.css';

const EMPTY = { name: '', email: '', position: 'asesora' };

export const NewMemberForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().split(/\s+/).length < 2) next.name = 'Nombre y apellido.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Correo válido.';
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      const member = await createTeamMember(form, user.name);
      setCreated(member);
      setForm(EMPTY);
    } catch (error) {
      setErrors({ [error.field ?? 'email']: error.message });
    }
  };

  return (
    <details className={styles.newMember}>
      <summary>+ Agregar a alguien del equipo</summary>
      <form onSubmit={submit} noValidate className={styles.newForm}>
        <div className={admin.formRow}>
          <Field label="Nombre y apellido" value={form.name} onChange={set('name')} error={errors.name} />
          <Field label="Correo" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        </div>
        <Field
          as="select"
          label="Puesto"
          value={form.position}
          onChange={set('position')}
          hint={POSITIONS[form.position].hint}
        >
          {Object.entries(POSITIONS).map(([id, position]) => (
            <option key={id} value={id}>
              {position.label}
            </option>
          ))}
        </Field>
        <Button type="submit" variant="dark">
          Crear la cuenta
        </Button>
        {created && (
          <p className={styles.created} role="status">
            ✓ Cuenta creada para {created.name}. Entra con {created.email} y la contraseña de demo{' '}
            <code>{DEMO_PASSWORD}</code>.
          </p>
        )}
      </form>
    </details>
  );
};
