import { useNeighborFlow } from '../hooks/useNeighborFlow.js';
import { NeighborHero } from './NeighborHero.jsx';
import { SavingsCalculator } from './SavingsCalculator.jsx';
import { ScheduleForm } from './ScheduleForm.jsx';
import { Confirmation } from './Confirmation.jsx';
import { Stepper } from './Stepper.jsx';
import styles from './Neighbor.module.css';

/** La página del vecino (y de cualquiera que quiera agendar). Arranca por lo que prometió el mensaje. */
export const NeighborPage = () => {
  const flow = useNeighborFlow();

  return (
    <div className={styles.page}>
      <Stepper step={flow.step} />
      {flow.step === 'done' ? (
        <Confirmation saved={flow.saved} referrer={flow.referrer} result={flow.result} />
      ) : (
        <>
          <NeighborHero referrer={flow.referrer} />
          <SavingsCalculator flow={flow} />
          {flow.step === 'form' && <ScheduleForm flow={flow} />}
        </>
      )}
    </div>
  );
};
