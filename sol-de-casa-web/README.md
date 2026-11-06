# Sol de Casa · Sistema web

Sistema completo del **Caso C · Sol de Casa** (paneles solares para casas, vendidos con lead gen). Funciona en celular y en escritorio y tiene tres áreas:

| Área | Para quién | Qué tiene |
| --- | --- | --- |
| **Sitio público** (`/`) | Quien todavía no tiene paneles | Página de inicio con calculadora de ahorro, cómo funciona, qué incluye, precio, testimonios, programa de referidos y preguntas frecuentes. Agenda de visita en `/agendar`. |
| **Portal del cliente** (`/mi-cuenta`) | Familias con paneles | Su ahorro del mes y desde que instalaron, la tarjeta para compartir por WhatsApp con su link personal, sus vecinos y premios, y los datos de su sistema (mantenimiento y batería). |
| **Panel del equipo** (`/panel`) | Andrés, asesoras y técnicos | Resumen del día («llamar ahora»), CRM de solicitudes con cambio de estado, panel de referidos y ficha de growth (sesión 2), y el análisis de anuncios: tablero, escenarios, caja a 24 meses y recomendación (sesión 1). |

El vecino que abre el link de una familia (`/r/FAM-0137`) ve una página propia, sin menús, con el ahorro de esa familia, la calculadora y la agenda. La solicitud queda en el CRM con quién lo refirió, y cuando el equipo cambia el estado, la familia ve el avance en su cuenta.

## Cuentas de demostración

| Cuenta | Correo | Contraseña |
| --- | --- | --- |
| Familia con paneles | `familia@soldecasa.cr` | `solar2026` |
| Andrés (equipo) | `andres@soldecasa.cr` | `solar2026` |

En **Crear cuenta** se registra un cliente nuevo (recibe su código de familia y un ahorro simulado con el 70 % de su recibo) o alguien del equipo con el código `SOLDECASA-2026`.

> **Prototipo.** Las cuentas, la sesión y las solicitudes se guardan en el navegador (`localStorage`). No es seguro para datos reales: en producción van a un backend con contraseñas en bcrypt o argon2, sesión con cookie httpOnly y las solicitudes hacia un webhook de n8n o la API del CRM. Lo marcado como «simulado» es inventado para la demostración.

## Cómo correrlo

Requiere Node 18 o más nuevo. Desde `Sol-de-Casa/` (hay un `package.json` con atajos):

```bash
npm run setup   # solo la primera vez
npm run dev
```

O desde `sol-de-casa-web/`:

```bash
npm install
npm run dev        # muestra una dirección «Network» para abrirla en el celular con el mismo wifi
npm run test       # 26 pruebas: modelo de la sesión 1 y 2, cuentas y solicitudes
npm run build      # genera dist/ para cualquier hosting estático
npm run lint
```

## Estructura

```text
docs/                       material del caso: PDF Parte 1 y 2, Excel, tablero HTML original
src/
├── app/                    rutas (HashRouter), protección por rol, menús
│   └── layouts/            sitio público, acceso, link del vecino y armazón de la app
├── assets/images/          fotos del caso optimizadas a WebP
├── features/
│   ├── landing/            página de inicio
│   ├── auth/               iniciar sesión y crear cuenta
│   ├── neighbor/           calculadora y agenda (público y link de referido)
│   ├── family/             portal del cliente
│   ├── team-home/          resumen del panel
│   ├── crm/                solicitudes de visita
│   ├── owner-panel/        panel de referidos (sesión 2)
│   ├── growth-sheet/       ficha de growth (sesión 2)
│   ├── dashboard/          tablero de anuncios (sesión 1, nivel 2)
│   ├── scenarios/          escenarios (sesión 1, nivel 1)
│   ├── simulator/          caja a 24 meses (sesión 1, nivel 3)
│   └── report/             recomendación para Andrés (sesión 1)
├── services/               almacenamiento, cuentas y solicitudes (con pruebas)
├── shared/
│   ├── model/              EL MODELO: datos del caso y cálculos puros (con pruebas)
│   ├── components/         botón, campo, logo, tarjetas, tablas, gráficos, estados
│   ├── hooks/              sesión, solicitudes en vivo, parámetros, revelado al hacer scroll
│   └── utils/              formato de dinero, fechas relativas, links para compartir
└── styles/                 tokens (paleta de panel solar, modo claro y oscuro) y estilos globales
```

## Verificación

- `src/shared/model/model.test.js`: la sesión 1 contra `Sol_de_Casa_Niveles_1_y_3.xlsx` (CAC real de Meta $718,13 y de Google $535,54; caja del mes 1, $15.736,30; plan ganador, $677.750 en el mes 24).
- `src/shared/model/referral.test.js`: la sesión 2. Una venta referida cuesta $286,96 (regla: menos de $300); llenar un técnico nuevo pide 68,8 leads referidos al mes.
- `src/services/leads.test.js`: cuentas (contraseña, código de equipo, código de familia) y estados de las solicitudes.

Las rutas de la versión anterior (`#/tablero`, `#/vecino?ref=...`) redirigen a las nuevas.

Caso ficticio con fines educativos.
