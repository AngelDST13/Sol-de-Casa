import { Alert } from '../../../shared/components/index.js';
import { formatCount, formatInteger, formatPercent } from '../../../shared/utils/format.js';

/** Requisito 3 del nivel 2: alerta cuando las visitas pedidas pasan la capacidad. */
export const CapacityStatus = ({ result }) => {
  const { total, capacity } = result;
  if (!total.overCapacity) {
    return (
      <Alert tone="good">
        Capacidad OK: {formatCount(total.requestedVisits)} visitas pedidas de {formatInteger(capacity)} posibles (
        {formatPercent(total.capacityUse * 100)} de uso).
      </Alert>
    );
  }
  return (
    <Alert tone="bad">
      Sobre capacidad: se piden {formatCount(total.requestedVisits)} visitas y solo caben {formatInteger(capacity)}. Se
      pierden {formatCount(total.lostVisits)} visitas de Meta (primero se hacen las de Google, que cierran más).
    </Alert>
  );
};
