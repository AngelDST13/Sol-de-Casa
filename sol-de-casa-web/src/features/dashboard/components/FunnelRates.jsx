import { RangeField } from '../../../shared/components/index.js';
import { formatPercent } from '../../../shared/utils/format.js';

const STEPS = [
  { key: 'contact', label: 'Leads que se logra contactar' },
  { key: 'schedule', label: 'Contactados que agendan visita' },
  { key: 'visit', label: 'Visitas agendadas que se hacen' },
  { key: 'close', label: 'Visitas que terminan en venta' },
];

export const FunnelRates = ({ rates, onChange }) =>
  STEPS.map((step) => (
    <RangeField
      key={step.key}
      label={step.label}
      value={rates[step.key]}
      min={0}
      max={100}
      format={formatPercent}
      onChange={(value) => onChange(step.key, value)}
    />
  ));
