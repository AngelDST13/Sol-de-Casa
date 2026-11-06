import { Card, ScrollTable } from '../../../shared/components/index.js';
import { formatCount, formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './Simulator.module.css';

/** Requisito 1 del nivel 3: una fila por mes con la alerta de caja. */
export const MonthlyTable = ({ entry }) => (
  <Card title={`Mes a mes · ${entry.plan.name}`} eyebrow="24 meses">
    <ScrollTable caption="Simulación mes a mes" compact>
      <thead>
        <tr>
          <th scope="col">Mes</th>
          <th scope="col">Meta</th>
          <th scope="col">Google</th>
          <th scope="col">Técnicos</th>
          <th scope="col">Filtro</th>
          <th scope="col">Leads</th>
          <th scope="col">Pedidas</th>
          <th scope="col">Capacidad</th>
          <th scope="col">Hechas</th>
          <th scope="col">Ventas</th>
          <th scope="col">Entradas</th>
          <th scope="col">Salidas</th>
          <th scope="col">Caja final</th>
          <th scope="col">Alerta</th>
        </tr>
      </thead>
      <tbody>
        {entry.sim.rows.map((row) => (
          <tr key={row.month} data-alert={row.belowFloor || row.investmentDrop}>
            <td>{row.month}</td>
            <td>{formatUsd(row.metaInvestment)}</td>
            <td>{formatUsd(row.googleInvestment)}</td>
            <td>{formatInteger(row.paidTechs)}</td>
            <td>{row.filterOn ? 'Sí' : 'No'}</td>
            <td>{formatCount(row.metaLeads + row.googleLeads)}</td>
            <td>{formatCount(row.requestedVisits)}</td>
            <td>{formatInteger(row.capacity)}</td>
            <td>{formatCount(row.doneVisits)}</td>
            <td>{formatCount(row.sales)}</td>
            <td>{formatUsd(row.entries)}</td>
            <td>{formatUsd(row.outflows)}</td>
            <td style={{ fontWeight: 800 }}>{formatUsd(row.cash)}</td>
            <td>{row.belowFloor ? 'Caja bajo el piso' : row.investmentDrop ? 'Inversión baja' : ''}</td>
          </tr>
        ))}
      </tbody>
    </ScrollTable>
    <p className={styles.note}>
      Entradas = 50 % del precio × (ventas del mes + ventas del mes anterior). Salidas = equipos y comisión de las
      ventas del mes + instalación de las del mes anterior + $60 por visita + anuncios + $18.000 fijos + $1.800 por
      técnico.
    </p>
  </Card>
);
