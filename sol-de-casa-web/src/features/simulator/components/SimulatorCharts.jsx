import { ChartCard, baseChartOptions, capacityLinePlugin } from '../../../shared/components/index.js';
import { useThemeColors } from '../../../shared/hooks/useThemeColors.js';
import { CASH } from '../../../shared/model/index.js';
import { formatCount, formatUsd, formatUsdShort } from '../../../shared/utils/format.js';

const monthLabels = (rows) => rows.map((row) => `${row.month}`);

export const CashChart = ({ sim }) => {
  const colors = useThemeColors();
  const data = {
    labels: monthLabels(sim.rows),
    datasets: [
      {
        type: 'line',
        label: 'Caja al final del mes',
        data: sim.rows.map((row) => row.cash),
        borderColor: colors.google,
        backgroundColor: colors.google,
        pointBackgroundColor: sim.rows.map((row) => (row.belowFloor ? colors.bad : colors.google)),
        pointRadius: 3,
        tension: 0.15,
        borderWidth: 3,
      },
      {
        type: 'line',
        label: `Piso (${formatUsd(CASH.floor)})`,
        data: sim.rows.map(() => CASH.floor),
        borderColor: colors.bad,
        borderDash: [6, 4],
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };
  const options = baseChartOptions(colors, { yFormat: formatUsdShort, xTitle: 'Mes' });
  options.scales.y.beginAtZero = false;
  options.plugins.tooltip = { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatUsd(ctx.parsed.y)}` } };
  return (
    <ChartCard
      title="Caja mes a mes"
      eyebrow="Con la línea del piso"
      type="line"
      data={data}
      options={options}
      height={300}
    />
  );
};

export const VisitsChart = ({ sim }) => {
  const colors = useThemeColors();
  const data = {
    labels: monthLabels(sim.rows),
    datasets: [
      {
        type: 'bar',
        label: 'Visitas pedidas',
        data: sim.rows.map((row) => row.requestedVisits),
        backgroundColor: colors.sun,
        borderRadius: 3,
        order: 2,
      },
      {
        type: 'line',
        label: 'Capacidad',
        data: sim.rows.map((row) => row.capacity),
        borderColor: colors.bad,
        backgroundColor: colors.bad,
        stepped: true,
        pointRadius: 0,
        borderWidth: 3,
        order: 1,
      },
    ],
  };
  return (
    <ChartCard
      title="Visitas pedidas frente a la capacidad"
      eyebrow="Mes a mes"
      type="bar"
      data={data}
      options={baseChartOptions(colors, { yFormat: formatCount, xTitle: 'Mes' })}
      plugins={[capacityLinePlugin]}
      height={300}
    />
  );
};
