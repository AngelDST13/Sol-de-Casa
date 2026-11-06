import styles from './Logo.module.css';

/** Marca de Sol de Casa: medio sol que sale detrás de un panel. */
export const Logo = ({ tone = 'ink', compact = false }) => (
  <span className={styles.logo} data-tone={tone}>
    <svg className={styles.mark} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="17" r="9" fill="#F4B000" />
      <g stroke="#F4B000" strokeWidth="2.4" strokeLinecap="round">
        <path d="M20 2.5v3.5M7.2 7.6l2.5 2.5M32.8 7.6l-2.5 2.5M2.8 17h3.4M33.8 17h3.4" />
      </g>
      <path d="M4 25.5h32l-3 11.5H7z" fill="currentColor" />
      <path
        d="M13.5 25.5l-1.6 11.5M20 25.5v11.5M26.5 25.5l1.6 11.5M5.6 31.2h28.8"
        stroke="var(--logo-cut)"
        strokeWidth="1.3"
      />
    </svg>
    {!compact && (
      <span className={styles.word}>
        Sol de Casa
        <small>Paneles solares</small>
      </span>
    )}
  </span>
);
