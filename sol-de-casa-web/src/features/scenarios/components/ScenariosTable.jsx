import { Card, LtvBadge, ScrollTable } from '../../../shared/components/index.js';
import { formatCount, formatInteger, formatUsd, formatUsdCents } from '../../../shared/utils/format.js';

const ROWS = [
  { label: 'Inversión en Meta', get: (r) => formatUsd(r.meta.investment) },
  { label: 'Inversión en Google', get: (r) => formatUsd(r.google.investment) },
  { label: 'Leads de Meta', get: (r) => formatCount(r.meta.leads) },
  { label: 'Leads de Google', get: (r) => formatCount(r.google.leads) },
  { label: 'Visitas pedidas', get: (r) => formatCount(r.total.requestedVisits) },
  { label: 'Capacidad de visitas', get: (r) => formatInteger(r.capacity) },
  { label: 'Visitas hechas', get: (r) => formatCount(r.total.doneVisits), alert: (r) => r.total.overCapacity },
  { label: 'Ventas de Meta', get: (r) => formatCount(r.meta.sales) },
  { label: 'Ventas de Google', get: (r) => formatCount(r.google.sales) },
  { label: 'Ventas totales', get: (r) => formatCount(r.total.sales), emphasis: true },
  { label: 'CPL de Meta', get: (r) => formatUsdCents(r.meta.cpl) },
  { label: 'CAC de anuncios Meta', get: (r) => formatUsd(r.meta.adsCac) },
  { label: 'CAC real Meta', get: (r) => formatUsd(r.meta.realCac) },
  { label: 'CAC real Google', get: (r) => (r.google.sales ? formatUsd(r.google.realCac) : '—') },
  { label: 'CAC real total', get: (r) => formatUsd(r.total.realCac), emphasis: true },
  { label: 'LTV:CAC Meta', get: (r) => <LtvBadge ratio={r.meta.ltvCac} /> },
  { label: 'LTV:CAC Google', get: (r) => <LtvBadge ratio={r.google.ltvCac} /> },
  { label: 'LTV:CAC total', get: (r) => <LtvBadge ratio={r.total.ltvCac} /> },
  { label: 'Valor de una visita Meta', get: (r) => formatUsdCents(r.meta.visitValue) },
  { label: 'Resultado del mes', get: (r) => formatUsd(r.total.monthlyResult), emphasis: true },
];

/** Requisito 2 del nivel 1: tres (aquí cuatro) escenarios lado a lado. */
export const ScenariosTable = ({ scenarios }) => (
  <Card title="Escenarios lado a lado" eyebrow="Mes estable">
    <ScrollTable caption="Comparación de escenarios">
      <thead>
        <tr>
          <th scope="col">Concepto</th>
          {scenarios.map((scenario) => (
            <th scope="col" key={scenario.id}>
              {scenario.name}
              <br />
              <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>{scenario.note}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.label} data-emphasis={row.emphasis}>
            <td>{row.label}</td>
            {scenarios.map((scenario) => (
              <td
                key={scenario.id}
                style={row.alert?.(scenario.result) ? { color: 'var(--bad)', fontWeight: 800 } : undefined}
              >
                {row.get(scenario.result)}
                {row.alert?.(scenario.result) && ' ⚠'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </ScrollTable>
    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 12 }}>
      ⚠ = visitas pedidas por encima de la capacidad (se hacen primero las de Google). «Nuestros 2 cambios» usa el
      supuesto 7 (no medido) y un técnico extra ya capacitado. Resultado del mes = ventas × contribución − anuncios −
      visitas − $18.000 fijos − técnicos.
    </p>
  </Card>
);
