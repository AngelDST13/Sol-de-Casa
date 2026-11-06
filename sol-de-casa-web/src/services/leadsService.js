import { logActivity } from './activityService.js';
import { createStore } from './storage.js';

/**
 * Solicitudes de visita (leads) y tarjetas compartidas. Prototipo en el navegador:
 * en producción, addLead sería un POST a un webhook de n8n o a la API del CRM.
 */
const LEADS_KEY = 'sol-de-casa:solicitudes';
const SHARES_KEY = 'sol-de-casa:compartidas';

export const LEAD_STATUSES = [
  { id: 'nuevo', label: 'Nuevo', hint: 'Pidió la visita; hay que llamar en menos de 5 minutos' },
  { id: 'contactado', label: 'Contactado', hint: 'Se habló con la persona' },
  { id: 'agendado', label: 'Visita agendada', hint: 'Tiene día y hora para la visita técnica' },
  { id: 'visitado', label: 'Visita hecha', hint: 'El técnico midió el techo y dejó la propuesta' },
  { id: 'firmado', label: 'Firmó', hint: 'Se cobra el 50 % y se pagan los equipos' },
  { id: 'perdido', label: 'Perdido', hint: 'No contestó, no le interesó o no califica' },
];

export const statusLabel = (id) => LEAD_STATUSES.find((status) => status.id === id)?.label ?? id;

export const LEAD_SOURCES = {
  web: 'Página web',
  referido: 'Referido',
  meta: 'Meta',
  google: 'Google',
  letrero: 'Letrero',
  telefono: 'Llamada',
};

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

/** Fecha y hora de visita a N días de hoy, a la hora indicada. */
const visitIn = (days, hour) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

const withDefaults = (lead) => ({
  assignedTo: null,
  technicianId: null,
  visitAt: null,
  history: [],
  simulated: false,
  ...lead,
  notes: Array.isArray(lead.notes) ? lead.notes : [],
});

/** Datos de ejemplo para que el sistema no arranque vacío. Todos llevan simulated: true. */
const seedLeads = () =>
  [
    {
      id: 'sim-01',
      name: 'Marta Solano',
      phone: '8812 4410',
      neighborhood: 'Curridabat',
      monthlyBill: 120,
      source: 'referido',
      refCode: 'FAM-0137',
      status: 'firmado',
      createdAt: hoursAgo(24 * 21),
      assignedTo: 'u-paola',
      technicianId: 'u-mario',
      visitAt: visitIn(-18, 9),
    },
    {
      id: 'sim-02',
      name: 'Luis Arce',
      phone: '8890 1123',
      neighborhood: 'Curridabat',
      monthlyBill: 95,
      source: 'referido',
      refCode: 'FAM-0137',
      status: 'agendado',
      createdAt: hoursAgo(24 * 6),
      assignedTo: 'u-paola',
      technicianId: 'u-mario',
      visitAt: visitIn(1, 9),
    },
    {
      id: 'sim-03',
      name: 'Rosa Jiménez',
      phone: '8701 5532',
      neighborhood: 'Moravia',
      monthlyBill: 140,
      source: 'google',
      status: 'visitado',
      createdAt: hoursAgo(24 * 4),
      assignedTo: 'u-kevin',
      technicianId: 'u-diego',
      visitAt: visitIn(-1, 14),
    },
    {
      id: 'sim-04',
      name: 'Carlos Méndez',
      phone: '8344 0921',
      neighborhood: 'Escazú',
      monthlyBill: 180,
      source: 'google',
      status: 'firmado',
      createdAt: hoursAgo(24 * 9),
      assignedTo: 'u-kevin',
      technicianId: 'u-diego',
      visitAt: visitIn(-6, 10),
    },
    {
      id: 'sim-05',
      name: 'Patricia Vargas',
      phone: '8566 7712',
      neighborhood: 'Heredia',
      monthlyBill: 85,
      source: 'meta',
      status: 'perdido',
      createdAt: hoursAgo(24 * 3),
      assignedTo: 'u-paola',
    },
    {
      id: 'sim-06',
      name: 'Jorge Castro',
      phone: '8423 9001',
      neighborhood: 'Tibás',
      monthlyBill: 110,
      source: 'meta',
      status: 'contactado',
      createdAt: hoursAgo(30),
      assignedTo: 'u-kevin',
    },
    {
      id: 'sim-07',
      name: 'Elena Mora',
      phone: '8999 3345',
      neighborhood: 'San Pedro',
      monthlyBill: 130,
      source: 'web',
      status: 'nuevo',
      createdAt: hoursAgo(2),
    },
    {
      id: 'sim-08',
      name: 'Daniel Quesada',
      phone: '8611 2280',
      neighborhood: 'Curridabat',
      monthlyBill: 100,
      source: 'letrero',
      status: 'agendado',
      createdAt: hoursAgo(24 * 2),
      assignedTo: 'u-paola',
      technicianId: 'u-diego',
      visitAt: visitIn(0, 15),
    },
    {
      id: 'sim-09',
      name: 'Sofía Rojas',
      phone: '8730 4456',
      neighborhood: 'Santa Ana',
      monthlyBill: 160,
      source: 'meta',
      status: 'nuevo',
      createdAt: hoursAgo(5),
    },
    {
      id: 'sim-10',
      name: 'Andrea Solís',
      phone: '8455 6120',
      neighborhood: 'Coronado',
      monthlyBill: 125,
      source: 'google',
      status: 'agendado',
      createdAt: hoursAgo(24 * 3),
      assignedTo: 'u-kevin',
      technicianId: 'u-mario',
      visitAt: visitIn(2, 11),
    },
    {
      id: 'sim-11',
      name: 'Felipe Arias',
      phone: '8320 7781',
      neighborhood: 'Desamparados',
      monthlyBill: 90,
      source: 'meta',
      status: 'agendado',
      createdAt: hoursAgo(24 * 2),
      assignedTo: 'u-paola',
      technicianId: 'u-diego',
      visitAt: visitIn(3, 8),
    },
  ].map((lead) => withDefaults({ ...lead, simulated: true }));

