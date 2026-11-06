/** Arma un CSV (separado por punto y coma, como lo abre Excel en español) y lo descarga. */
const cell = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[";\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const toCsv = (rows, columns) =>
  [
    columns.map((column) => cell(column.label)).join(';'),
    ...rows.map((row) => columns.map((column) => cell(column.value(row))).join(';')),
  ].join('\r\n');

export const downloadCsv = (filename, csv) => {
  // El BOM hace que Excel reconozca las tildes.
  const blob = new Blob(['﻿', csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
