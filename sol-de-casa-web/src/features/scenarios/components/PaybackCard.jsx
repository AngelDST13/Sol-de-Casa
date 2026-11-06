import { Card, ScrollTable } from '../../../shared/components/index.js';
import { cashPayback } from '../../../shared/model/index.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Scenarios.module.css';

/** Pregunta 4: el payback en caja de un cliente, mes a mes. */
export const PaybackCard = ({ params, result }) => {
  const meta = cashPayback(params, result.meta.realCac);
  const google = cashPayback(params, result.google.realCac);
  const rows = [
    { label: 'CAC real (se paga antes de la firma)', meta: -meta.realCac, google: -google.realCac },
    { label: 'Mes de la firma: entra el 50 %', meta: meta.signingIn, google: google.signingIn },
    { label: 'Mes de la firma: equipos y comisión', meta: -meta.signingOut, google: -google.signingOut },
    {
      label: 'Caja al cierre del mes de la firma',
      meta: meta.afterSigning,
      google: google.afterSigning,
      emphasis: true,
    },
    { label: 'Mes siguiente: entra el otro 50 %', meta: meta.nextIn, google: google.nextIn },
    { label: 'Mes siguiente: instalación', meta: -meta.nextOut, google: -google.nextOut },
    {
      label: 'Caja al cierre del mes siguiente',
      meta: meta.afterNextMonth,
      google: google.afterNextMonth,
      emphasis: true,
    },
  ];

  return (
    <Card title="¿En qué mes se recupera un cliente?" eyebrow="Pregunta 4 · Payback en caja">
      <ScrollTable caption="Payback en caja por canal" compact>
        <thead>
          <tr>
            <th scope="col">Escenario de hoy</th>
            <th scope="col" className="meta-text">
              Meta
            </th>
            <th scope="col" className="google-text">
              Google
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} data-emphasis={row.emphasis}>
              <td>{row.label}</td>
              <td style={{ color: row.emphasis && row.meta < 0 ? 'var(--bad)' : undefined }}>{formatUsd(row.meta)}</td>
              <td style={{ color: row.emphasis && row.google < 0 ? 'var(--bad)' : undefined }}>
                {formatUsd(row.google)}
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>
      <p className={styles.note}>
        Los dos canales dejan plata (LTV:CAC mayor a 1), pero el mes de la firma la caja queda en rojo: los equipos se
        pagan el mismo día. Meta se recupera {meta.recoveredIn}; Google, {google.recoveredIn}. Por eso crecer rápido
        aprieta la caja.
      </p>
    </Card>
  );
};
