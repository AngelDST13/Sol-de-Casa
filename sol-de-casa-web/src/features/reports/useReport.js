import { useMemo } from 'react';
import { LEAD_SOURCES } from '../../services/leadsService.js';
import { contributionPerSale, DEFAULT_PARAMS } from '../../shared/model/index.js';
import { minutesSince } from '../../shared/utils/time.js';

const ORDER = ['nuevo', 'contactado', 'agendado', 'visitado', 'firmado'];
// Toda solicitud cuenta en el primer paso, también las perdidas; los siguientes, solo las que llegaron.
const reached = (lead, step) =>
  step === 'nuevo' || (lead.status !== 'perdido' && ORDER.indexOf(lead.status) >= ORDER.indexOf(step));

export const PERIODS = [
  { id: 7, label: '7 días' },
  { id: 30, label: '30 días' },
  { id: 90, label: '90 días' },
  { id: 0, label: 'Todo' },
];

const rate = (part, whole) => (whole ? (part / whole) * 100 : 0);

/** Números del reporte a partir de las solicitudes del período. */
export const useReport = (leads, users, days) =>
  useMemo(() => {
    const inPeriod = leads.filter((lead) => !days || minutesSince(lead.createdAt) <= days * 24 * 60);
    const funnel = [
      { id: 'nuevo', label: 'Solicitudes' },
      { id: 'contactado', label: 'Contactadas' },
      { id: 'agendado', label: 'Visita agendada' },
      { id: 'visitado', label: 'Visita hecha' },
      { id: 'firmado', label: 'Firmaron' },
    ].map((step) => ({ ...step, count: inPeriod.filter((lead) => reached(lead, step.id)).length }));

    const signed = inPeriod.filter((lead) => lead.status === 'firmado').length;
    const visited = inPeriod.filter((lead) => reached(lead, 'visitado')).length;
    const lost = inPeriod.filter((lead) => lead.status === 'perdido').length;

    const bySource = Object.entries(LEAD_SOURCES)
      .map(([id, label]) => {
        const group = inPeriod.filter((lead) => lead.source === id);
        const won = group.filter((lead) => lead.status === 'firmado').length;
        return { id, label, total: group.length, signed: won, conversion: rate(won, group.length) };
      })
      .filter((row) => row.total > 0);

    const byAdvisor = users
      .filter((user) => user.role === 'team' && user.position !== 'tecnico')
      .map((user) => {
        const group = inPeriod.filter((lead) => lead.assignedTo === user.id);
        const won = group.filter((lead) => lead.status === 'firmado').length;
        return { id: user.id, label: user.name, total: group.length, signed: won, conversion: rate(won, group.length) };
      })
      .filter((row) => row.total > 0);

    return {
      inPeriod,
      funnel,
      signed,
      lost,
      closeRate: rate(signed, visited),
      revenue: signed * DEFAULT_PARAMS.price,
      contribution: signed * contributionPerSale(DEFAULT_PARAMS),
      bySource,
      byAdvisor,
    };
  }, [leads, users, days]);
