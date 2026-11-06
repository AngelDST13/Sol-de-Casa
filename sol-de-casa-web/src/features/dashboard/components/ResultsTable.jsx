import { Card, LtvBadge, ScrollTable } from '../../../shared/components/index.js';
import { formatCount, formatInteger, formatUsd, formatUsdCents } from '../../../shared/utils/format.js';

const rowsFor = ({ meta, google, total, capacity }) => [
  {
    label: 'Inversión en anuncios',
    meta: formatUsd(meta.investment),
    google: formatUsd(google.investment),
    total: formatUsd(total.investment),
  },
  { label: 'Leads', meta: formatCount(meta.leads), google: formatCount(google.leads), total: formatCount(total.leads) },
  {
    label: 'Visitas pedidas',
    meta: formatCount(meta.requestedVisits),
    google: formatCount(google.requestedVisits),
    total: formatCount(total.requestedVisits),
  },
  {
    label: 'Visitas hechas',
    meta: formatCount(meta.doneVisits),
    google: formatCount(google.doneVisits),
    total: formatCount(total.doneVisits),
  },
  {
    label: 'Ventas (instalaciones)',
    meta: formatCount(meta.sales),
    google: formatCount(google.sales),
    total: formatCount(total.sales),
    emphasis: true,
  },
  { label: 'CPL (costo por lead)', meta: formatUsdCents(meta.cpl), google: formatUsdCents(google.cpl), total: '—' },
  { label: 'CAC de anuncios', meta: formatUsd(meta.adsCac), google: formatUsd(google.adsCac), total: '—' },
  {
    label: 'CAC real (anuncios + visitas)',
    meta: formatUsd(meta.realCac),
    google: formatUsd(google.realCac),
    total: formatUsd(total.realCac),
    emphasis: true,
  },
  {
    label: 'LTV:CAC',
    meta: <LtvBadge ratio={meta.ltvCac} />,
    google: <LtvBadge ratio={google.ltvCac} />,
    total: <LtvBadge ratio={total.ltvCac} />,
  },
  {
    label: 'Visitas por venta',
    meta: formatCount(meta.visitsPerSale),
    google: formatCount(google.visitsPerSale),
    total: '—',
  },
  {
    label: 'Valor de una visita',
    meta: formatUsdCents(meta.visitValue),
    google: formatUsdCents(google.visitValue),
    total: '—',
  },
  {
    label: 'Visitas usadas / capacidad',
    meta: '',
    google: '',
    total: `${formatCount(total.doneVisits)} / ${formatInteger(capacity)}`,
  },
  {
    label: 'Resultado del mes (después de fijos)',
    meta: '',
    google: '',
    total: formatUsd(total.monthlyResult),
    emphasis: true,
  },
];

/** Requisito 1 del nivel 2: todas las métricas por canal y en total. */
export const ResultsTable = ({ result }) => (
  <Card title="Resultados del mes" eyebrow="Por canal y en total">
    <ScrollTable caption="Resultados del mes por canal">
      <thead>
        <tr>
          <th scope="col">Métrica</th>
          <th scope="col" className="meta-text">
            Meta
          </th>
          <th scope="col" className="google-text">
            Google
          </th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {rowsFor(result).map((row) => (
          <tr key={row.label} data-emphasis={row.emphasis}>
            <td>{row.label}</td>
            <td>{row.meta}</td>
            <td>{row.google}</td>
            <td>{row.total}</td>
          </tr>
        ))}
      </tbody>
    </ScrollTable>
    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 12 }}>
      Contribución por venta: {formatUsd(result.contribution)} (precio × margen − comisión). LTV:CAC = contribución /
      CAC real, porque el cliente compra una sola vez. Valor de una visita = cierre × contribución − costo de la visita.
      Semáforo: verde 3 o más, amarillo de 1 a 3, rojo menos de 1.
    </p>
  </Card>
);
