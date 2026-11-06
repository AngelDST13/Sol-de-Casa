# Cumplimiento del Caso C · Sol de Casa

Dónde está cada requisito de los documentos del caso (`docs/`) dentro del sistema. Rutas con la cuenta de Andrés (`andres@soldecasa.cr`, contraseña `solar2026`), salvo que se diga otra cosa.

**Cómo abrirlo sin instalar nada:** `npm run build:archivo` genera `dist-archivo/index.html`, un solo archivo que se abre con doble clic. Para publicarlo con un link: `npm run deploy` (GitHub Pages).

## Parte 1 · Sesión 1

### Las 7 preguntas de Andrés

| Pregunta | Respuesta en el sistema | Dónde |
| --- | --- | --- |
| 1. ¿Cuánto deja una venta? | $1.625 de contribución (6.500 × 28 % − 3 %) | Panel › Escenarios › «¿Cuánto deja una venta?» |
| 2. Embudo de cada canal y dónde se cae más gente | Meta pierde más en el contacto (45 de cada 100 no contestan); Google, al agendar | Escenarios › «De cada 100 leads» y gráfico del nivel 1 |
| 3. CAC de anuncios, CAC real, CPL, visitas por venta | Meta: CPL $8, CAC real $718, 5,6 visitas por venta. Google: CPL $40, CAC real $536, 3,3 visitas | Tablero de anuncios › tabla de resultados |
| 4. LTV:CAC y payback en caja | 2,26 (Meta) y 3,03 (Google); un cliente se recupera el mes siguiente a la firma | Tablero (semáforo) y Escenarios › «¿En qué mes se recupera un cliente?» |
| 5. La propuesta de la agencia, contada dos veces | Con $8 por lead pide 115,5 visitas (no caben); con el historial, 17,5 ventas frente a 22,3 de hoy | Escenarios › «La propuesta de la agencia, contada dos veces» |
| 6. Valor de una visita por canal | $232,50 (Meta) y $427,50 (Google) | Tablero › «Valor de una visita» |
| 7. Dos cambios con su efecto en números | Filtro y respuesta en menos de 5 minutos (CAC Meta de $718 a $462) y un técnico extra | Escenarios › «Nuestros 2 cambios» y Recomendación |

### Nivel 1 · La calculadora

| Requisito | Dónde |
| --- | --- |
| Supuestos editables y resultados que se recalculan solos | Tablero de anuncios (controles) → Escenarios usa los mismos valores |
| Contribución, embudo, CAC de anuncios, CAC real, LTV:CAC, visitas por venta, uso de capacidad, valor de visita | Tablero › tabla de resultados; Escenarios |
| Tres escenarios lado a lado (hoy, agencia, ustedes) | Escenarios › tabla (cuatro columnas: la agencia contada a su manera y con el historial) |
| Gráfico: embudo de cada canal lado a lado con la línea de capacidad de 100 | Escenarios › «Embudo de cada canal, lado a lado» |
| Recomendación de una página que nombra la trampa con un número | Recomendación |
| «En qué se equivocó o nos confundió la IA» | Recomendación (sesión 1) y Ficha de growth (sesión 2) |
| Fila verificada a mano | Caja 24 meses › «Revisión del mes 1, a mano» |
| Lista de supuestos | Recomendación › «Supuestos usados» |

### Nivel 2 · El tablero

| Requisito | Dónde |
| --- | --- |
| Controles: inversión en Meta y Google (historial), 4 tasas por canal, costo por visita, técnicos extra, precio, margen, comisión, % de batería | Tablero › Supuestos |
| En vivo, por canal y total: leads, visitas, ventas, CPL, CAC de anuncios, CAC real, LTV:CAC, visitas frente a capacidad, valor de una visita | Tablero › Resultados del mes y barra superior |
| Gráficos: embudo lado a lado, CPL frente a CAC real, visitas frente a capacidad con la línea de 100 | Tablero › gráficos 1, 2 y 3 |
| Semáforo de LTV:CAC y alerta de capacidad | Tablero (verde ≥ 3, amarillo 1–3, rojo < 1; alerta en rojo al pasar la capacidad) |
| La trampa en un solo gráfico | Tablero › «Lead barato, cliente caro» (5,0 veces más barato, 34 % más caro) |
| Coincide con la hoja (< 1 %) y botón para volver a los datos | `src/shared/model/model.test.js` (diferencia < 1 centavo); botón «Volver a los datos del caso» |
| Abre con un link o un archivo, sin instalar | `dist-archivo/index.html` o `npm run deploy` |
| Cada número con nombre y unidad | Todas las etiquetas llevan nombre y unidad ($, %, visitas, años) |

