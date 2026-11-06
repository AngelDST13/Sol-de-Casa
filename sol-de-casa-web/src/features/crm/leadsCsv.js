import { LEAD_SOURCES, statusLabel } from '../../services/leadsService.js';

/** Columnas del CSV de solicitudes. */
export const leadColumns = (nameOf) => [
  { label: 'Nombre', value: (lead) => lead.name },
  { label: 'Teléfono', value: (lead) => lead.phone },
  { label: 'Barrio', value: (lead) => lead.neighborhood },
  { label: 'Recibo (USD)', value: (lead) => lead.monthlyBill },
  { label: 'Origen', value: (lead) => LEAD_SOURCES[lead.source] ?? lead.source },
  { label: 'Referido por', value: (lead) => lead.refCode ?? '' },
  { label: 'Estado', value: (lead) => statusLabel(lead.status) },
  { label: 'Asesora', value: (lead) => nameOf(lead.assignedTo) },
  { label: 'Técnico', value: (lead) => nameOf(lead.technicianId) },
  { label: 'Visita', value: (lead) => (lead.visitAt ? new Date(lead.visitAt).toLocaleString('es-CR') : '') },
  { label: 'Creada', value: (lead) => new Date(lead.createdAt).toLocaleString('es-CR') },
  { label: 'Simulado', value: (lead) => (lead.simulated ? 'sí' : 'no') },
];
