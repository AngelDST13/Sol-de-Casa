import { formatUsd } from '../../shared/utils/format.js';

const W = 1080;
const H = 1350;

/**
 * Dibuja la tarjeta del ahorro como imagen (1080 × 1350, formato de publicación vertical)
 * para subirla a Instagram, Facebook o estados de WhatsApp.
 */
export const renderShareImage = async ({ family, summary }) => {
  if (document.fonts?.ready) await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const display = "'Bricolage Grotesque', Archivo, sans-serif";
  const body = 'Archivo, system-ui, sans-serif';

  ctx.fillStyle = '#F4B000';
  ctx.fillRect(0, 0, W, H);

  // Sol en la esquina
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.arc(W - 90, 120, 230, 0, Math.PI * 2);
  ctx.fill();

  // Panel solar en perspectiva al pie
  const top = H - 380;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(150, top);
  ctx.lineTo(W - 150, top);
  ctx.lineTo(W + 60, H);
  ctx.lineTo(-60, H);
  ctx.closePath();
  ctx.fillStyle = '#1F3253';
  ctx.fill();
  ctx.clip();
  ctx.strokeStyle = 'rgba(173,196,235,0.35)';
  ctx.lineWidth = 3;
  for (let i = 1; i < 6; i += 1) {
    const y = top + ((H - top) * i) / 6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  for (let i = 0; i <= 10; i += 1) {
    ctx.beginPath();
    ctx.moveTo(150 + ((W - 300) * i) / 10, top);
    ctx.lineTo(-60 + ((W + 120) * i) / 10, H);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = '#121722';
  ctx.font = `800 40px ${body}`;
  ctx.fillText('☀ SOL DE CASA', 90, 140);

  ctx.font = `600 54px ${body}`;
  ctx.fillText(`En ${summary.lastMonth.label} ahorramos`, 90, 380);

  ctx.font = `800 300px ${display}`;
  ctx.fillText(formatUsd(summary.lastMonth.saved), 76, 660);

  ctx.font = `600 54px ${body}`;
  const lead = 'de luz. Ya llevamos ';
  ctx.fillText(lead, 90, 770);
  const leadWidth = ctx.measureText(lead).width; // medido con la misma letra con que se dibujó
  ctx.font = `800 54px ${body}`;
  ctx.fillText(`${formatUsd(summary.total)}.`, 90 + leadWidth, 770);

  ctx.font = `700 38px ${body}`;
  ctx.fillText(`${family.name} · ${family.neighborhood}`, 90, 880);
  ctx.font = `600 34px ${body}`;
  ctx.fillText('¿Cuánto ahorraría usted? Pídame mi link.', 90, 935);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
