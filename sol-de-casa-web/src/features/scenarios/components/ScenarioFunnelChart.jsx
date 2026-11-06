import { ChartCard, baseChartOptions, capacityLinePlugin } from '../../../shared/components/index.js';
import { useThemeColors } from '../../../shared/hooks/useThemeColors.js';
import { formatCount, formatInteger } from '../../../shared/utils/format.js';

const STEPS = ['Leads', 'Contactados', 'Agendan', 'Visitas pedidas', 'Ventas'];
const values = (channel) => [
  channel.leads,
  channel.contacted,
  channel.scheduled,
  channel.requestedVisits,
  channel.sales,
];

/**
 * Requisito 3 del nivel 1: el embudo de cada canal lado a lado, con la línea de capacidad de visitas.
 * La línea solo aplica al paso «Visitas pedidas»: es lo que el equipo puede hacer al mes.
 */
export const ScenarioFunnelChart = ({ result }) => {
  const colors = useThemeColors();
  const data = {
    labels: STEPS,
    datasets: [
      { label: 'Meta', data: values(result.meta), backgroundColor: colors.meta, borderRadius: 4 },
      { label: 'Google', data: values(result.google), backgroundColor: colors.google, borderRadius: 4 },
    ],
  };
  const options = baseChartOptions(colors, { yFormat: formatCount, yTitle: 'Personas al mes (escenario de hoy)' });
  options.plugins.capacityLine = {
    value: result.capacity,
    color: colors.bad,
    label: `Capacidad: ${formatInteger(result.capacity)} visitas`,
  };
  return (
    <ChartCard
      title="Embudo de cada canal, lado a lado"
      eyebrow="Gráfico del nivel 1"
      caption={`Meta trae ${formatInteger(result.meta.leads)} leads y Google ${formatInteger(result.google.leads)}, pero Google termina con más ventas. Las visitas pedidas (${formatCount(result.total.requestedVisits)}) casi llenan la capacidad de ${formatInteger(result.capacity)}.`}
      type="bar"
      data={data}
      options={options}
      plugins={[capacityLinePlugin]}
      height={320}
    />
  );
};
