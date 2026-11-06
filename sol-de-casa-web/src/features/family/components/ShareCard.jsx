import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addShare } from '../../../services/leadsService.js';
import { buildShareUrl } from '../../../shared/utils/shareUrl.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Family.module.css';

/** La tarjeta del ahorro, lista para WhatsApp, con el link personal de la familia. */
export const ShareCard = ({ family, summary }) => {
  const [copied, setCopied] = useState(false);
  const path = `/r/${family.code}`;
  const link = buildShareUrl(path);
  const message = `En ${summary.lastMonth.label} ahorramos ${formatUsd(summary.lastMonth.saved)} de luz con los paneles de Sol de Casa, y ya llevamos ${formatUsd(summary.total)}. Calcule cuánto ahorraría usted: ${link}`;
  const canShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  const share = async () => {
    addShare({ refCode: family.code, channel: 'native' });
    try {
      await navigator.share({ title: 'Mi ahorro con Sol de Casa', text: message });
    } catch {
      // La persona cerró el menú de compartir.
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      addShare({ refCode: family.code, channel: 'link' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className={styles.shareLayout}>
      <figure className={styles.shareCard} aria-label="Tarjeta del ahorro">
        <span className={styles.shareBrand}>☀ Sol de Casa</span>
        <p className={styles.shareLine}>En {summary.lastMonth.label} ahorramos</p>
        <p className={styles.shareAmount}>{formatUsd(summary.lastMonth.saved)}</p>
        <p className={styles.shareLine}>
          de luz. Ya llevamos <strong>{formatUsd(summary.total)}</strong>.
        </p>
        <figcaption className={styles.shareFoot}>
          {family.name} · {family.neighborhood} · ¿Cuánto ahorraría usted?
        </figcaption>
      </figure>

      <div className={styles.shareSide}>
        <div className={styles.shareActions}>
          <a
            className={styles.whatsapp}
            href={`https://wa.me/?text=${encodeURIComponent(message)}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => addShare({ refCode: family.code, channel: 'whatsapp' })}
          >
            Mandar por WhatsApp
          </a>
          {canShare && (
            <button type="button" className={styles.secondary} onClick={share}>
              Publicar o compartir
            </button>
          )}
          <button type="button" className={styles.secondary} onClick={copy}>
            {copied ? 'Link copiado ✓' : 'Copiar mi link'}
          </button>
        </div>
        <p className={styles.note}>
          Su link personal: <code className={styles.code}>{link}</code>
        </p>
        <p className={styles.note}>
          Cuando su vecino agenda desde ese link, queda registrado que usted lo refirió y gana un mes de mantenimiento.
        </p>
        <Link to={path} className={styles.textLink}>
          Ver lo que ve su vecino →
        </Link>
      </div>
    </section>
  );
};