const leadsStore = createStore(LEADS_KEY, seedLeads, (saved) => saved.map(withDefaults));
const sharesStore = createStore(SHARES_KEY, () => []);

export const getLeads = () => leadsStore.get();
export const subscribeLeads = leadsStore.subscribe;
export const getShares = () => sharesStore.get();
export const subscribeShares = sharesStore.subscribe;

const historyEntry = (actor, text) => ({ at: new Date().toISOString(), by: actor ?? 'Sistema', text });

const patch = (id, change) => {
  let updated = null;
  leadsStore.set(
    leadsStore.get().map((lead) => {
      if (lead.id !== id) return lead;
      updated = change(lead);
      return updated;
    }),
  );
  return updated;
};

/** El vecino o cualquier persona pide la visita desde la web. */
export const addLead = ({ name, phone, monthlyBill, refCode, neighborhood = '', source }, actor) => {
  const origin = source ?? (refCode ? 'referido' : 'web');
  const lead = withDefaults({
    id: `lead-${Date.now()}`,
    name,
    phone,
    neighborhood,
    monthlyBill,
    source: origin,
    refCode: refCode || null,
    status: 'nuevo',
    createdAt: new Date().toISOString(),
    history: [
      historyEntry(
        actor ?? name,
        actor ? `Registró la solicitud (${LEAD_SOURCES[origin]})` : 'Pidió la visita desde la web',
      ),
    ],
  });
  leadsStore.set([lead, ...leadsStore.get()]);
  logActivity({
    actor: actor ?? name,
    action: 'Nueva solicitud de visita',
    detail: `${name} · ${LEAD_SOURCES[origin]}`,
    leadId: lead.id,
  });
  return lead;
};

export const setLeadStatus = (id, status, actor) => {
  const lead = patch(id, (current) =>
    current.status === status
      ? current
      : {
          ...current,
          status,
          history: [...current.history, historyEntry(actor, `Cambió el estado a «${statusLabel(status)}»`)],
        },
  );
  if (lead) logActivity({ actor, action: `Marcó «${statusLabel(status)}»`, detail: lead.name, leadId: id });
};

export const assignLead = (id, userId, userName, actor) => {
  const lead = patch(id, (current) => ({
    ...current,
    assignedTo: userId || null,
    history: [...current.history, historyEntry(actor, userId ? `Asignó a ${userName}` : 'Quitó la asignación')],
  }));
  if (lead)
    logActivity({ actor, action: 'Asignó una solicitud', detail: `${lead.name} → ${userName ?? 'nadie'}`, leadId: id });
};

/** Agenda la visita técnica: guarda fecha y técnico y pasa el estado a «Visita agendada». */
export const scheduleVisit = (id, { visitAt, technicianId, technicianName }, actor) => {
  const when = new Date(visitAt).toLocaleString('es-CR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
  const lead = patch(id, (current) => ({
    ...current,
    visitAt,
    technicianId,
    status: ['nuevo', 'contactado', 'perdido'].includes(current.status) ? 'agendado' : current.status,
    history: [...current.history, historyEntry(actor, `Agendó la visita: ${when} con ${technicianName}`)],
  }));
  if (lead) logActivity({ actor, action: 'Agendó una visita', detail: `${lead.name} · ${when}`, leadId: id });
};

export const addNote = (id, text, actor) =>
  patch(id, (current) => ({ ...current, notes: [...current.notes, historyEntry(actor, text.trim())] }));

export const updateLead = (id, changes, actor) => {
  if (changes.status) return setLeadStatus(id, changes.status, actor);
  return patch(id, (current) => ({ ...current, ...changes }));
};

export const deleteLead = (id, actor) => {
  const lead = leadsStore.get().find((item) => item.id === id);
  leadsStore.set(leadsStore.get().filter((item) => item.id !== id));
  if (lead) logActivity({ actor, action: 'Eliminó una solicitud', detail: lead.name });
};

export const addShare = ({ refCode, channel }) =>
  sharesStore.set([...sharesStore.get(), { refCode, channel, at: new Date().toISOString() }]);

export const resetLeads = () => {
  leadsStore.reset();
  sharesStore.reset();
};

/**
 * En qué paso va un vecino referido, para el juego de la familia.
 * 0 compartió · 1 pidió la visita · 2 agendó · 3 firmó · -1 perdido
 */
export const referralStage = (status) =>
  ({ nuevo: 1, contactado: 1, agendado: 2, visitado: 2, firmado: 3, perdido: -1 })[status] ?? 0;
