# Usability Test Dashboard — IHC 2026

Sistema web para la gestión y análisis de pruebas de usabilidad, desarrollado como proyecto del sexto semestre del curso de Interacción Humano-Computador (HCI). Permite planificar sesiones de prueba, registrar participantes, documentar observaciones en tiempo real, consolidar hallazgos y, como función destacada, generar automáticamente un Sprint Backlog priorizando las mejoras detectadas mediante inteligencia artificial (Google Gemini).

---

## Tabla de contenidos

1. [Arquitectura general](#1-arquitectura-general)
2. [Módulos de la aplicación](#2-módulos-de-la-aplicación)
3. [Modelo de datos](#3-modelo-de-datos)
4. [Flujo de negocio](#4-flujo-de-negocio)
5. [Sprint Backlog IA](#5-sprint-backlog-ia)
6. [Estructura de carpetas](#6-estructura-de-carpetas)
7. [Instalación y arranque](#7-instalación-y-arranque)
8. [Variables de entorno](#8-variables-de-entorno)
9. [API Endpoints](#9-api-endpoints)
10. [Tecnologías utilizadas](#10-tecnologías-utilizadas)

---

## 1. Arquitectura general

El sistema está dividido en tres capas independientes que se comunican a través de HTTP:

```
┌──────────────────────────────────┐
│   Navegador (Puerto 3000)        │
│   Next.js 16 + TypeScript        │
│   Tailwind CSS + Radix UI        │
└────────────┬─────────────────────┘
             │ fetch / REST JSON
             ▼
┌──────────────────────────────────┐
│   Backend (Puerto 3001)          │
│   Node.js + Express 5            │
│   Controladores + Middlewares    │
│   Google Gemini / Fallback local │
└────────────┬─────────────────────┘
             │ mysql2 driver
             ▼
┌──────────────────────────────────┐
│   Base de datos (Puerto 3306)    │
│   MySQL 8.0 (vía Docker)         │
│   Base: usability_dashboard      │
└──────────────────────────────────┘
```

| Capa | Puerto | Tecnología principal |
|---|---|---|
| Frontend | 3000 | Next.js 16, React 19, TypeScript 5.7 |
| Backend | 3001 | Node.js, Express 5.2, mysql2 3.20 |
| Base de datos | 3306 | MySQL 8.0 (contenedor Docker) |

La comunicación entre frontend y backend usa la variable de entorno `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:3001`). El backend habilita CORS sin restricción de origen para facilitar el desarrollo local.

---

## 2. Módulos de la aplicación

El menú lateral de la aplicación contiene los siguientes módulos:

### Dashboard (`/`)
Panel de control principal. Muestra métricas agregadas de todas las pruebas registradas: total de pruebas, tasa de éxito promedio, total de errores detectados, tiempo promedio de ejecución y distribución de hallazgos por prioridad. Usa gráficos de Recharts para visualizar tendencias.

### Plan de Prueba (`/plan`)
CRUD completo para planes de prueba de usabilidad. Cada plan define el producto evaluado, el módulo bajo análisis, el objetivo, el perfil de usuarios, el método de evaluación, la fecha, el lugar, la duración estimada y los guiones de apertura, seguimiento y cierre de la sesión. Corresponde a la tabla `pruebas_usabilidad`.

### Tareas y Guión (`/tareas`)
CRUD de tareas asociadas a un plan de prueba. Cada tarea describe un escenario específico que el participante debe ejecutar, el resultado esperado, la métrica principal a medir (p. ej. tiempo, errores) y el criterio de éxito. Las tareas son la unidad básica de medición durante la sesión. Corresponde a la tabla `tareas`.

### Participantes (`/participantes`)
CRUD de participantes. Registra el nombre y el perfil de cada persona que toma parte en las pruebas. Los participantes se vinculan a las observaciones al momento de ejecutar una tarea. Corresponde a la tabla `participantes`.

### Observaciones (`/observaciones`)
Registro de datos capturados durante la ejecución de una prueba. Por cada combinación participante–tarea se documenta si la tarea fue exitosa o no, el tiempo en segundos, la cantidad de errores, comentarios del observador, el problema detectado, su severidad y una propuesta de mejora inmediata. Corresponde a la tabla `observaciones`.

### Hallazgos (`/hallazgos`)
Consolidación de los problemas identificados a partir de las observaciones. Cada hallazgo se clasifica por frecuencia, severidad (Crítica / Alta / Media / Baja), prioridad y estado (Abierto / En progreso / Resuelto), e incluye una recomendación de mejora. Corresponde a la tabla `hallazgos`.

### Sprint Backlog IA (`/sprint-backlog`)
Módulo de generación automática de un Sprint Backlog a partir de los datos recopilados en la prueba. Usa Google Gemini 2.5 Flash para transformar hallazgos, observaciones y métricas en historias de usuario priorizadas, tareas técnicas estimadas y un plan de sprint día a día. Incluye editor inline, exportación a Markdown y PDF.

---

## 3. Modelo de datos

La base de datos `usability_dashboard` contiene cinco tablas con relaciones en cascada.

### Diagrama de relaciones

```
pruebas_usabilidad (1) ──< tareas (N)
pruebas_usabilidad (1) ──< hallazgos (N)
tareas (1)            ──< observaciones (N)
participantes (1)     ──< observaciones (N)
```

### Tabla `pruebas_usabilidad`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | int PK AI | Identificador único |
| `producto` | varchar(100) NOT NULL | Nombre del producto evaluado |
| `modulo_evaluado` | varchar(100) | Módulo o sección bajo prueba |
| `objetivo` | text | Objetivo de la sesión |
| `perfil_usuarios` | varchar(255) | Descripción del perfil de usuarios objetivo |
| `metodo` | varchar(100) | Método de evaluación utilizado |
| `fecha` | date | Fecha de ejecución |
| `lugar` | varchar(100) | Lugar físico o plataforma virtual |
| `duracion_minutos` | int | Duración estimada en minutos |
| `instrucciones_inicio` | text | Introducción leída al participante al inicio |
| `preguntas_seguimiento` | text | Preguntas post-tarea |
| `instrucciones_cierre` | text | Texto de cierre de la sesión |

### Tabla `tareas`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | int PK AI | Identificador único |
| `prueba_id` | int FK → pruebas_usabilidad | Plan de prueba al que pertenece |
| `escenario` | text | Descripción del escenario a ejecutar |
| `resultado_esperado` | text | Resultado esperado al completar la tarea |
| `metrica_principal` | varchar(100) | Métrica a medir (tiempo, errores, tasa de éxito) |
| `criterio_exito` | varchar(255) | Condición que define una ejecución exitosa |

### Tabla `participantes`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | int PK AI | Identificador único |
| `nombre` | varchar(100) NOT NULL | Nombre completo del participante |
| `perfil` | varchar(100) | Rol o perfil del participante |

### Tabla `observaciones`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | int PK AI | Identificador único |
| `participante_id` | int FK → participantes | Participante que ejecutó la tarea |
| `tarea_id` | int FK → tareas | Tarea ejecutada |
| `exito` | tinyint(1) | 1 = éxito, 0 = fallo |
| `tiempo_segundos` | int | Tiempo empleado en completar la tarea |
| `cantidad_errores` | int | Número de errores cometidos |
| `comentarios` | text | Notas del observador durante la sesión |
| `problema_detectado` | text | Descripción del problema observado |
| `severidad` | varchar(50) | Gravedad del problema (Crítica / Alta / Media / Baja) |
| `mejora_propuesta` | text | Sugerencia de mejora inmediata |

### Tabla `hallazgos`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | int PK AI | Identificador único |
| `prueba_id` | int FK → pruebas_usabilidad | Prueba de origen |
| `frecuencia` | varchar(50) | Frecuencia de aparición del problema |
| `severidad` | varchar(50) | Nivel de severidad |
| `prioridad` | varchar(50) | Nivel de prioridad para corrección |
| `estado` | varchar(50) | Estado del hallazgo |
| `recomendacion_mejora` | text | Recomendación de solución |

> **Nota:** El controlador del Sprint Backlog consulta opcionalmente una tabla `sprint_backlogs` para recuperar histórico de backlogs previos. Si la tabla no existe, la consulta falla silenciosamente y el sistema continúa sin datos históricos.

### Restricciones de integridad referencial

Todas las claves foráneas usan `ON DELETE CASCADE`, lo que significa que eliminar una prueba borra en cascada sus tareas, hallazgos y (a través de las tareas) sus observaciones.

---

## 4. Flujo de negocio

El ciclo completo de uso del sistema sigue estos pasos:

```
1. Crear Plan de Prueba
   └─ Definir producto, módulo, objetivo, método, fecha y guiones

2. Agregar Tareas al plan
   └─ Cada tarea = escenario + resultado esperado + criterio de éxito

3. Registrar Participantes
   └─ Nombre y perfil de cada persona invitada a la sesión

4. Ejecutar la prueba y registrar Observaciones
   └─ Por cada participante × tarea: éxito, tiempo, errores, problema, severidad

5. Consolidar Hallazgos
   └─ Agrupar problemas repetidos, asignar prioridad y estado

6. Generar Sprint Backlog con IA
   └─ El sistema envía hallazgos + métricas a Gemini
   └─ Recibe historias de usuario, tareas técnicas y plan de sprint
   └─ Editar, exportar a Markdown o PDF
```

---

## 5. Sprint Backlog IA

### Descripción general

El módulo de Sprint Backlog IA es la función más avanzada del sistema. A partir de los datos ya registrados en la prueba (hallazgos, observaciones, tareas, participantes y métricas del dashboard), genera un backlog estructurado listo para ser llevado a un equipo de desarrollo.

### Selección de fuentes de contexto

Antes de generar, el usuario puede seleccionar qué fuentes de datos incluir en el prompt enviado a la IA:

| Fuente | Datos incluidos |
|---|---|
| `dashboard` | Tasa de éxito global, total de errores, tiempo promedio, hallazgos por prioridad |
| `planDePrueba` | Producto, módulo, objetivo |
| `tareasGuion` | Escenarios, resultados esperados, criterios de éxito |
| `participantes` | Nombres y perfiles |
| `observaciones` | Resultados por participante y tarea |
| `hallazgos` | Problemas con severidad, prioridad y recomendaciones |
| `historicalBacklogs` | Backlogs generados anteriormente (hasta 5 más recientes) |

Si no se especifican fuentes, se usan todas las disponibles.

### Llamada a Gemini

1. El frontend envía `POST /api/sprint-backlog/generate` con `{ pruebaId, sources?, context? }`.
2. El backend consulta la base de datos y construye el `contextJSON` con las fuentes seleccionadas.
3. Se invoca `aiClient.generateWithPayload()` que llama a **Gemini 2.5 Flash** con el prompt formateado.
4. El modelo responde con un bloque JSON delimitado entre `---BEGIN_JSON---` y `---END_JSON---`.
5. El JSON es validado contra el esquema esperado usando **AJV 8**.
6. Se retorna el resultado normalizado al frontend.

### Fallback local

Si Gemini no responde (error de red, cuota agotada, clave inválida), el sistema ejecuta `buildLocalFallback()` que genera el backlog de forma determinista a partir de los hallazgos registrados:

- Una historia de usuario por cada hallazgo (máximo 8).
- Tres tareas técnicas fijas por historia: Diseño (4 h), Desarrollo frontend (6 h), Validación (3 h).
- Plan de sprint distribuido proporcionalmente en los días configurados.
- Asignación cíclica de participantes como responsables.

El campo `metadata.aiSource` en la respuesta indica si el resultado vino de `gemini-2.5-flash` o de `local-fallback`.

### Estructura del JSON generado

```json
{
  "userStories": [
    {
      "id": "US-1",
      "title": "Título de la historia",
      "description": "Como [rol], quiero [acción] para [beneficio]",
      "priority": 1,
      "acceptanceCriteria": ["criterio 1", "criterio 2"]
    }
  ],
  "tasks": [
    {
      "userStoryId": "US-1",
      "title": "Tarea técnica",
      "estimatedHours": 6,
      "technicalNotes": "Notas adicionales"
    }
  ],
  "prioritization": [
    {
      "userStoryId": "US-1",
      "score": 5,
      "justification": "Razón de la prioridad"
    }
  ],
  "sprintPlan": [
    {
      "day": 1,
      "activities": ["Actividad del día"],
      "suggestedOwner": "Nombre del responsable"
    }
  ]
}
```

### Edición inline

Una vez generado el backlog, el usuario puede editar cualquier campo directamente en la interfaz (títulos, descripciones, criterios de aceptación, horas estimadas) sin necesidad de regenerar.

### Exportación

- **Markdown**: `generateMarkdownFromData()` en `frontend/lib/export-utils.ts` genera un archivo `.md` con historias, tareas, priorización y plan del sprint.
- **PDF**: La función de exportación a PDF imprime la vista actual del navegador como documento descargable.
- **Persistencia de sesión**: El backlog generado se almacena en `sessionStorage` para no perderse al recargar la página.

---

## 6. Estructura de carpetas

```
IHC-2026/
├── README.md                        # Este archivo
├── .gitignore
│
├── backend/                         # API REST en Node.js + Express
│   ├── config/
│   │   └── db.js                    # Conexión a MySQL con mysql2
│   ├── controllers/
│   │   ├── pruebasController.js     # Lógica CRUD de pruebas_usabilidad
│   │   ├── tareasController.js      # Lógica CRUD de tareas
│   │   ├── participantesController.js
│   │   ├── observacionesController.js
│   │   ├── hallazgosController.js
│   │   └── sprintBacklogController.js  # Orquestador de la generación IA
│   ├── middleware/
│   │   └── errorHandler.js          # Manejo centralizado de errores y 404
│   ├── routes/
│   │   ├── pruebas.js               # /api/pruebas
│   │   ├── tareas.js                # /api/tareas
│   │   ├── participantes.js         # /api/participantes
│   │   ├── observaciones.js         # /api/observaciones
│   │   ├── hallazgos.js             # /api/hallazgos
│   │   └── sprint-backlog.js        # /api/sprint-backlog/generate
│   ├── utils/
│   │   ├── aiClient.js              # Cliente de Google Gemini + validación AJV
│   │   ├── sprintBacklogPrompt.js   # Plantilla del prompt enviado a la IA
│   │   ├── sprintBacklogFallback.js # Generador local de respaldo
│   │   ├── logger.js                # Sistema de logging a archivos diarios
│   │   └── asyncHandler.js          # Wrapper para controladores async
│   ├── logs/                        # Archivos de log rotados por día
│   ├── index.js                     # Punto de entrada; monta rutas y middleware
│   ├── initDb.js                    # Ejecuta usability_dashboard.sql al arrancar
│   ├── usability_dashboard.sql      # Schema completo de la base de datos
│   ├── .env                         # Variables de entorno del backend
│   └── package.json
│
└── frontend/                        # SPA en Next.js 16 (App Router)
    ├── app/
    │   ├── layout.tsx               # Layout raíz con fuentes y metadata
    │   ├── page.tsx                 # Ruta / → DashboardView
    │   ├── globals.css              # Estilos globales y variables CSS
    │   ├── plan/page.tsx            # Ruta /plan
    │   ├── tareas/page.tsx          # Ruta /tareas
    │   ├── participantes/page.tsx   # Ruta /participantes
    │   ├── observaciones/page.tsx   # Ruta /observaciones
    │   ├── hallazgos/page.tsx       # Ruta /hallazgos
    │   └── sprint-backlog/page.tsx  # Ruta /sprint-backlog
    ├── components/
    │   ├── app-shell.tsx            # Sidebar de navegación + layout principal
    │   ├── dashboard-view.tsx       # Panel con métricas y gráficos
    │   ├── plan-view.tsx            # Tabla y formulario de planes
    │   ├── tareas-view.tsx
    │   ├── participantes-view.tsx
    │   ├── observaciones-view.tsx
    │   ├── hallazgos-view.tsx
    │   ├── sprint-backlog-view.tsx  # Interfaz principal del generador IA
    │   ├── sprint-backlog/          # Subcomponentes del Sprint Backlog
    │   │   ├── types.ts             # Interfaces TypeScript del backlog
    │   │   ├── reducer.ts           # Reducer para gestión de estado
    │   │   ├── UserStoriesList.tsx
    │   │   ├── TechnicalTasksTable.tsx
    │   │   ├── PrioritizationPanel.tsx
    │   │   ├── SprintPlanSummary.tsx
    │   │   └── utils.ts
    │   ├── ui/                      # Componentes base de shadcn/ui (Radix UI)
    │   │   └── (button, card, table, dialog, badge, etc.)
    │   ├── theme-provider.tsx       # Soporte de tema claro/oscuro
    │   └── toast-container.tsx      # Notificaciones tipo toast
    ├── hooks/
    │   ├── use-mobile.ts            # Detección de viewport móvil
    │   ├── use-toast.ts
    │   └── use-toasts.ts
    ├── lib/
    │   ├── utils.ts                 # Función cn() para combinar clases Tailwind
    │   └── export-utils.ts          # Generación de Markdown desde SprintBacklogData
    ├── next.config.mjs              # Configuración de Next.js
    ├── tsconfig.json
    ├── components.json              # Configuración de shadcn/ui
    └── package.json
```

---

## 7. Instalación y arranque

### Requisitos previos

- **Node.js** 18 o superior
- **Docker** instalado y en ejecución (para la base de datos MySQL)
- **Git**
- Un gestor de paquetes: `npm` (backend) y `npm` o `pnpm` (frontend)

### 1. Clonar el repositorio

```bash
git clone https://github.com/JaimXD/IHC-2026.git
cd IHC-2026
```

### 2. Levantar la base de datos con Docker

```powershell
docker run --name usability-mysql `
  -e MYSQL_ROOT_PASSWORD="" `
  -e MYSQL_DATABASE=usability_dashboard `
  -p 3306:3306 `
  -d mysql:8.0
```

Verifica que el contenedor esté activo:

```bash
docker ps
```

> El backend ejecuta `initDb.js` automáticamente al arrancar, lo que crea todas las tablas definidas en `usability_dashboard.sql`. No es necesario importar el esquema manualmente.

### 3. Configurar y arrancar el backend

```bash
cd backend
npm install
```

Crea o edita el archivo `backend/.env` con los valores correspondientes (ver sección [Variables de entorno](#8-variables-de-entorno)).

```bash
npm start
# Servidor disponible en http://localhost:3001
```

### 4. Configurar y arrancar el frontend

En otra terminal:

```bash
cd frontend
npm install   # o: pnpm install
```

Crea el archivo `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
npm run dev
# Aplicación disponible en http://localhost:3000
```

Abre `http://localhost:3000` en el navegador.

---

## 8. Variables de entorno

### Backend (`backend/.env`)

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `PORT` | `3001` | Puerto en que escucha el servidor Express |
| `DB_HOST` | `localhost` | Host del servidor MySQL |
| `DB_USER` | `root` | Usuario de la base de datos |
| `DB_PASSWORD` | *(vacío)* | Contraseña del usuario de base de datos |
| `DB_NAME` | `usability_dashboard` | Nombre de la base de datos |
| `GEMINI_API_KEY` | — | Clave de API de Google Gemini (requerida para la función IA) |

### Frontend (`frontend/.env.local`)

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | URL base del backend; accesible desde el navegador |

> **Seguridad:** No publiques `GEMINI_API_KEY` en el repositorio. El archivo `backend/.env` está incluido en `.gitignore`.

---

## 9. API Endpoints

Todos los endpoints tienen prefijo `/api` y retornan JSON.

### Pruebas de usabilidad

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/pruebas` | Obtener todos los planes de prueba |
| POST | `/api/pruebas` | Crear nuevo plan de prueba |
| GET | `/api/pruebas/:id` | Obtener un plan por ID |
| GET | `/api/pruebas/:id/summary` | Obtener resumen agregado de una prueba |
| PUT | `/api/pruebas/:id` | Actualizar un plan |
| DELETE | `/api/pruebas/:id` | Eliminar un plan (en cascada) |

### Tareas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/tareas` | Obtener todas las tareas |
| POST | `/api/tareas` | Crear tarea |
| GET | `/api/tareas/:id` | Obtener tarea por ID |
| PUT | `/api/tareas/:id` | Actualizar tarea |
| DELETE | `/api/tareas/:id` | Eliminar tarea |

### Participantes

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/participantes` | Obtener todos los participantes |
| POST | `/api/participantes` | Crear participante |
| GET | `/api/participantes/:id` | Obtener participante por ID |
| PUT | `/api/participantes/:id` | Actualizar participante |
| DELETE | `/api/participantes/:id` | Eliminar participante |

### Observaciones

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/observaciones` | Obtener todas las observaciones |
| POST | `/api/observaciones` | Crear observación |
| GET | `/api/observaciones/:id` | Obtener observación por ID |
| PUT | `/api/observaciones/:id` | Actualizar observación |
| DELETE | `/api/observaciones/:id` | Eliminar observación |

### Hallazgos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/hallazgos` | Obtener todos los hallazgos |
| POST | `/api/hallazgos` | Crear hallazgo |
| GET | `/api/hallazgos/:id` | Obtener hallazgo por ID |
| PUT | `/api/hallazgos/:id` | Actualizar hallazgo |
| DELETE | `/api/hallazgos/:id` | Eliminar hallazgo |

### Sprint Backlog IA

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/sprint-backlog/generate` | Generar Sprint Backlog con IA |

**Cuerpo de la petición:**

```json
{
  "pruebaId": 1,
  "sources": ["hallazgos", "observaciones", "planDePrueba"],
  "context": {
    "sprintDurationDays": 14,
    "teamSize": 4
  }
}
```

Solo `pruebaId` es obligatorio. `sources` y `context` son opcionales.

---

## 10. Tecnologías utilizadas

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.2.0 | Framework React con App Router |
| React | 19.2.4 | Biblioteca de UI |
| TypeScript | 5.7.3 | Tipado estático |
| Tailwind CSS | 4.2.0 | Estilos utilitarios |
| Radix UI / shadcn | 1.x – 2.x | Componentes accesibles (Dialog, Table, Badge…) |
| Recharts | 2.15.0 | Gráficos del dashboard |
| React Hook Form | 7.54.1 | Gestión de formularios |
| Zod | 3.24.1 | Validación de esquemas en cliente |
| react-markdown | 10.1.0 | Renderizado del contenido Markdown generado |
| lucide-react | 0.564.0 | Iconografía |
| next-themes | 0.4.6 | Soporte de tema claro/oscuro |
| date-fns | 4.1.0 | Manipulación de fechas |

### Backend

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | ≥ 18 | Entorno de ejecución |
| Express | 5.2.1 | Framework HTTP |
| mysql2 | 3.20.0 | Driver MySQL con promesas |
| dotenv | 17.3.1 | Gestión de variables de entorno |
| cors | 2.8.6 | Habilitación de CORS |
| AJV | 8.12.0 | Validación del JSON devuelto por Gemini |
| @google/genai | 2.6.0 | SDK oficial de Google Gemini |

### Base de datos

| Tecnología | Versión | Uso |
|---|---|---|
| MySQL | 8.0 | Base de datos relacional |
| Docker | — | Contenedor del servidor MySQL |

### IA

| Tecnología | Modelo | Uso |
|---|---|---|
| Google Gemini | gemini-2.5-flash | Generación del Sprint Backlog |

---

## Solución de problemas

**El frontend no se conecta al backend**
- Verifica que el backend esté corriendo en `http://localhost:3001`.
- Comprueba que `NEXT_PUBLIC_API_URL` en `frontend/.env.local` apunta a la dirección correcta.
- CORS ya está habilitado en el backend sin restricción de origen.

**La base de datos no se inicializa**
- Verifica que Docker esté activo: `docker ps`.
- Confirma que el contenedor `usability-mysql` está corriendo.
- Asegúrate de que el puerto 3306 no está ocupado por otra instancia de MySQL.
- Revisa los logs del backend para mensajes de error específicos.

**El Sprint Backlog IA siempre usa el fallback local**
- Verifica que `GEMINI_API_KEY` esté definida en `backend/.env`.
- Comprueba que la clave es válida y tiene cuota disponible en Google AI Studio.
- El campo `metadata.aiSource` en la respuesta JSON indica el origen (`gemini-2.5-flash` o `local-fallback`).

**Problemas al instalar dependencias del frontend**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## Autor

Desarrollado como proyecto del curso Interacción Humano-Computador — Sexto Semestre.
