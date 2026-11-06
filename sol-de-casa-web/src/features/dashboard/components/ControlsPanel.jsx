import { Card, RangeField, Toggle } from '../../../shared/components/index.js';
import { GOOGLE_MAX_INVESTMENT, META_MAX_INVESTMENT, MAX_EXTRA_TECHS } from '../../../shared/model/index.js';
import { formatInteger, formatPercent, formatUsd } from '../../../shared/utils/format.js';
import { FunnelRates } from './FunnelRates.jsx';
import styles from './ControlsPanel.module.css';

const ControlGroup = ({ title, open = false, tone, children }) => (
  <details className={styles.group} open={open}>
    <summary className={styles.summary} data-tone={tone}>
      {title}
    </summary>
    <div className={styles.body}>{children}</div>
  </details>
);

export const ControlsPanel = ({ model }) => {
  const { params, setParam, setRate, setMetaFilter, resetParams } = model;

  return (
    <Card as="aside" title="Supuestos" eyebrow="Controles" className={styles.panel}>
      <ControlGroup title="Inversión en anuncios" open>
        <RangeField
          label="Meta (USD/mes)"
          value={params.metaInvestment}
          min={0}
          max={META_MAX_INVESTMENT}
          step={250}
          format={formatUsd}
          onChange={(value) => setParam('metaInvestment', value)}
        />
        <RangeField
          label="Google (USD/mes)"
          value={params.googleInvestment}
          min={0}
          max={GOOGLE_MAX_INVESTMENT}
          step={250}
          format={formatUsd}
          onChange={(value) => setParam('googleInvestment', value)}
          hint="Leads según el historial (sección 5), con interpolación lineal. Google se acaba en 160 leads."
        />
        <Toggle
          label="Respuesta en menos de 5 min + filtro en Meta"
          description="Supuesto 7 (de casos parecidos, no medido): leads de Meta −20 % y tasas 80 / 40 / 75 / 22 %."
          checked={params.metaFilter}
          onChange={setMetaFilter}
        />
        <Toggle
          label="Contar Meta como la agencia ($8 por lead)"
          description="Supuesto 6: CPL fijo de $8 en vez del historial. Solo para comparar."
          checked={params.agencyCpl > 0}
          onChange={(enabled) => setParam('agencyCpl', enabled ? 8 : 0)}
        />
      </ControlGroup>

      <ControlGroup title="Embudo de Meta" tone="meta">
        <FunnelRates rates={params.metaRates} onChange={(step, value) => setRate('metaRates', step, value)} />
      </ControlGroup>

      <ControlGroup title="Embudo de Google" tone="google">
        <FunnelRates rates={params.googleRates} onChange={(step, value) => setRate('googleRates', step, value)} />
      </ControlGroup>

      <ControlGroup title="Operación y precio">
        <RangeField
          label="Costo por visita técnica"
          value={params.visitCost}
          min={0}
          max={200}
          step={5}
          format={formatUsd}
          onChange={(value) => setParam('visitCost', value)}
        />
        <RangeField
          label="Técnicos extra (+50 visitas c/u)"
          value={params.extraTechs}
          min={0}
          max={MAX_EXTRA_TECHS}
          format={(value) => `${formatInteger(value)} · ${formatInteger(100 + value * 50)} visitas`}
          onChange={(value) => setParam('extraTechs', value)}
          hint="Cada técnico cuesta $1.800 al mes."
        />
        <RangeField
          label="Precio de la instalación"
          value={params.price}
          min={4000}
          max={9000}
          step={100}
          format={formatUsd}
          onChange={(value) => setParam('price', value)}
        />
        <RangeField
          label="Margen bruto"
          value={params.grossMargin}
          min={10}
          max={45}
          format={formatPercent}
          onChange={(value) => setParam('grossMargin', value)}
        />
        <RangeField
          label="Comisión de la asesora"
          value={params.commission}
          min={0}
          max={8}
          step={0.5}
          format={(value) => formatPercent(value, 1)}
          onChange={(value) => setParam('commission', value)}
        />
        <RangeField
          label="Clientes que agregan la batería"
          value={params.batteryRate}
          min={0}
          max={50}
          format={formatPercent}
          onChange={(value) => setParam('batteryRate', value)}
          hint="Batería de $3.000, margen 20 %, comisión 3 %. En la prueba la tomaron 3 de 20 (15 %)."
        />
      </ControlGroup>

      <button type="button" className={styles.reset} onClick={resetParams}>
        Volver a los datos del caso
      </button>
    </Card>
  );
};
