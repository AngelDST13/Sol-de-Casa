import { openCookieSettings } from '../../../services/preferencesService.js';
import { usePreferences } from '../../../shared/hooks/usePreferences.js';
import styles from './Privacy.module.css';

const STORED = [
  ['Sesión', 'Recuerda que usted entró, para no pedirle la contraseña en cada página.', 'Necesaria'],
  [
    'Cuenta y solicitudes',
    'Su cuenta, su ahorro y las solicitudes de visita (en este prototipo, solo en su navegador).',
    'Necesaria',
  ],
  ['Preferencias', 'El tema claro u oscuro y su decisión sobre cookies.', 'Necesaria'],
  ['Medición', 'Cuántas veces se abre un link compartido y se usa la calculadora.', 'Opcional'],
];

export const PrivacyPage = () => {
  const { consent } = usePreferences();
  return (
    <article className={`container ${styles.page}`}>
      <p className={styles.eyebrow}>Privacidad y cookies</p>
      <h1>Qué guardamos y para qué.</h1>
      <p className={styles.lead}>
        Sol de Casa no usa cookies de publicidad ni vende datos. Guardamos lo mínimo para que el sitio funcione y, si
        usted lo permite, medimos el uso de la calculadora para mejorarla.
      </p>

      <div className={styles.table}>
        {STORED.map(([name, purpose, kind]) => (
          <div key={name} className={styles.row}>
            <strong>{name}</strong>
            <span>{purpose}</span>
            <em data-kind={kind}>{kind}</em>
          </div>
        ))}
      </div>

      <h2>Servicios de terceros</h2>
      <p>
        Las tipografías se cargan desde Google Fonts, que recibe la dirección IP del navegador al descargarlas. Los
        botones de WhatsApp abren WhatsApp con el mensaje que usted decide mandar.
      </p>

      <h2>Su decisión</h2>
      <p>
        {consent
          ? `Usted eligió ${consent.measurement ? 'aceptar la medición' : 'solo las cookies necesarias'}.`
          : 'Todavía no ha decidido sobre la medición; mientras tanto no medimos nada.'}
      </p>
      <button type="button" className={styles.button} onClick={openCookieSettings}>
        Cambiar mis preferencias
      </button>

      <p className={styles.note}>
        Prototipo con fines educativos (Caso C). En un sitio real, esta página la revisa un abogado y nombra al
        responsable de los datos y cómo contactarlo.
      </p>
    </article>
  );
};
