import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { Dialog } from '../../../shared/components/Dialog.jsx';
import { Section } from '../../../shared/components/Section.jsx';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { SourceTag, StatusBadge } from '../../../shared/components/StatusBadge.jsx';
import { useAuth } from '../../../shared/hooks/AuthContext.jsx';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { useTeam } from '../../../shared/hooks/useStores.js';
import { isAdmin } from '../../../shared/utils/permissions.js';
import {
  LEAD_STATUSES,
  addNote,
  assignLead,
  deleteLead,
  scheduleVisit,
  setLeadStatus,
} from '../../../services/leadsService.js';
import { savingsCalculator } from '../../../shared/model/index.js';
import { formatCount, formatUsd } from '../../../shared/utils/format.js';
import { formatDateTime, toLocalInput } from '../../../shared/utils/dates.js';
import { timeAgo } from '../../../shared/utils/time.js';
import admin from '../../../shared/components/admin.module.css';

const digits = (phone) => phone.replace(/\D/g, '');

/** Ficha completa de una solicitud: estado, asignación, visita, notas e historial. */
export const LeadDialog = ({ leadId, onClose }) => {
  const lead = useLeads().find((item) => item.id === leadId);
  return (
    <Dialog
      open={Boolean(lead)}
      onClose={onClose}
      title={lead?.name ?? ''}
      subtitle={
        lead && (
          <>
            <StatusBadge status={lead.status} />
            <SourceTag source={lead.source} />
            <span>{timeAgo(lead.createdAt)}</span>
            {lead.simulated && <SimTag />}
          </>
        )
      }
    >
      {lead && <LeadDetail key={lead.id} lead={lead} onDeleted={onClose} />}
    </Dialog>
  );
};

const LeadDetail = ({ lead, onDeleted }) => {
  const { user } = useAuth();
  const advisors = useTeam(['asesora', 'admin']);
  const technicians = useTeam(['tecnico']);
  const [visitAt, setVisitAt] = useState(() => toLocalInput(lead.visitAt ?? nextMorning()));
  const [technicianId, setTechnicianId] = useState(lead.technicianId ?? technicians[0]?.id ?? '');
  const [note, setNote] = useState('');
  const [armed, setArmed] = useState(false);
  const saving = savingsCalculator(lead.monthlyBill);
  const technicianName = technicians.find((item) => item.id === lead.technicianId)?.name;

  const schedule = (event) => {
    event.preventDefault();
    const technician = technicians.find((item) => item.id === technicianId);
    if (!technician || !visitAt) return;
    scheduleVisit(
      lead.id,
      { visitAt: new Date(visitAt).toISOString(), technicianId, technicianName: technician.name },
      user.name,
    );
  };

  const saveNote = (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    addNote(lead.id, note, user.name);
    setNote('');
  };

  return (
    <>
      <div className={admin.toolbar} style={{ marginBottom: 0 }}>
        <Button href={`tel:${digits(lead.phone)}`} variant="sun">
          Llamar · {lead.phone}
        </Button>
        <Button href={`https://wa.me/506${digits(lead.phone)}`} variant="ghost" target="_blank" rel="noreferrer">
          WhatsApp
        </Button>
      </div>

      <Section title="Datos">
        <dl className={admin.dl}>
          <div>
            <dt>Barrio</dt>
            <dd>{lead.neighborhood || '—'}</dd>
          </div>
          <div>
            <dt>Recibo de luz</dt>
            <dd>{formatUsd(lead.monthlyBill)}/mes</dd>
          </div>
          <div>
            <dt>Ahorro estimado</dt>
            <dd>{formatUsd(saving.monthly)}/mes</dd>
          </div>
          <div>
            <dt>Recupera la instalación</dt>
            <dd>{formatCount(saving.paybackYears)} años</dd>
          </div>
          <div>
            <dt>Referido por</dt>
            <dd>{lead.refCode ?? '—'}</dd>
          </div>
          <div>
            <dt>Visita</dt>
            <dd>{lead.visitAt ? `${formatDateTime(lead.visitAt)} · ${technicianName ?? ''}` : 'Sin agendar'}</dd>
          </div>
        </dl>
      </Section>

      <Section title="Seguimiento">
        <div className={admin.formRow}>
          <label className={admin.muted}>
            Estado
            <select
              className={admin.input}
              value={lead.status}
              onChange={(event) => setLeadStatus(lead.id, event.target.value, user.name)}
            >
              {LEAD_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label className={admin.muted}>
            Asesora a cargo
            <select
              className={admin.input}
              value={lead.assignedTo ?? ''}
              onChange={(event) => {
                const person = advisors.find((item) => item.id === event.target.value);
                assignLead(lead.id, event.target.value, person?.name, user.name);
              }}
            >
              <option value="">Sin asignar</option>
              {advisors.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Section>

      <Section title={lead.visitAt ? 'Cambiar la visita técnica' : 'Agendar la visita técnica'}>
        <form className={admin.formRow} onSubmit={schedule}>
          <label className={admin.muted}>
            Día y hora
            <input
              type="datetime-local"
              className={admin.input}
              value={visitAt}
              onChange={(event) => setVisitAt(event.target.value)}
              required
            />
          </label>
          <label className={admin.muted}>
            Técnico
            <select
              className={admin.input}
              value={technicianId}
              onChange={(event) => setTechnicianId(event.target.value)}
              required
            >
              {technicians.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="dark">
            {lead.visitAt ? 'Guardar el cambio' : 'Agendar la visita'}
          </Button>
        </form>
      </Section>

      <Section title={`Notas (${lead.notes.length})`}>
        <form onSubmit={saveNote} style={{ display: 'grid', gap: 8 }}>
          <label className="visually-hidden" htmlFor="nota-nueva">
            Nota nueva
          </label>
          <textarea
            id="nota-nueva"
            className={admin.input}
            style={{ minHeight: 80, padding: 12 }}
            placeholder="Ej.: techo de zinc, prefiere visita en la tarde"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <Button type="submit" variant="ghost" disabled={!note.trim()}>
            Agregar nota
          </Button>
        </form>
        {lead.notes.length > 0 && (
          <ul className={admin.timeline}>
            {[...lead.notes].reverse().map((item) => (
              <li key={item.at + item.text}>
                <span>{item.text}</span>
                <small>
                  {item.by} · {timeAgo(item.at)}
                </small>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Historial">
        {lead.history.length === 0 ? (
          <p className={admin.muted}>Sin movimientos registrados.</p>
        ) : (
          <ul className={admin.timeline}>
            {[...lead.history].reverse().map((item) => (
              <li key={item.at + item.text}>
                <span>{item.text}</span>
                <small>
                  {item.by} · {timeAgo(item.at)}
                </small>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {isAdmin(user) && (
        <button
          type="button"
          className={admin.danger}
          data-armed={armed}
          onClick={() => {
            if (!armed) return setArmed(true);
            deleteLead(lead.id, user.name);
            onDeleted();
          }}
          onBlur={() => setArmed(false)}
        >
          {armed ? '¿Seguro? Toque otra vez para eliminar' : 'Eliminar solicitud'}
        </button>
      )}
    </>
  );
};

const nextMorning = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(9, 0, 0, 0);
  return date.toISOString();
};
