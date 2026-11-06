// Textos de la ficha de growth (Parte 2). Los números se calculan en el modelo; aquí van las decisiones.

export const RETENTION = {
  meaning:
    'Nadie vuelve a comprar paneles en 15 o 20 años, así que retener no es que la familia compre otra vez: es que siga mirando su ahorro y lo siga contando. Una familia retenida es una familia que comparte.',
  weeklyNumber: 'Vecinos referidos que agendan visita por semana',
  why: 'Junta las dos cosas que importan: que las familias sigan activas (ven y comparten su ahorro) y que eso se convierta en visitas. Los «me gusta» o las tarjetas compartidas solas no pagan la planilla.',
};

export const CYCLE = [
  { title: 'Instalación', body: 'Una familia nueva firma e instala.' },
  { title: 'Ve su ahorro', body: 'Cada mes recibe cuánto ahorró, en plata (hoy solo el 25 % lo sabe).' },
  { title: 'Comparte', body: 'Manda su tarjeta por WhatsApp con su link personal (hoy el 40 % ya enseña el recibo).' },
  { title: 'El vecino calcula', body: 'Ve el ahorro de alguien que conoce y calcula el suyo en 10 segundos.' },
  { title: 'Agenda', body: 'Deja nombre y teléfono; lo llaman en menos de 5 minutos.' },
  { title: 'Firma', body: 'La familia gana su premio y el vecino es la siguiente familia que ahorra.' },
];

export const CHANNELS = [
  {
    name: 'Referidos',
    quadrant: 'cheap-big',
    cost: 'bajo',
    volume: 'crece con cada familia',
    action: 'Motor principal: la experiencia de ahorro compartido.',
  },
  {
    name: 'Letreros',
    quadrant: 'cheap-small',
    cost: 'bajo',
    volume: '6 leads de 20 casas en 2 meses',
    action: 'Complemento: letrero con QR al link de la familia.',
  },
  {
    name: 'Google',
    quadrant: 'expensive-small',
    cost: '$536 por cliente',
    volume: 'tope de 160 leads',
    action: 'Mantener fijo: tiene tope de búsquedas.',
  },
  {
    name: 'Meta',
    quadrant: 'expensive-big',
    cost: '$718 por cliente',
    volume: 'mucho volumen',
    action: 'Solo con filtro y para llenar visitas libres.',
  },
];

export const FOUR_QUESTIONS = [
  {
    question: '¿Es para mí?',
    family: 'Abre con su nombre y su ahorro del mes pasado, en plata.',
    neighbor: 'Abre con el ahorro de una familia que conoce, de su barrio.',
  },
  {
    question: '¿Hace lo que quiero?',
    family: 'El mensaje prometía ver su ahorro: es lo primero en la pantalla.',
    neighbor: 'El mensaje prometía «cuánto ahorraría usted»: la calculadora ya trae $110 y muestra el resultado.',
  },
  {
    question: '¿Me importa ahora?',
    family: 'Es el ahorro de este mes y un premio por cada vecino que agenda.',
    neighbor: 'Ve cuánto bajaría su próximo recibo y lo llaman en menos de 5 minutos, no en 31 horas.',
  },
  {
    question: '¿Sé cómo lograrlo?',
    family: 'Un botón: «Mandar por WhatsApp». La barra muestra en qué paso va cada vecino.',
    neighbor: 'Tres pasos (calcule, sus datos, listo) y solo dos campos: nombre y teléfono.',
  },
];

export const AI_ERRORS = [
  {
    said: 'Primer borrador de recompensas: a la familia, limpieza gratis + $50 de descuento cuando el vecino firma; al vecino, $40; y 1 mes de mantenimiento cuando el vecino agenda.',
    why: 'Sumaba $312,96 por venta y pasaba la regla de $300. El error: contar el premio por agenda una sola vez, cuando se paga en cada agenda (2,47 agendas por venta, porque no todos firman).',
    fix: 'Se cambió el descuento de $50 por 2 meses de mantenimiento ($24). Total: $286,96 por venta, verificado en las pruebas del modelo.',
  },
];

export const ASSUMPTIONS = [
  {
    text: 'El ahorro de la familia de demostración, su nombre y su barrio son simulados (70 % de un recibo de $110, con variación por temporada inventada).',
    source: 'Simulado',
  },
  { text: 'Todos los números del panel de Andrés, salvo el registro en vivo, son simulados.', source: 'Simulado' },
  {
    text: 'La calculadora usa la instalación promedio de $6.500 para cualquier recibo. En la realidad, un recibo más alto pide más paneles.',
    source: 'Supuesto propio',
  },
  { text: 'Los paneles duran 20 años («una familia compra cada 15 o 20 años»).', source: 'Caso, Parte 2' },
  {
    text: 'Quien agenda desde la página del vecino entra al embudo de referidos del caso: 95 % contacto, 85 % agenda, 90 % visita y 45 % cierre.',
    source: 'Caso, Parte 2',
  },
  {
    text: 'Un mes de mantenimiento regalado cuesta $12, lo que se deja de cobrar («un descuento cuesta lo que se descuenta»).',
    source: 'Caso, Parte 2',
  },
  { text: 'Responder en menos de 5 minutos viene del cambio 1 de la Parte 1.', source: 'Parte 1' },
];
