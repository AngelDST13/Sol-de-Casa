import styles from './Simulator.module.css';

export const PlanPicker = ({ simulator }) => {
  const { results, planId, setPlanId, selected } = simulator;
  return (
    <div>
      <div className={styles.chips} role="group" aria-label="Elegir plan">
        {results.map(({ plan }) => (
          <button
            key={plan.id}
            type="button"
            className={styles.chip}
            aria-pressed={plan.id === planId}
            onClick={() => setPlanId(plan.id)}
          >
            {plan.name}
          </button>
        ))}
      </div>
      <p className={styles.planNote}>{selected.plan.description}</p>
    </div>
  );
};