### Nivel 3 · El simulador de caja

| Requisito | Dónde |
| --- | --- |
| 24 filas con inversión por canal, leads, visitas pedidas, capacidad, visitas hechas, ventas, entradas, salidas, caja final y alerta bajo $5.000 | Caja 24 meses › «Mes a mes» |
| Mes 1 del plan actual verificado a mano | Caja 24 meses › «Revisión del mes 1, a mano» ($15.736,30) |
| Al menos 4 planes (actual, agencia, dos propios, uno con técnico): caja mínima y su mes, caja del mes 24, instalaciones | Caja 24 meses › «Comparación de planes» (6 planes) |
| Gráfico de caja con la línea del piso y de visitas frente a capacidad | Caja 24 meses › dos gráficos |
| Reglas: caja ≥ $5.000; desde el mes 19 la inversión no baja | Se validan en cada plan («¿Respeta las reglas?») |
| Pitch de 2 minutos para el banco | Recomendación › «Pitch de 2 minutos» |

## Parte 2 · Sesión 2

### El prototipo

| Requisito | Dónde |
| --- | --- |
| 1. El ahorro a la vista: del mes y desde que instaló | Cuenta `familia@soldecasa.cr` › Mi ahorro |
| 2. Tarjeta del ahorro para WhatsApp o para publicar, con link personal | Mi cuenta › Compartir (WhatsApp, compartir, imagen de 1080 × 1350 para publicar, copiar link) |
| 3. Página del vecino: calculadora (ahorro y años para recuperar), agenda y registro de quién refirió | `#/r/FAM-0137` (sin menús internos); la solicitud llega al CRM con el código |
| 4. El juego con barra de avance que respeta la regla de $300 | Mi cuenta › Mis vecinos y premios (Compartió → Pidió visita → Agendó → Firmó) |
| 5. Panel para Andrés: tarjetas compartidas, vecinos que usan la calculadora, que agendan y que firman | Panel › Referidos (embudo simulado de la prueba A/B + «Medición en vivo» con datos reales) |
| Marca lo simulado con la palabra «simulado» | Etiqueta «SIMULADO» en cada dato inventado |
| Arranca por lo que prometió el mensaje | La página del vecino abre con el ahorro de la familia que compartió |
| Pocos pasos; cada paso pide solo lo necesario | Vecino: 3 pasos y 2 campos (nombre y teléfono) |
| Se usa bien desde el celular | Diseño para celular primero; probado a 360, 375 y 390 px de ancho |

### Las 6 preguntas y la ficha de growth

| Requisito | Respuesta | Dónde |
| --- | --- | --- |
| 1. Qué es retener y el número semanal | Retener = que la familia siga viendo y compartiendo su ahorro; número: vecinos referidos que agendan por semana | Ficha de growth y Referidos (número de la semana) |
| 2. Costo de una venta referida y tabla de recompensas | $133,33 de visitas + $153,63 de premios = $286,96 (< $300) | Ficha › «Tabla de recompensas» |
| 3. El ciclo y el lugar de anuncios y letreros a 90 días | Ciclo de 6 pasos; matriz de canales | Ficha › «El ciclo» y «Matriz de canales» |
| 4. Leads para llenar un técnico nuevo y familias necesarias | 68,8 leads al mes; 459 familias al ritmo de un letrero (más que las 420) | Ficha › «La meta en números» |
| 5. Experimento con 50 clientes | Métrica de 1,3 % a 20 %; contramétricas: cierre ≥ 45 % y venta referida < $300 | Ficha › «El experimento» y Referidos › «Prueba A/B» |
| 6. Las cuatro preguntas del cliente, desde la familia y desde el vecino | Tabla con las dos miradas | Ficha › «Las cuatro preguntas del cliente» |
| Paso donde más se pierde, con su porcentaje | Página → formulario: 86 % | Ficha › «Dónde se pierde más gente hoy» |
| Sección de errores de la IA | Un ejemplo real (premios que pasaban la regla) | Ficha › «En qué se equivocó la IA» |

## Lo que no cubre

- **`Primer_Postejercicio_Business_Solutions.docx`** es otro ejercicio: una base de datos relacional (diagrama ER, script SQL con datos y consultas de métricas) y un documento de agentes con un orquestador. No es parte de este sistema web.
- **Presentación en vivo** (3 minutos) y **la ficha de growth en Google Docs o Sheets**: el contenido está en la app (Ficha de growth), pero el documento se arma fuera.
