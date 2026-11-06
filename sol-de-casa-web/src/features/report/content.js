// Textos del informe: salen de la hoja «Recomendacion» y «Errores_IA» de Sol_de_Casa_Niveles_1_y_3.xlsx.

export const DECISION =
  'No aceptar la propuesta de Leadly. Arreglar primero el proceso con Meta, contratar técnicos y solo después subir la inversión.';

export const FINDINGS = [
  {
    title: 'La trampa',
    body: 'Leadly compara el costo por lead ($8 contra $40). Pero el cliente no es el lead. En Meta se logra contactar al 55 %, y de cada 100 leads firman 2,1; en Google firman 11,9. El lead de Meta cuesta 5 veces menos, pero el cliente cuesta 34 % más: CAC real $718 contra $535.',
  },
  {
    title: 'La propuesta con el historial',
    body: 'Con el historial, $8.000 en Meta traen 840 leads, no 1.000, y el CPL de los segundos $4.000 sube a $11,76. Las ventas bajan de 22,3 a 17,5 al mes y el resultado mensual pasa de unos +$4.400 a unos −$3.400: la caja baja del piso de $5.000 en el mes 5 y llega a negativo en el mes 7. Con $12.000 en el banco no hay colchón para eso.',
  },
];

export const CHANGES = [
  {
    title: 'Cambio 1: responder en menos de 5 minutos y filtrar en Meta',
    body: 'Dos preguntas en el formulario («¿Es dueño de la casa?» y «¿Su recibo pasa de $80?»). Supuesto 7, no medido. Con los mismos $4.000: 400 leads, 21,1 ventas por Meta (antes 10,4), CAC real $462 (antes $718), LTV:CAC 3,5 (antes 2,3).',
  },
  {
    title: 'Cambio 2: contratar técnicos',
    body: 'Con el filtro, las visitas pedidas suben de 97 a unas 136 y la capacidad de 100 se rompe. Un técnico ($1.800) suma 50 visitas, y cada visita de Google vale $428 y cada una de Meta filtrada $298.',
  },
];

export const PLAN =
  'Filtro desde el mes 1, técnicos en los meses 1 y 2, Google fijo en $5.000 (más allá, cada $2.000 traen solo 25 leads) y Meta $2.000 → $4.500 → $7.500 desde el mes 3. Resultado: unos $678.000 de caja en el mes 24 (el plan de hoy termina en unos $117.000), mínimo de $9.000 en el mes 2 y unas 1.113 instalaciones.';

export const RISKS = [
  'Todo depende del supuesto 7. Si el filtro solo baja los leads 20 % y no mejora las tasas, el mismo plan toca $3.400 en el mes 3 y rompe el piso. Hay que medir el filtro un mes antes de contratar el segundo técnico.',
  'Los técnicos nuevos se capacitan un mes antes de sumar visitas.',
  'Con 200 visitas al mes, ¿la cuadrilla subcontratada puede instalar 48 casas al mes? El caso no lo dice.',
  'Las tasas del embudo no cambian con la inversión: es un supuesto.',
];

export const GROWTH =
  'Para crecer más: más búsquedas en Google (hoy se acaban en 160 leads), más capacidad de la cuadrilla de instalación y que el filtro de Meta se confirme con datos reales.';

export const PITCH = [
  'Sol de Casa instala paneles solares: 420 casas, 4,9 estrellas, y cada instalación deja $1.625 después de equipos, instalación y comisión. El problema no es la demanda, es la caja: pagamos los equipos el día en que el cliente firma y cobramos la otra mitad un mes después. Hoy tenemos $12.000 en el banco.',
  'Una agencia nos propuso pasar todo a Meta porque el lead cuesta $8. Hicimos la cuenta completa: ese cliente nos cuesta $718 y el de Google $535. Con esa propuesta perderíamos plata cada mes. Nuestro plan es otro: responder rápido, filtrar mejor los leads de Meta, tener $5.000 fijos en Google y contratar dos técnicos para que la capacidad no frene las ventas.',
  'En 24 meses, el modelo muestra unas 1.100 instalaciones y más de $650.000 de caja, con un mínimo de $9.000 en el mes 2. Pedimos el crédito para cubrir ese valle del mes 2 y el pago de los técnicos. El riesgo principal es que el filtro no mejore las tasas como suponemos; lo probamos un mes antes de comprometer el segundo técnico. Si funciona, el crecimiento siguiente depende de más capacidad de instalación, no de más anuncios.',
];

export const AI_ERRORS = [
  {
    said: '«Con el filtro en Meta, el CAC real baja a unos $425 y el LTV:CAC es ≈ 3,8» (primer análisis).',
    why: 'Faltó la cuenta: (4.000 + 96 visitas × $60) / 21,1 ventas = $462, y 1.625 / 462 = 3,5. El número redondo se dijo sin mostrar la cuenta.',
    fix: 'Se recalculó en la hoja (escenario «Ustedes»). Regla: pedir siempre la cuenta escrita.',
  },
  {
    said: 'Sugirió subir Google hasta $8.000 porque «cada visita de Google vale $427».',
    why: 'Ignoró que entre $6.000 y $8.000 Google trae solo 25 leads más ($80 por lead) y que las visitas compiten por la capacidad.',
    fix: 'Se probaron los 24 meses con distintas inversiones: Google queda fijo en $5.000.',
  },
  {
    said: 'Habló de que la batería aporta «≈ $77 por visita».',
    why: 'El caso mide la batería sobre clientes que reciben la oferta, no sobre cada visita: 15 % × ($3.000 × 20 % − 3 % × $3.000) = $76,5 por venta.',
    fix: 'Se dejó escrito como supuesto y se usa por venta.',
  },
  {
    said: 'Primer resumen: «salidas $140.289, caja ≈ $15.740».',
    why: 'Al verificar el mes 1 con la calculadora, el valor exacto es $140.291,51 de salidas y caja de $15.736,30. Eran números redondeados de memoria.',
    fix: 'Se escribió la cuenta completa del mes 1 y se comparó con el modelo: la diferencia es menor a $1.',
  },
];

export const ASSUMPTIONS = [
  { text: 'El LTV de un cliente es una sola venta: no hay recompra en la Sesión 1.', source: 'Caso, supuesto 1' },
  {
    text: 'Todo el embudo de un lead (contacto, agenda, visita y firma) pasa en el mismo mes.',
    source: 'Caso, supuesto 2',
  },
  { text: 'Las tasas del embudo de cada canal no cambian con la inversión.', source: 'Caso, supuesto 3' },
  {
    text: 'Si no caben las visitas, se hacen primero las de Google y después las de Meta; el resto se pierde.',
    source: 'Caso, supuesto 4',
  },
  {
    text: 'Leads entre dos puntos del historial con interpolación lineal, con el punto ($0, 0 leads).',
    source: 'Caso, supuesto 5',
  },
  { text: '«Como la cuenta la agencia»: CPL de $8 constante, comparado con el historial.', source: 'Caso, supuesto 6' },
  {
    text: 'Filtro + respuesta en menos de 5 min: leads de Meta −20 % y tasas 80 / 40 / 75 / 22 %. No medido.',
    source: 'Caso, supuesto 7',
  },
  {
    text: 'La tasa de batería (3 de 20 = 15 %) se aplica a cada cliente que firma, y su costo se paga el mes de la firma.',
    source: 'Supuesto propio',
  },
  {
    text: 'Con el filtro activo en el tablero, los escenarios y el simulador usan las tasas de Meta del CRM como base.',
    source: 'Supuesto propio',
  },
];
