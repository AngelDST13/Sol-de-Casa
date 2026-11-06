import { LEAD_SOURCES, LEAD_STATUSES } from '../../services/leadsService.js';
import styles from './StatusBadge.module.css';

export const StatusBadge = ({ status }) => {
  const meta = LEAD_STATUSES.find((item) => item.id === status);
  return (
    <span className={styles.badge} data-status={status} title={meta?.hint}>
      {meta?.label ?? status}
    </span>
  );
};

export const SourceTag = ({ source }) => (
  <span className={styles.source} data-source={source}>
    {LEAD_SOURCES[source] ?? source}
  </span>
);
