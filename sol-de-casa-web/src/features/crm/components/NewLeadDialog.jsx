import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { Dialog } from '../../../shared/components/Dialog.jsx';
import { Field } from '../../../shared/components/Field.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { LEAD_SOURCES, addLead, assignLead } from '../../../services/leadsService.js';
import admin from '../../../shared/components/admin.module.css';

const EMPTY = { name: '', phone: '', neighborhood: '', monthlyBill: 110, source: 'telefono' };

/** Alta manual: alguien llamó o escribió y la asesora lo registra. */
export const NewLeadDialog = ({ open, onClose, onCreated }) => {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Escriba el nombre.';
    if (!/^[0-9 +-]{8,}$/.test(form.phone.trim())) next.phone = 'Escriba un teléfono de 8 dígitos.';
    if (!(Number(form.monthlyBill) > 0)) next.monthlyBill = 'Escriba el monto del recibo.';
    setErrors(next);
    if (Object.keys(next).length) return;
    const lead = addLead(
      {
        name: form.name.trim(),
        phone: form.phone.trim(),
        neighborhood: form.neighborhood.trim(),
        monthlyBill: Number(form.monthlyBill),
        source: form.source,
      },
      user.name,
    );
    if (user.position !== 'tecnico') assignLead(lead.id, user.id, user.name, user.name);
    setForm(EMPTY);
    onClose();
    onCreated?.(lead.id);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Nueva solicitud"
      subtitle="Para quien llamó, escribió o llegó por un letrero."
      size="sm"
    >
      <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
        <Field label="Nombre y apellido" value={form.name} onChange={set('name')} error={errors.name} />
        <div className={admin.formRow}>
          <Field
            label="Teléfono"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={set('phone')}
            error={errors.phone}
          />
          <Field label="Barrio" value={form.neighborhood} onChange={set('neighborhood')} />
        </div>
        <div className={admin.formRow}>
          <Field
            label="Recibo de luz (USD/mes)"
            type="number"
            inputMode="numeric"
            value={form.monthlyBill}
            onChange={set('monthlyBill')}
            error={errors.monthlyBill}
          />
          <Field as="select" label="¿Cómo llegó?" value={form.source} onChange={set('source')}>
            {Object.entries(LEAD_SOURCES).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </Field>
        </div>
        <Button type="submit" size="lg" block>
          Guardar solicitud
        </Button>
      </form>
    </Dialog>
  );
};
