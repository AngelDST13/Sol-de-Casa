import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { PageHeader, StatTile } from '../../../shared/components/index.js';
import { useLeads } from '../../../shared/hooks/useLeads.js';
import { useUsers } from '../../../shared/hooks/useStores.js';
import { downloadCsv, toCsv } from '../../../shared/utils/csv.js';
import { formatInteger, formatPercent, formatUsd } from '../../../shared/utils/format.js';
import { leadColumns } from '../../crm/leadsCsv.js';
import { PERIODS, useReport } from '../useReport.js';
import admin from '../../../shared/components/admin.module.css';
import styles from './Reports.module.css';

const BreakdownTable = ({ title, rows }) => (
  <section className={styles.card}>
    <h2>{title}</h2>
    <div className={admin.tableWrap} style={{ border: 0 }}>
      <table className={admin.table}>
        <thead>
          <tr>
            <th scope="col"> </th>
            <th scope="col" className="num">
              Solicitudes
            </th>
            <th scope="col" className="num">
              Firmaron
            </th>
            <th scope="col" className="num">
              Conversión
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.label}</td>
              <td className="num">{formatInteger(row.total)}</td>
              <td className="num">{formatInteger(row.signed)}</td>
              <td className="num">{formatPercent(row.conversion)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

/** Reporte de ventas y embudo con los datos reales del CRM. */
export const ReportsPage = () => {
  const leads = useLeads();
  const users = useUsers();
  const [days, setDays] = useState(30);
  const report = useReport(leads, users, days);
  const top = Math.max(1, report.funnel[0].count);
  const nameOf = (id) => users.find((item) => item.id === id)?.name ?? '';

  return (
    <>
      <PageHeader level="Crecimiento" title="Reportes">
        Cuántas solicitudes llegan, dónde se caen y qué canal y qué asesora cierran más. Sale de las solicitudes del
        CRM.
      </PageHeader>

      <div className={admin.toolbar}>
        <div className={admin.chips} style={{ margin: 0 }} role="group" aria-label="Período">
          {PERIODS.map((period) => (
            <button
              key={period.id}
              type="button"
              className={admin.chip}
              aria-pressed={days === period.id}
              onClick={() => setDays(period.id)}
            >
              {period.label}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          onClick={() =>
            downloadCsv(`reporte-sol-de-casa-${days || 'todo'}.csv`, toCsv(report.inPeriod, leadColumns(nameOf)))
          }
        >
          Exportar CSV
        </Button>
      </div>

      <div className={styles.kpis}>
        <StatTile label="Solicitudes" value={formatInteger(report.inPeriod.length)} />
        <StatTile label="Firmaron" value={formatInteger(report.signed)} tone="good" />
        <StatTile label="Cierre de visitas" value={formatPercent(report.closeRate)} detail="Firmas / visitas hechas" />
        <StatTile
          label="Ventas"
          value={formatUsd(report.revenue)}
          detail={`Contribución ${formatUsd(report.contribution)}`}
        />
      </div>

      <section className={styles.card}>
        <h2>Embudo del período</h2>
        <ol className={styles.funnel}>
          {report.funnel.map((step, index) => {
            const previous = index ? report.funnel[index - 1].count : null;
            return (
              <li key={step.id}>
                <span className={styles.label}>{step.label}</span>
                <span className={styles.bar}>
                  <span style={{ width: `${Math.max((step.count / top) * 100, 2)}%` }} />
                </span>
                <strong className="num">{formatInteger(step.count)}</strong>
                <small className="num">
                  {previous !== null ? formatPercent((step.count / Math.max(previous, 1)) * 100) : ''}
                </small>
              </li>
            );
          })}
        </ol>
        <p className={admin.muted}>
          Perdidas en el período: {formatInteger(report.lost)}. El porcentaje de la derecha es cuántos pasan del paso
          anterior. Ventas a $6.500 promedio; contribución de $1.625 por venta.
        </p>
      </section>

      <div className={styles.grid}>
        <BreakdownTable title="Por canal" rows={report.bySource} />
        <BreakdownTable title="Por asesora" rows={report.byAdvisor} />
      </div>
    </>
  );
};
