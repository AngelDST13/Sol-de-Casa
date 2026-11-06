import { Card, ScrollTable } from '../../../shared/components/index.js';
import { DEFAULT_PARAMS, PRESET_PLANS, simulatePlan } from '../../../shared/model/index.js';
import { formatUsdCents } from '../../../shared/utils/format.js';
import styles from './Simulator.module.css';

// Siempre con los datos del caso: es la revisión que el facilitador compara con su modelo.
const actualPlan = PRESET_PLANS.find((plan) => plan.id === 'actual');
const month1 = simulatePlan(DEFAULT_PARAMS, actualPlan).rows[0];
const d = month1.detail;

const LINES = [
  { label: 'Leads de Meta', formula: '$4.000 → historial', hand: 500, model: d.meta.leads },
  { label: 'Leads de Google', formula: '$4.000 → historial', hand: 100, model: d.google.leads },
  { label: 'Visitas pedidas Meta', formula: '500 × 0,55 × 0,30 × 0,70', hand: 57.75, model: d.meta.requestedVisits },
  {
    label: 'Visitas pedidas Google',
    formula: '100 × 0,85 × 0,55 × 0,85',
    hand: 39.7375,
    model: d.google.requestedVisits,
  },
  { label: 'Visitas hechas', formula: '57,75 + 39,7375 (caben en 100)', hand: 97.4875, model: month1.doneVisits },
  { label: 'Ventas del mes 1', formula: '57,75 × 0,18 + 39,7375 × 0,30', hand: 22.31625, model: month1.sales },
  { label: 'Entradas', formula: '3.250 × (22,31625 + 22)', hand: 144027.81, model: month1.entries },
  { label: 'Equipos + comisión', formula: '3.770 × 22,31625', hand: 84132.26, model: 3770 * month1.sales },
  { label: 'Instalación (ventas del mes 0)', formula: '1.105 × 22', hand: 24310, model: 1105 * 22 },
  { label: 'Visitas', formula: '60 × 97,4875', hand: 5849.25, model: 60 * month1.doneVisits },
  { label: 'Anuncios + fijos', formula: '8.000 + 18.000', hand: 26000, model: 26000 },
  { label: 'Salidas', formula: '84.132,26 + 24.310 + 5.849,25 + 26.000', hand: 140291.51, model: month1.outflows },
  {
    label: 'Caja final del mes 1',
    formula: '12.000 + 144.027,81 − 140.291,51',
    hand: 15736.3,
    model: month1.cash,
    emphasis: true,
  },
];

const formatPlain = (value) => formatUsdCents(value).replace('$', '');

/** Requisito 2 del nivel 3: mes 1 del plan actual con cada cuenta a la vista. */
export const Month1Check = () => (
  <Card title="Revisión del mes 1, a mano" eyebrow="Plan actual · datos del caso">
    <ScrollTable caption="Verificación del mes 1" compact>
      <thead>
        <tr>
          <th scope="col">Concepto</th>
          <th scope="col">Cuenta escrita</th>
          <th scope="col">A mano</th>
          <th scope="col">Modelo</th>
          <th scope="col">Diferencia</th>
        </tr>
      </thead>
      <tbody>
        {LINES.map((line) => (
          <tr key={line.label} data-emphasis={line.emphasis}>
            <td>{line.label}</td>
            <td style={{ textAlign: 'left' }}>{line.formula}</td>
            <td>{formatPlain(line.hand)}</td>
            <td>{formatPlain(line.model)}</td>
            <td>{formatPlain(line.model - line.hand)}</td>
          </tr>
        ))}
      </tbody>
    </ScrollTable>
    <p className={styles.note}>
      Las diferencias de centavos vienen de redondear a mano. Coincide con la hoja «Verificacion_Mes1» del Excel.
    </p>
  </Card>
);
