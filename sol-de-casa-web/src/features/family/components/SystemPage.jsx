import { useState } from 'react';
import { Button } from '../../../shared/components/Button.jsx';
import { SimTag } from '../../../shared/components/SimTag.jsx';
import { BATTERY, MAINTENANCE_PLAN, SAVINGS } from '../../../shared/model/index.js';
import { formatInteger, formatUsd } from '../../../shared/utils/format.js';
import { useMyFamily } from '../hooks/useMyFamily.js';
import styles from './Family.module.css';

/** Mi sistema: datos de la instalación, mantenimiento y la batería opcional. */
export const SystemPage = () => {
  const { family, history } = useMyFamily();
  const [planRequested, setPlanRequested] = useState(false);
  const [batteryRequested, setBatteryRequested] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.greeting}>
        <p>Mi sistema</p>
        <h1>Su instalación, en un vistazo.</h1>
      </header>

      <section className={styles.panel}>
        <h2>
          Datos de la instalación <SimTag />
        </h2>
        <dl className={styles.facts}>
          <div>
            <dt>Código de familia</dt>
            <dd>{family.code}</dd>
          </div>
          <div>
            <dt>Barrio</dt>
            <dd>{family.neighborhood}</dd>
          </div>
          <div>
            <dt>Instalado desde</dt>
            <dd>{history[0].label}</dd>
          </div>
          <div>
            <dt>Meses produciendo</dt>
            <dd>{formatInteger(family.monthsInstalled)}</dd>
          </div>
          <div>
            <dt>Recibo antes de los paneles</dt>
            <dd>{formatUsd(family.billBefore)}</dd>
          </div>
          <div>
            <dt>Ahorro esperado</dt>
            <dd>{SAVINGS.savingsRate} % del recibo</dd>
          </div>
          <div>
            <dt>Equipos</dt>
            <dd>Paneles, inversor y estructura</dd>
          </div>
          <div>
            <dt>Monitoreo</dt>
            <dd>El inversor reporta cada hora</dd>
          </div>
        </dl>
      </section>

      <div className={styles.offerGrid}>
        <section className={styles.offer}>
          <p className={styles.offerEyebrow}>Plan de mantenimiento</p>
          <p className={styles.offerPrice}>
            {formatUsd(MAINTENANCE_PLAN.monthlyPrice)}
            <small>/mes</small>
          </p>
          <p>Limpieza y revisión anual de sus paneles. Con sus premios por referidos, los meses le salen gratis.</p>
          {planRequested ? (
            <p className={styles.done}>✓ Listo: una asesora lo llama para activarlo.</p>
          ) : (
            <Button variant="dark" onClick={() => setPlanRequested(true)}>
              Quiero el plan
            </Button>
          )}
        </section>
        <section className={styles.offer}>
          <p className={styles.offerEyebrow}>Batería de respaldo</p>
          <p className={styles.offerPrice}>{formatUsd(BATTERY.price)}</p>
          <p>Para seguir con luz cuando hay cortes. Se instala sobre su sistema actual.</p>
          {batteryRequested ? (
            <p className={styles.done}>✓ Listo: un técnico lo llama para revisarla con usted.</p>
          ) : (
            <Button variant="ghost" onClick={() => setBatteryRequested(true)}>
              Me interesa
            </Button>
          )}
        </section>
      </div>
      <p className={styles.note}>Prototipo: las solicitudes de plan y batería no se envían a nadie.</p>
    </div>
  );
};
