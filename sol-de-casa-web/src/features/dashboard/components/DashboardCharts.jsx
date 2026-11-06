import { useMemo } from 'react';
import { ChartCard, baseChartOptions, capacityLinePlugin } from '../../../shared/components/index.js';
import { useThemeColors } from '../../../shared/hooks/useThemeColors.js';
import { useIsMobile } from '../../../shared/hooks/useMediaQuery.js';
import { formatCount, formatInteger, formatUsd } from '../../../shared/utils/format.js';

const FUNNEL_STEPS = ['Leads', 'Contactados', 'Agendan', 'Visitas hechas', 'Ventas'];
const funnelValues = (channel) => [
  channel.leads,
  channel.contacted,
  channel.scheduled,
  channel.doneVisits,
  channel.sales,
];

/** Embudo de cada canal lado a lado: dónde se cae la gente. */
export const FunnelChart = ({ result }) => {
  const colors = useThemeColors();
  const data = {
    labels: FUNNEL_STEPS,
    datasets: [
      { label: 'Meta', data: funnelValues(result.meta), backgroundColor: colors.meta, borderRadius: 4 },
      { label: 'Google', data: funnelValues(result.google), backgroundColor: colors.google, borderRadius: 4 },
    ],
  };
  return (
    <ChartCard
      title="Embudo de cada canal"
      eyebrow="Gráfico 1"
      caption="Meta trae muchos más leads, pero casi la mitad no contesta: llega a ventas con menos gente que Google."
      type="bar"
      data={data}
      options={baseChartOptions(colors, { yFormat: formatCount, yTitle: 'Personas al mes' })}
    />
  );
};

/** CPL frente al CAC real de cada canal. */
export const CplVsCacChart = ({ result }) => {
  const colors = useThemeColors();
  const data = {
    labels: ['Meta', 'Google'],
    datasets: [
      { label: 'CPL', data: [result.meta.cpl, result.google.cpl], backgroundColor: colors.sun, borderRadius: 4 },
      {
        label: 'CAC de anuncios',
        data: [result.meta.adsCac, result.google.adsCac],
        backgroundColor: colors.muted,
        borderRadius: 4,
      },
      {
        label: 'CAC real',
        data: [result.meta.realCac, result.google.realCac],
        backgroundColor: colors.bad,
        borderRadius: 4,
      },
    ],
  };
  return (
    <ChartCard
      title="CPL frente a CAC real"
      eyebrow="Gráfico 2"
      caption="El costo por lead casi no se ve: lo que pesa es lo que cuesta llegar a un cliente que firma."
      type="bar"
      data={data}
      options={baseChartOptions(colors, { yFormat: formatUsd, yTitle: 'USD' })}
    />
  );
};

/** Visitas pedidas frente a la capacidad, con la línea de 100 (o más con técnicos). */
export const CapacityChart = ({ result }) => {
  const colors = useThemeColors();
  const data = {
    labels: ['Visitas del mes'],
    datasets: [
      {
        type: 'bar',
        label: 'Google',
        data: [result.google.requestedVisits],
        backgroundColor: colors.google,
        stack: 'v',
        borderRadius: 4,
      },
      {
        type: 'bar',
        label: 'Meta',
        data: [result.meta.requestedVisits],
        backgroundColor: colors.meta,
        stack: 'v',
        borderRadius: 4,
      },
    ],
  };
  const options = baseChartOptions(colors, { stacked: true, yFormat: formatCount, yTitle: 'Visitas' });
  options.scales.y.suggestedMax = Math.max(result.capacity, result.total.requestedVisits) * 1.15;
  options.plugins.capacityLine = {
    value: result.capacity,
    color: colors.bad,
    label: `Capacidad: ${formatInteger(result.capacity)}`,
  };
  return (
    <ChartCard
      title="Visitas pedidas frente a la capacidad"
      eyebrow="Gráfico 3"
      caption={`La línea roja es la capacidad del mes (${formatInteger(result.capacity)} visitas). Lo que pasa de la línea se pierde.`}
      type="bar"
      data={data}
      options={options}
      plugins={[capacityLinePlugin]}
    />
  );
};

/** Requisito 4 del nivel 2: la trampa en un solo gráfico (índice con Google = 100). */
export const TrapChart = ({ result }) => {
  const colors = useThemeColors();
  const isMobile = useIsMobile();
  const data = useMemo(() => {
    const index = (meta, google) => (google > 0 ? (meta / google) * 100 : 0);
    return {
      labels: ['Costo del lead (CPL)', 'Costo del cliente (CAC real)'],
      datasets: [
        {
          label: 'Meta',
          data: [index(result.meta.cpl, result.google.cpl), index(result.meta.realCac, result.google.realCac)],
          backgroundColor: colors.meta,
          borderRadius: 4,
        },
        { label: 'Google = 100', data: [100, 100], backgroundColor: colors.google, borderRadius: 4 },
      ],
    };
  }, [result, colors]);
  const options = baseChartOptions(colors, {
    yFormat: (value) => formatInteger(value),
    yTitle: 'Índice (Google = 100)',
  });
  return (
    <ChartCard
      title="Lead barato, cliente caro"
      eyebrow="La trampa en un gráfico"
      caption={`Con Google = 100, el lead de Meta vale ${formatInteger(data.datasets[0].data[0])} y su cliente vale ${formatInteger(data.datasets[0].data[1])}.`}
      type="bar"
      data={data}
      options={options}
      height={isMobile ? 240 : 260}
    />
  );
};
