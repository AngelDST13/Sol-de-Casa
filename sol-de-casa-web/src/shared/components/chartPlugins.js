/** Plugin de Chart.js que dibuja la línea horizontal de capacidad. */
export const capacityLinePlugin = {
  id: 'capacityLine',
  afterDatasetsDraw(chart, _args, pluginOptions) {
    if (!pluginOptions?.value) return;
    const { ctx, chartArea, scales } = chart;
    const y = scales.y.getPixelForValue(pluginOptions.value);
    ctx.save();
    ctx.strokeStyle = pluginOptions.color;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = pluginOptions.color;
    ctx.font = "700 12px 'Archivo', system-ui, sans-serif";
    ctx.textAlign = 'right';
    ctx.fillText(pluginOptions.label, chartArea.right, y - 6);
    ctx.restore();
  },
};
