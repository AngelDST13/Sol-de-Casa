import { Card, ScrollTable } from '../../../shared/components/index.js';
import { REFERRAL_SALE_MAX_COST, referralSaleCost } from '../../../shared/model/index.js';
import { formatCount, formatUsd, formatUsdCents } from '../../../shared/utils/format.js';
import styles from './GrowthSheet.module.css';

/** Pregunta 2: tabla de recompensas con su costo por venta referida. */
export const RewardsTable = () => {
  const cost = referralSaleCost();
  return (
    <Card title="Tabla de recompensas" eyebrow="Pregunta 2 · Regla de Andrés: menos de $300 por venta">
      <ScrollTable caption="Costo de las recompensas por venta referida">
        <thead>
          <tr>
            <th scope="col">Recompensa</th>
            <th scope="col">Para</th>
            <th scope="col">Cuándo</th>
            <th scope="col">Costo</th>
            <th scope="col">Veces por venta</th>
            <th scope="col">Costo por venta</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Visitas técnicas ($60 c/u)</td>
            <td>—</td>
            <td>Cierra el 45 %</td>
            <td>$60</td>
            <td>{formatCount(cost.visitsPerSale)}</td>
            <td>{formatUsdCents(cost.visitsCost)}</td>
          </tr>
          {cost.rewardLines.map((line) => (
            <tr key={line.id}>
              <td>{line.reward}</td>
              <td>{line.who}</td>
              <td>{line.when}</td>
              <td>{formatUsd(line.cost)}</td>
              <td>{formatCount(line.timesPerSale)}</td>
              <td>{formatUsdCents(line.costPerSale)}</td>
            </tr>
          ))}
          <tr data-emphasis="true">
            <td>Total por venta referida</td>
            <td />
            <td />
            <td />
            <td />
            <td style={{ color: cost.withinRule ? 'var(--good)' : 'var(--bad)' }}>{formatUsdCents(cost.totalCost)}</td>
          </tr>
        </tbody>
      </ScrollTable>
      <p className={styles.small}>
        Una venta referida pide {formatCount(cost.visitsPerSale)} visitas ({formatUsdCents(cost.visitsCost)}), así que
        quedan {formatUsdCents(cost.rewardBudget)} para premios. Los premios usan {formatUsdCents(cost.rewardsCost)} y
        sobran {formatUsdCents(cost.headroom)} de margen hasta los {formatUsd(REFERRAL_SALE_MAX_COST)}. El premio por
        agenda se paga {formatCount(cost.schedulesPerSale)} veces por venta, porque no todas las agendas firman.
      </p>
    </Card>
  );
};
