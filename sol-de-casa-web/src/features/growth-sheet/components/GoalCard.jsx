import { Card, ScrollTable } from '../../../shared/components/index.js';
import {
  DEFAULT_PARAMS,
  FAMILIES_WITH_PANELS,
  calculateMonth,
  leadsToFillVisits,
  organicReferralsToday,
  referralFunnel,
  referralSaleCost,
} from '../../../shared/model/index.js';
import { formatCount, formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './GrowthSheet.module.css';

const GOAL_VISITS = 25;

/** Pregunta 4 y la meta en números. */
export const GoalCard = () => {
  const today = organicReferralsToday();
  const fullTech = leadsToFillVisits();
  const goal = leadsToFillVisits(GOAL_VISITS);
  const goalSales = referralFunnel(goal.leadsPerMonth).sales;
  const referralCost = referralSaleCost().totalCost;
  const googleCac = calculateMonth(DEFAULT_PARAMS).google.realCac;
  const monthlySavings = goalSales * (googleCac - referralCost);

  const rows = [
    {
      label: 'Leads referidos al mes',
      today: formatCount(today.perMonth),
      goal: formatCount(goal.leadsPerMonth),
      full: formatCount(fullTech.leadsPerMonth),
    },
    {
      label: 'Visitas que llenan',
      today: formatCount(today.perMonth * fullTech.visitsPerLead),
      goal: formatInteger(GOAL_VISITS),
      full: '50',
    },
    {
      label: 'Ventas referidas al mes',
      today: formatCount(today.salesPerMonth),
      goal: formatCount(goalSales),
      full: formatCount(fullTech.salesPerMonth),
    },
    {
      label: 'Familias que comparten, al ritmo de un letrero',
      today: '—',
      goal: formatInteger(goal.familiesNeeded),
      full: formatInteger(fullTech.familiesNeeded),
    },
  ];

  return (
    <Card title="La meta en números" eyebrow="Pregunta 4 · 90 días">
      <ScrollTable caption="Meta de referidos">
        <thead>
          <tr>
            <th scope="col">Concepto</th>
            <th scope="col">Hoy</th>
            <th scope="col">Meta 90 días</th>
            <th scope="col">Técnico lleno</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.today}</td>
              <td style={{ fontWeight: 800 }}>{row.goal}</td>
              <td>{row.full}</td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>
      <p className={styles.highlight}>
        Llenar las 50 visitas de un técnico nuevo pide {formatCount(fullTech.leadsPerMonth)} leads referidos al mes. Si
        cada familia rindiera como un letrero (0,15 leads al mes), harían falta {formatInteger(fullTech.familiesNeeded)}{' '}
        familias: más que las {formatInteger(FAMILIES_WITH_PANELS)} que existen.
      </p>
      <p className={styles.small}>
        Por eso la tarjeta tiene que rendir más que un letrero: llega por WhatsApp a gente que conoce a la familia. Meta
        a 90 días: de {formatCount(today.perMonth)} a {formatCount(goal.leadsPerMonth)} leads referidos al mes (medio
        técnico). Esas {formatCount(goalSales)} ventas cuestan {formatUsd(referralCost)} cada una en vez de{' '}
        {formatUsd(googleCac)} en Google: unos {formatUsd(monthlySavings)} menos al mes por los mismos clientes.
      </p>
    </Card>
  );
};
