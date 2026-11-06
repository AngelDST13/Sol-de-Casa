import { setTheme } from '../../services/preferencesService.js';
import { usePreferences } from '../hooks/usePreferences.js';
import styles from './ThemeToggle.module.css';

const OPTIONS = [
  { id: 'light', label: 'Claro', icon: '☀' },
  { id: 'dark', label: 'Oscuro', icon: '☾' },
  { id: 'system', label: 'Sistema', icon: '◐' },
];

/** Tema claro, oscuro o el del sistema. `tone="night"` para fondos oscuros. */
export const ThemeToggle = ({ tone = 'default' }) => {
  const { theme } = usePreferences();
  return (
    <div className={styles.toggle} data-tone={tone} role="radiogroup" aria-label="Tema de la pantalla">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={theme === option.id}
          onClick={() => setTheme(option.id)}
          title={option.label}
        >
          <span aria-hidden="true">{option.icon}</span>
          <span className={styles.label}>{option.label}</span>
        </button>
      ))}
    </div>
  );
};
