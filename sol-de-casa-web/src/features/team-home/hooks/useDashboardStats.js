import { useMemo } from 'react';
import { LEAD_SOURCES } from '../../../services/leadsService.js';
import { DEFAULT_PARAMS, PAID_AT_SIGNING_SHARE } from '../../../shared/model/index.js';
import { sameDay } from '../../../shared/utils/dates.js';
import { minutesSince } from '../../../shared/utils/time.js';

const DAY = 24 * 60;
const DAY_MS = 24 * 3600 * 1000;
const shortDay = (date) => date.toLocaleDateString('es-CR', { weekday: 'short', day: 'numeric' });

/**
 * Todos los números del resumen salen de las solicitudes del CRM.
 * `onlyTechnicianId` limita las visitas a las de un técnico.
 */
export const useDashboardStats = (leads, { responseGoalMinutes, onlyTechnicianId } = {}) =>
  useMemo(() => {
    const now = new Date();
    const createdWithin = (from, to) => (lead) => {
      const minutes = minutesSince(lead.createdAt, now.getTime());
      return minutes > from * DAY && minutes <= to * DAY;
    };

    const last7 = leads.filter(createdWithin(-1, 7));
    const prev7 = leads.filter(createdWithin(7, 14));
    const trend = prev7.length ? ((last7.length - prev7.length) / prev7.length) * 100 : null;

    const pending = leads.filter((lead) => lead.status === 'nuevo');
    const waiting = pending.filter((lead) => minutesSince(lead.createdAt, now.getTime()) > responseGoalMinutes);
    const unassigned = leads.filter((lead) => ['nuevo', 'contactado'].includes(lead.status) && !lead.assignedTo);
    const noTechnician = leads.filter((lead) => lead.status === 'agendado' && !lead.technicianId);
    const overdue = leads.filter(
      (lead) =>
        lead.status === 'agendado' &&
        lead.visitAt &&
        new Date(lead.visitAt).getTime() < now.getTime() - 2 * 3600 * 1000,
    );

    const visits = leads
      .filter(
        (lead) =>
          lead.visitAt && lead.status !== 'perdido' && (!onlyTechnicianId || lead.technicianId === onlyTechnicianId),
      )
      .sort((a, b) => new Date(a.visitAt) - new Date(b.visitAt));
    const visitsToday = visits.filter((lead) => sameDay(new Date(lead.visitAt), now));
    const upcoming = visits.filter((lead) => {
      const time = new Date(lead.visitAt).getTime();
      return time > now.getTime() && time - now.getTime() <= 7 * DAY_MS && !sameDay(new Date(lead.visitAt), now);
    });
    const monthVisits = visits.filter((lead) => {
      const date = new Date(lead.visitAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const signed30 = leads.filter(
      (lead) => lead.status === 'firmado' && minutesSince(lead.createdAt, now.getTime()) <= 30 * DAY,
    );
    const revenue = signed30.length * DEFAULT_PARAMS.price;
    const collected = revenue * PAID_AT_SIGNING_SHARE;
    const inProposal = leads.filter((lead) => ['agendado', 'visitado'].includes(lead.status));

    // Tiempo hasta el primer movimiento del equipo (solo solicitudes con historial).
    const responses = leads
      .filter((lead) => lead.history.length > 1)
      .map((lead) => (new Date(lead.history[1].at) - new Date(lead.createdAt)) / 60000)
      .filter((minutes) => minutes >= 0);
    const responseAverage = responses.length
      ? responses.reduce((sum, value) => sum + value, 0) / responses.length
      : null;

    const daily = Array.from({ length: 14 }, (_, index) => {
      const day = new Date(now.getTime() - (13 - index) * DAY_MS);
      return {
        label: shortDay(day),
        isToday: index === 13,
        count: leads.filter((lead) => sameDay(new Date(lead.createdAt), day)).length,
      };
    });

    const bySource = Object.keys(LEAD_SOURCES)
      .map((source) => ({ source, count: leads.filter((lead) => lead.source === source).length }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    const neighborhoods = Object.entries(
      leads.reduce((acc, lead) => {
        const name = lead.neighborhood || 'Sin barrio';
        acc[name] = (acc[name] ?? 0) + 1;
        return acc;
      }, {}),
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      last7,
      prev7Count: prev7.length,
      trend,
      pending,
      waiting,
      unassigned,
      noTechnician,
      overdue,
      visitsToday,
      upcoming,
      monthVisits,
      signed30,
      revenue,
      collected,
      toCollect: revenue - collected,
      inProposal,
      proposalValue: inProposal.length * DEFAULT_PARAMS.price,
      responseAverage,
      daily,
      bySource,
      neighborhoods,
    };
  }, [leads, responseGoalMinutes, onlyTechnicianId]);
