// Formato de la región del caso: punto de miles y coma decimal ($6.500 · 12,5 %).
const LOCALE = 'de-DE';

const integer = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const twoDecimals = new Intl.NumberFormat(LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const sign = (value) => (value < 0 ? '−' : '');

export const formatUsd = (value) => `${sign(value)}$${integer.format(Math.abs(value))}`;
export const formatUsdCents = (value) => `${sign(value)}$${twoDecimals.format(Math.abs(value))}`;
export const formatCount = (value) => oneDecimal.format(value);
export const formatInteger = (value) => integer.format(value);
export const formatPercent = (value, decimals = 0) =>
  `${decimals ? oneDecimal.format(value) : integer.format(value)} %`;
export const formatRatio = (value) => `${twoDecimals.format(value)}x`;

/** Compacta montos grandes para ejes de gráficos: $677k. */
export const formatUsdShort = (value) =>
  Math.abs(value) >= 1000 ? `${sign(value)}$${integer.format(Math.abs(value) / 1000)}k` : formatUsd(value);
