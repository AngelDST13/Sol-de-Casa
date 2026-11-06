import { Card, ScrollTable } from '../../../shared/components/index.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import styles from './Simulator.module.css';

/** Requisito 3 del nivel 3: comparar al menos cuatro planes. */
export const PlansComparison = ({ simulator }) => {
  const { results, best, setPlanId, planId } = simulator;
  return (
    <Card title="Comparación de planes" eyebrow="Gana la mayor caja del mes 24 que respete las reglas">
      <ScrollTable caption="Comparación de planes a 24 meses">
        <thead>
          <tr>
            <th scope="col">Plan</th>
            <th scope="col">Caja mínima</th>
            <th scope="col">Mes</th>
            <th scope="col">Caja mes 24</th>
            <th scope="col">Instalaciones</th>
            <th scope="col">Reglas</th>
          </tr>
        </thead>
        <tbody>
          {results.map(({ plan, sim }) => (
            <tr key={plan.id} data-highlight={plan.id === planId}>
              <td>
                <button type="button" className={styles.rowButton} onClick={() => setPlanId(plan.id)}>
                  {plan.name}
                </button>
                {best?.plan.id === plan.id && <span className={styles.winner}>Mejor</span>}
              </td>
              <td style={{ color: sim.minCash < 5000 ? 'var(--bad)' : undefined }}>{formatUsd(sim.minCash)}</td>
              <td>{sim.minCashMonth}</td>
              <td>{formatUsd(sim.finalCash)}</td>
              <td>{formatInteger(sim.totalInstalls)}</td>
              <td>
                <span className={styles.rule} data-ok={sim.respectsRules}>
                  {sim.respectsRules ? 'Sí' : 'No'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </ScrollTable>
      <p className={styles.note}>
        Ojo: el plan ganador depende del supuesto 7 (el filtro de Meta). Si el filtro solo bajara los leads y no
        mejorara las tasas, ese mismo plan tocaría el piso. Toque un plan para verlo en los gráficos.
      </p>
    </Card>
  );
};
