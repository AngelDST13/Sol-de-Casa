import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/Button.jsx';
import { Field } from '../../../shared/components/Field.jsx';
import { PageHeader } from '../../../shared/components/index.js';
import { Section } from '../../../shared/components/Section.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useSettings, useTeam } from '../../../shared/hooks/useStores.js';
import { generateInviteCode, updateSettings } from '../../../services/settingsService.js';
import { logActivity } from '../../../services/activityService.js';
import { resetAllDemoData } from '../../../services/demoReset.js';
import { formatInteger } from '../../../shared/utils/format.js';
import admin from '../../../shared/components/admin.module.css';

/** Ajustes del negocio y mantenimiento de la demostración. */
export const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const settings = useSettings();
  const technicians = useTeam(['tecnico']);
  const [armed, setArmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const setNumber = (key) => (event) => {
    const value = Number(event.target.value);
    if (value > 0) updateSettings({ [key]: value });
  };

  const regenerate = () => {
    updateSettings({ teamInviteCode: generateInviteCode() });
    logActivity({ actor: user.name, action: 'Cambió el código de invitación del equipo' });
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(settings.teamInviteCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const reset = () => {
    if (!armed) return setArmed(true);
    resetAllDemoData();
    logout();
    navigate('/iniciar-sesion', { replace: true });
  };

  return (
    <>
      <PageHeader level="Administración" title="Ajustes">
        Reglas de operación del negocio y el código para que alguien nuevo del equipo cree su cuenta.
      </PageHeader>

      <div style={{ display: 'grid', gap: 16, maxWidth: 760 }}>
        <Section title="Código de invitación del equipo">
          <p className={admin.muted}>
            Quien se registra como «Trabajo en Sol de Casa» necesita este código. Cámbielo si alguien sale del equipo.
          </p>
          <div className={admin.toolbar} style={{ margin: 0 }}>
            <code
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                padding: '8px 14px',
                background: 'var(--surface-2)',
                borderRadius: 10,
              }}
            >
              {settings.teamInviteCode}
            </code>
            <Button variant="ghost" onClick={copyCode}>
              {copied ? 'Copiado ✓' : 'Copiar'}
            </Button>
            <Button variant="dark" onClick={regenerate}>
              Generar uno nuevo
            </Button>
          </div>
        </Section>

        <Section title="Operación">
          <div className={admin.formRow}>
            <Field
              label="Meta de respuesta (minutos)"
              type="number"
              min={1}
              value={settings.responseGoalMinutes}
              onChange={setNumber('responseGoalMinutes')}
              hint="Una solicitud nueva sin llamar después de este tiempo aparece como «Esperando»."
            />
            <Field
              label="Visitas por técnico al mes"
              type="number"
              min={1}
              value={settings.visitsPerTechnician}
              onChange={setNumber('visitsPerTechnician')}
              hint={`Con ${formatInteger(technicians.length)} técnicos activos: ${formatInteger(technicians.length * settings.visitsPerTechnician)} visitas al mes.`}
            />
          </div>
        </Section>

        <Section title="Datos de demostración">
          <p className={admin.muted}>
            Borra las cuentas creadas, las solicitudes, la actividad y los ajustes de este navegador, y vuelve a cargar
            los datos de ejemplo. Tendrá que iniciar sesión de nuevo.
          </p>
          <button
            type="button"
            className={admin.danger}
            data-armed={armed}
            onClick={reset}
            onBlur={() => setArmed(false)}
            style={{ justifySelf: 'start' }}
          >
            {armed ? '¿Seguro? Toque otra vez para restablecer' : 'Restablecer los datos de demostración'}
          </button>
        </Section>
      </div>
    </>
  );
};
