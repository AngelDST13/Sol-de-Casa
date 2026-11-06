/** Opciones base de Chart.js que toman los colores del tema. */
export const baseChartOptions = (colors, { stacked = false, yFormat, xTitle, yTitle, legend = true } = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 250 },
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: legend,
      position: 'bottom',
      labels: { color: colors.ink, boxWidth: 12, boxHeight: 12, padding: 14 },
    },
    tooltip: yFormat ? { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${yFormat(ctx.parsed.y)}` } } : {},
  },
  scales: {
    x: {
      stacked,
      ticks: { color: colors.muted, maxRotation: 0, autoSkipPadding: 8 },
      grid: { display: false },
      title: { display: Boolean(xTitle), text: xTitle, color: colors.muted },
    },
    y: {
      stacked,
      beginAtZero: true,
      ticks: { color: colors.muted, callback: yFormat ? (value) => yFormat(value) : undefined },
      grid: { color: colors.line },
      title: { display: Boolean(yTitle), text: yTitle, color: colors.muted },
    },
  },
});
