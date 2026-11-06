import { useMyFamily } from '../hooks/useMyFamily.js';
import { ShareCard } from './ShareCard.jsx';
import styles from './Family.module.css';

export const SharePage = () => {
  const { family, summary } = useMyFamily();
  return (
    <div className={styles.page}>
      <header className={styles.greeting}>
        <p>Compartir</p>
        <h1>Muéstrele a su vecino lo que ahorra.</h1>
      </header>
      <ShareCard family={family} summary={summary} />
    </div>
  );
};
