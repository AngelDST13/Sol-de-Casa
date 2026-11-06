import styles from './Neighbor.module.css';

const STEPS = [
  { id: 'calculate', label: 'Calcule' },
  { id: 'form', label: 'Sus datos' },
  { id: 'done', label: 'Listo' },
];

export const Stepper = ({ step }) => {
  const current = STEPS.findIndex((item) => item.id === step);
  return (
    <ol className={styles.stepper} aria-label="Pasos">
      {STEPS.map((item, index) => (
        <li
          key={item.id}
          data-state={index < current ? 'done' : index === current ? 'current' : 'next'}
          aria-current={index === current ? 'step' : undefined}
        >
          <span>{index + 1}</span>
          {item.label}
        </li>
      ))}
    </ol>
  );
};
