import { useState } from 'react';
import { Link } from 'react-router-dom';
import { closeCookieSettings, saveConsent } from '../../services/preferencesService.js';
import { usePreferences } from '../hooks/usePreferences.js';
import { Dialog } from './Dialog.jsx';
import styles from './CookieBanner.module.css';

/**
 * Aviso de cookies sin trampas: «Aceptar» y «Solo necesarias» pesan lo mismo, nada viene marcado
 * de antemano y la decisión se puede cambiar desde el pie de página.
 */
export const CookieBanner = () => {
  const { consent, cookieSettingsOpen } = usePreferences();
  const [customizing, setCustomizing] = useState(false);
  const showBanner = !consent && !customizing;

  return (
    <>
      {showBanner && (
        <section className={styles.banner} aria-label="Aviso de cookies">
          <div className={styles.text}>
            <strong>Usamos cookies y almacenamiento local</strong>
            <p>
              Las necesarias guardan su sesión y sus solicitudes. Con su permiso, también medimos cuántas personas usan
              la calculadora, sin anuncios ni terceros. <Link to="/privacidad">Más información</Link>
            </p>
          </div>
          <div className={styles.actions}>
            <button type="button" onClick={() => saveConsent({ measurement: false })}>
              Solo necesarias
            </button>
            <button type="button" onClick={() => saveConsent({ measurement: true })}>
              Aceptar todas
            </button>
            <button type="button" className={styles.link} onClick={() => setCustomizing(true)}>
              Configurar
            </button>
          </div>
        </section>
      )}
      <CookieSettings
        open={customizing || cookieSettingsOpen}
        initial={consent?.measurement ?? false}
        onClose={() => {
          setCustomizing(false);
          closeCookieSettings();
        }}
      />
    </>
  );
};

const CookieSettings = ({ open, initial, onClose }) => {
  const [measurement, setMeasurement] = useState(initial);
  return (
    <Dialog open={open} onClose={onClose} title="Preferencias de cookies" size="sm">
      <div className={styles.option}>
        <div>
          <strong>Necesarias</strong>
          <p>Sesión, cuentas, solicitudes y estas preferencias. Sin ellas el sitio no funciona.</p>
        </div>
        <span className={styles.always}>Siempre activas</span>
      </div>
      <label className={styles.option}>
        <div>
          <strong>Medición</strong>
          <p>Cuenta cuántos vecinos abren un link compartido y usan la calculadora. No se comparte con nadie.</p>
        </div>
        <input type="checkbox" checked={measurement} onChange={(event) => setMeasurement(event.target.checked)} />
      </label>
      <div className={styles.actions}>
        <button type="button" onClick={() => saveConsent({ measurement: false }) || onClose()}>
          Solo necesarias
        </button>
        <button type="button" onClick={() => saveConsent({ measurement }) || onClose()}>
          Guardar
        </button>
      </div>
    </Dialog>
  );
};
