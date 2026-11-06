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

export const LEAD_SOURCES = {
  web: 'Página web',
  referido: 'Referido',
  meta: 'Meta',
  google: 'Google',
  letrero: 'Letrero',
};

const hoursAgo = (hours) => new Date(Date.now() - hours * 3600 * 1000).toISOString();

/** Datos de ejemplo para que el CRM no arranque vacío. Todos llevan simulated: true. */
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
  ].map((lead) => ({ ...lead, simulated: true, notes: '' }));

const leadsStore = createStore(LEADS_KEY, seedLeads);
const sharesStore = createStore(SHARES_KEY, () => []);

export const getLeads = () => leadsStore.get();
export const subscribeLeads = leadsStore.subscribe;
export const getShares = () => sharesStore.get();
export const subscribeShares = sharesStore.subscribe;

export const addLead = ({ name, phone, monthlyBill, refCode, neighborhood = '', source }) => {
  const lead = {
    id: `lead-${Date.now()}`,
    name,
    phone,
    neighborhood,
    monthlyBill,
    source: source ?? (refCode ? 'referido' : 'web'),
    refCode: refCode || null,
    status: 'nuevo',
    createdAt: new Date().toISOString(),
    simulated: false,
    notes: '',
  };
  leadsStore.set([lead, ...leadsStore.get()]);
  return lead;
};

export const updateLead = (id, changes) =>
  leadsStore.set(leadsStore.get().map((lead) => (lead.id === id ? { ...lead, ...changes } : lead)));

export const addShare = ({ refCode, channel }) =>
  sharesStore.set([...sharesStore.get(), { refCode, channel, at: new Date().toISOString() }]);

export const resetDemoData = () => {
  leadsStore.reset();
  sharesStore.reset();
};

/**
 * En qué paso va un vecino referido, para el juego de la familia.
 * 0 compartió · 1 pidió la visita · 2 agendó · 3 firmó · -1 perdido
 */
export const referralStage = (status) =>
  ({ nuevo: 1, contactado: 1, agendado: 2, visitado: 2, firmado: 3, perdido: -1 })[status] ?? 0;
