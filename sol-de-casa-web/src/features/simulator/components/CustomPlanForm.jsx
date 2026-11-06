import { Card, RangeField } from '../../../shared/components/index.js';
import { GOOGLE_MAX_INVESTMENT, META_MAX_INVESTMENT } from '../../../shared/model/index.js';
import { formatUsd } from '../../../shared/utils/format.js';
import styles from './Simulator.module.css';

const monthLabel = (value) => (value === 0 ? 'Nunca' : `Mes ${value}`);

export const CustomPlanForm = ({ simulator }) => {
  const { custom, updateCustom } = simulator;
  return (
    <Card title="Su plan" eyebrow="Personalizado" style={{ marginTop: 'var(--space-3)' }}>
      <div className={styles.formGrid}>
        <RangeField
          label="Meta, todos los meses"
          value={custom.meta}
          min={0}
          max={META_MAX_INVESTMENT}
          step={250}
          format={formatUsd}
          onChange={(v) => updateCustom('meta', v)}
        />
        <RangeField
          label="Google, todos los meses"
          value={custom.google}
          min={0}
          max={GOOGLE_MAX_INVESTMENT}
          step={250}
          format={formatUsd}
          onChange={(v) => updateCustom('google', v)}
        />
        <RangeField
          label="Filtro de Meta desde"
          value={custom.filterFrom}
          min={0}
          max={24}
          format={monthLabel}
          onChange={(v) => updateCustom('filterFrom', v)}
          hint="Supuesto 7: leads −20 % y tasas 80 / 40 / 75 / 22 %."
        />
        <RangeField
          label="Primer técnico extra"
          value={custom.firstHire}
          min={0}
          max={24}
          format={monthLabel}
          onChange={(v) => updateCustom('firstHire', v)}
          hint="Se paga desde ese mes y suma 50 visitas desde el siguiente."
        />
        <RangeField
          label="Segundo técnico extra"
          value={custom.secondHire}
          min={0}
          max={24}
          format={monthLabel}
          onChange={(v) => updateCustom('secondHire', v)}
        />
      </div>
    </Card>
  );
};
