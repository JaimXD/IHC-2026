# Dashboard Mejorado - Wireframe Hi-Fi

**Proyecto:** Usability Test Dashboard 2.0  
**Fase:** 3 - Rediseño UX  
**Fidelidad:** Alta (colores finales, iconos, animaciones, ejemplos visuales)  
**Especificación:** Implementación lista para desarrollo  

---

## 🎨 Paleta de Colores Hi-Fi (Tema Claro)

### Colores Primarios
```css
--color-success: #10B981;     /* Verde éxito - Valores positivos */
--color-warning: #F59E0B;     /* Ámbar advertencia - Moderados */
--color-critical: #EF4444;    /* Rojo crítico - Urgente */
--color-info: #3B82F6;        /* Azul info - Acciones, links */
--color-primary: #2563EB;     /* Azul primario - Interacciones principales */

/* Variantes */
--color-success-light: #DBEAFE;   /* Para backgrounds */
--color-success-dark: #059669;    /* Para dark-mode */
--color-critical-light: #FEE2E2;
--color-critical-dark: #991B1B;

/* Grises */
--color-gray-0: #FFFFFF;      /* Blanco puro */
--color-gray-50: #F9FAFB;     /* Background alternado */
--color-gray-100: #F3F4F6;    /* Bordes, separadores */
--color-gray-300: #D1D5DB;    /* Deshabilitado, hints */
--color-gray-500: #6B7280;    /* Texto secundario */
--color-gray-700: #374151;    /* Texto primario */
--color-gray-900: #111827;    /* Negro casi puro */
```

### Fondos de Severidad
```
CRÍTICO:
├─ Background: #FEF2F2 (rojo muy claro)
├─ Icono/Text: #991B1B (rojo oscuro)
├─ Border: #FECACA (rojo suave)
└─ Accent: #EF4444 (rojo puro)

ALTO:
├─ Background: #FFFBEB (ámbar muy claro)
├─ Icono/Text: #92400E (ámbar oscuro)
├─ Border: #FCD34D (ámbar suave)
└─ Accent: #F59E0B

MEDIO:
├─ Background: #FEFCE8 (amarillo muy claro)
├─ Icono/Text: #713F12 (marrón oscuro)
├─ Border: #FDE047 (amarillo suave)
└─ Accent: #FBBF24

BAJO:
├─ Background: #DCFCE7 (verde muy claro)
├─ Icono/Text: #166534 (verde oscuro)
├─ Border: #BBF7D0 (verde suave)
└─ Accent: #10B981

INFO/ÉXITO:
├─ Background: #EFF6FF (azul muy claro)
├─ Icono/Text: #1E40AF (azul oscuro)
├─ Border: #BFDBFE (azul suave)
└─ Accent: #3B82F6
```

---

## 📐 Especificación Completa del Layout Hi-Fi

### HEADER (120px)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ BG: #FFFFFF | BORDER-BOTTOM: 1px #F3F4F6 | SHADOW: 0 1px 3px rgba(0,0,0,0.05)
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ PADDING: 16px 32px                                                       ┃
┃                                                                          ┃
┃ ROW 1 (32px height):                                                     ┃
┃ ┌──────────────────────────────────────────────────────────────────────┐┃
┃ │ Breadcrumb Navigation (12px, #6B7280, line-height: 1.5)              ││
┃ │ Dashboard / Resumen / Control de Pruebas                            ││
┃ │ Separador: / (com espaço 8px) | Hover: color-primary, cursor:pointer││
┃ └──────────────────────────────────────────────────────────────────────┘┃
┃                                                                          ┃
┃ ROW 2 (56px height, display: flex, align-items: center, gap: 24px):    ┃
┃ ┌──────────────────────────────┐  ┌──────────────────────────────────┐┃
┃ │ Title (24px, weight 700,      │  │ Last Updated (12px, #9CA3AF)     ││
┃ │ #111827)                      │  │ 🔄 Actualizado hace 2 minutos    ││
┃ │ Control de Pruebas de         │  │ Hover: tooltip "Refrescar"       ││
┃ │ Usabilidad                    │  │ Click: manual refesh              ││
┃ └──────────────────────────────┘  └──────────────────────────────────┘┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### CONTROL BAR (64px)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ BG: #F9FAFB | BORDER-BOTTOM: 1px #E5E7EB                                ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ PADDING: 12px 32px                                                       ┃
┃ DISPLAY: flex, justify-content: space-between, align-items: center       ┃
┃                                                                          ┃
┃ LEFT SECTION (Date Range Picker):                                       ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │ [📅] Rango de Fechas: Última semana ▼   (14px input field)        │ ┃
┃ │                                                                    │ ┃
┃ │ Quick Select Buttons (horizontal, gap: 8px):                      │ ┃
┃ │ [Hoy] [Esta Semana] [Este Mes] [Trimestre] [Todo]                │ ┃
┃ │ Style: BG #E5E7EB, TEXT #374151, 11px, weight 500                │ ┃
┃ │ Active: BG #2563EB, TEXT #FFFFFF                                  │ ┃
┃ │                                                                    │ ┃
┃ │ Custom Date Range (hidden by default, show on click):             │ ┃
┃ │ [📅 From] [📅 To] [Aplicar] [Cancelar]                           │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃                                                                          ┃
┃ RIGHT SECTION (Actions):                                               ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │  [📊 Exportar PDF]  [⚙️ Configurar]  [📋 Clonar]                 │ ┃
┃ │   PRIMARY button    GHOST button     GHOST button                 │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### KPI PRIMARIOS SECTION (240px)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ BG: #FFFFFF | PADDING: 24px 32px | MARGIN-BOTTOM: 32px                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ GRID: 3-column (4 cols each, 16px gap)                                   ┃
┃                                                                          ┃
┃ ┌──────────────────────────┐ ┌─────────────────────────┐ ┌──────────────┐
┃ │                          │ │                         │ │              │
┃ │    KPI #1: ÉXITO         │ │  KPI #2: CRÍTICOS       │ │ KPI #3:      │
┃ │                          │ │                         │ │ PROGRESO     │
┃ │ ┌──────────────────────┐ │ │ ┌───────────────────────│ │ ┌──────────────
┃ │ │✅ TAREAS EXITOSAS   │ │ │ │🔴 HALLAZGOS CRÍTICOS││ │ │📈 PROGRESO
┃ │ ├──────────────────────┤ │ │ ├───────────────────────│ │ ├──────────────
┃ │ │                      │ │ │ │                       │ │ │
┃ │ │       72%            │ │ │ │        5 ABIERTOS     │ │ │    68%
┃ │ │   (56px, #10B981)    │ │ │ │    (56px, #EF4444)    │ │ │ (56px, #3B82F6)
┃ │ │                      │ │ │ │                       │ │ │
┃ │ │ ↑ +5% esta semana    │ │ │ │ 🔴 Requiere acción    │ │ │ Completadas
┃ │ │ (13px, #059669)      │ │ │ │ (13px, #991B1B)       │ │ │ (13px, #1E40AF)
┃ │ │                      │ │ │ │                       │ │ │
┃ │ │ ┌──────────┬────────┐│ │ │ │ ┌───────────┬────────│ │ │ ┌──────────
┃ │ │ │[Ver D.]  │[Tareas]││ │ │ │ │ [Reportes]│[Más]  │ │ │ │[Roadmap]
┃ │ │ └──────────┴────────┘│ │ │ │ └───────────┴────────│ │ │ └──────────
┃ │ │ BG: #E0F2FE      BG: │ │ │ │ BG: #FEE2E2    BG:  │ │ │ BG: #EFF6FF
┃ │ │ BORDER: 2px #10B981  │ │ │ │ BORDER: 2px #EF4444│ │ │ BORDER: 2px #
┃ │ │ SHADOW: 0 4px 12px   │ │ │ │ SHADOW: 0 4px 12px │ │ │ SHADOW: 0 4px
┃ │ │ rgba(0,0,0,0.08)     │ │ │ │ rgba(0,0,0,0.08)    │ │ │ rgba(0,0,0,0
┃ │ │ RADIUS: 12px         │ │ │ │ RADIUS: 12px        │ │ │ RADIUS: 12px
┃ │ │ HEIGHT: 200px        │ │ │ │ HEIGHT: 200px       │ │ │ HEIGHT: 200px
┃ │ └──────────────────────┘ │ │ └───────────────────────│ │ └──────────────
┃ └──────────────────────────┘ │ │ Hover: shadow 0 8px 16px
┃                              │ │ scale 1.02 cursor:pointer
┃ Hover: AMBOS comportamiento similar
┃ Active: scale 0.98, shadow mínima (deprimido)
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**CARD INTERIOR BREAKDOWN:**
```
┌─────────────────────────────────┐ ← 24px top
│ [✅] TAREAS EXITOSAS      [×]    │ ← 14px, weight 600, flex space-between
├─────────────────────────────────┤ ← 1px #F3F4F6, margin: 12px -24px
│                                 │ ← 12px top
│          72%                     │ ← Number large, centered, 56px weight 700
│   Text: #10B981 (verde)         │
│                                 │ ← 8px
│    ↑ +5% esta semana            │ ← 13px, weight 500, #059669, text-center
│                                 │ ← 16px
│ ┌────────────────────────────────┤
│ │[Ver Detalle →] [Ver Tareas]    │ ← Botones row flex gap-12px justify-center
│ └────────────────────────────────┤ ← Padding 12px top / 24px sides
```

### KPI SECUNDARIOS SECTION (180px)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ BG: #F9FAFB | PADDING: 24px 32px | MARGIN-BOTTOM: 32px | BORDER-TOP: 1px
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ GRID: 3-column (4 cols each, 16px gap)                                   ┃
┃                                                                          ┃
┃ ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐
┃ │                      │ │                      │ │                    │
┃ │  KPI SEC #1: TIEMPO  │ │  KPI SEC #2: ERRORES │ │KPI SEC #3: USUARIOS
┃ │                      │ │                      │ │
┃ │ ┌──────────────────┐ │ │ ┌──────────────────┐ │ │ ┌──────────────────
┃ │ │⏱️ Tiempo Promedio│ │ │ │❌ Errores/Tarea  │ │ │ │👥 Participantes
┃ │ ├──────────────────┤ │ │ ├──────────────────┤ │ │ ├──────────────────
┃ │ │                  │ │ │ │                  │ │ │ │
┃ │ │   4m 32s         │ │ │ │   2.1 por tarea  │ │ │ │   8 de 10
┃ │ │(32px, #374151)   │ │ │ │(32px, #6B7280)   │ │ │ │(32px, #374151)
┃ │ │                  │ │ │ │                  │ │ │ │
┃ │ │Rango: 2m - 8m    │ │ │ │Tendencia: ↓ Bueno│ │ │ │80% Activos
┃ │ │(12px, #9CA3AF)   │ │ │ │(12px, #059669)   │ │ │ │(12px, #6B7280)
┃ │ │                  │ │ │ │                  │ │ │ │
┃ │ │  [Detalle]       │ │ │ │  [Analizar]      │ │ │ │  [Listar]
┃ │ │  GHOST link      │ │ │ │  GHOST link      │ │ │ │  GHOST link
┃ │ └──────────────────┘ │ │ └──────────────────┘ │ │ └──────────────────
┃ │ BG: #FFFFFF          │ │ BG: #FFFFFF          │ │ BG: #FFFFFF
┃ │ BORDER: 1px #F3F4F6  │ │ BORDER: 1px #F3F4F6  │ │ BORDER: 1px #F3F4F6
┃ │ SHADOW: 0 2px 8px    │ │ SHADOW: 0 2px 8px    │ │ SHADOW: 0 2px 8px
┃ │ rgba(0,0,0,0.04)     │ │ rgba(0,0,0,0.04)     │ │ rgba(0,0,0,0.04)
┃ │ RADIUS: 8px          │ │ RADIUS: 8px          │ │ RADIUS: 8px
┃ │ HEIGHT: 160px        │ │ HEIGHT: 160px        │ │ HEIGHT: 160px
┃ └──────────────────────┘ │ └──────────────────────┘ │ └────────────────────
┃ Hover: shadow 0 4px 12px, bg lightens 1%          │
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### CHARTS SECTION (400px altura mínima)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ BG: #FFFFFF | PADDING: 24px 32px | MARGIN-BOTTOM: 32px                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ GRID: 2-column (6 cols each, 24px gap)                                   ┃
┃                                                                          ┃
┃ ┌──────────────────────────────┐ ┌──────────────────────────────┐       ┃
┃ │ 📊 TASA ÉXITO POR TAREA      │ │ 📊 HALLAZGOS POR SEVERIDAD   │       ┃
┃ │                              │ │                              │       ┃
┃ │  Radial Bar Chart            │ │  Bar Chart Horizontal        │       ┃
┃ │  ◐ 85%  ╰─ Tarea A          │ │  Crítica    ████████ 5      │       ┃
┃ │  ◒ 72%  ╰─ Tarea B          │ │  Alta       ████████████ 12 │       ┃
┃ │  ◑ 61%  ╰─ Tarea C          │ │  Media      ██████████ 8    │       ┃
┃ │  ◓ 91%  ╰─ Tarea D          │ │  Baja       █████ 3         │       ┃
┃ │                              │ │                              │       ┃
┃ │ Legend (abajo):              │ │ Legend (derecha):            │       ┃
┃ │ ◾ 60-70% ◾ 70-80% ◾ 80-90% │ │ 🔴 Crítica 🟠 Alta          │       ┃
┃ │                              │ │ 🟡 Media   🟢 Baja          │       ┃
┃ │ Hover: tooltip con valores   │ │ Hover: tooltip con valores   │       ┃
┃ │ Click serie: drill-down      │ │ Click barra: filtro aplicado │       ┃
┃ │                              │ │                              │       ┃
┃ │ [Ver Detalles →] [Exportar]  │ │ [Filtrar por Estado] [Más]   │       ┃
┃ └──────────────────────────────┘ │ └──────────────────────────────┘      ┃
┃                                                                          ┃
┃ ESPECIFICACIONES:                                                        ┃
┃ - Tooltip: BG #111827, TEXT #FFFFFF, padding 8px 12px, radius 6px       ┃
┃ - Values en tooltip: 13px, weight 600                                    ┃
┃ - Chart height: 320px (responsive a viewport)                           ┃
┃ - Gridlines: #F3F4F6 (muy suave)                                         ┃
┃ - Axis labels: 11px, #6B7280                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

### ACTIVITY SECTION (Min 320px altura)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ BG: #F9FAFB | BORDER-TOP: 2px #E5E7EB | PADDING: 24px 32px              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                          ┃
┃ HEADER ROW (display: flex, justify-content: space-between):             ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │ 🔔 ALERTAS Y ACTIVIDAD RECIENTE (16px, weight 600, #111827)      │ ┃
┃ │ Subtítulo: Últimas 24 horas (12px, weight 400, #6B7280)          │ ┃
┃ │                                 [Marcar todo leído] [⋮]           │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃ Margin-bottom: 16px                                                     ┃
┃                                                                          ┃
┃ ALERTS CONTAINER (max-height: 400px, overflow-y: auto, scroll smooth):  ┃
┃                                                                          ┃
┃ ALERT ITEM #1 (CRÍTICO):                                                ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │🔴│ [16:45] CRÍTICO - Botón login no visible             [X]      │ ┃
┃ │  │ Detectado en Tarea 3 por 4 usuarios (2 en sesión)              │ ┃
┃ │  │ Afecta 40% de la experiencia                                   │ ┃
┃ │  │ [Reportar] [Ignorar] [VER DETALLES →]                         │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃ BG: #FEF2F2 | LEFT-BORDER: 4px #EF4444 | Padding: 16px                ┃
┃ Margin-bottom: 12px | Radius: 8px | Shadow: 0 1px 3px rgba(0,0,0,0.05)│
┃ Hover: BG #FDE8E8, shadow aumenta                                       ┃
┃                                                                          ┃
┃ ALERT ITEM #2 (MODERADO):                                               ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │🟠│ [15:20] MODERADO - 2 participantes offline            [X]      │ ┃
┃ │  │ Juan López, María García - Sesión incompleta                   │ ┃
┃ │  │ [Contactar] [Reenviar link] [Ignorar]                         │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃ BG: #FFFBEB | LEFT-BORDER: 4px #F59E0B | Padding: 16px                ┃
┃                                                                          ┃
┃ ALERT ITEM #3 (INFO):                                                   ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │🟡│ [14:10] INFO - Nueva prueba iniciada "Checkout Flow"  [X]      │ ┃
┃ │  │ 3 de 5 participantes activos, sesiones durando 12-18 min       │ ┃
┃ │  │ [Ver estado] [Notas]                                           │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃ BG: #FEFCE8 | LEFT-BORDER: 4px #FBBF24                                 ┃
┃                                                                          ┃
┃ ALERT ITEM #4 (COMPLETADO):                                             ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │✅│ [13:45] COMPLETADO - Prueba "Sign-up" terminada     [X]        │ ┃
┃ │  │ 7 de 10 participantes completaron · 95% éxito promedio         │ ┃
┃ │  │ [Ver Reporte] [Archivar]                                       │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃ BG: #DCFCE7 | LEFT-BORDER: 4px #10B981                                 ┃
┃                                                                          ┃
┃ FOOTER (sticky bottom of alerts section):                               ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │ [← Cargar más]  [Marcar todo como leído]  [Limpiar historial]    │ ┃
┃ │  (12px, ghost links)                                              │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃ Padding-top: 12px, Border-top: 1px #F3F4F6                              ┃
┃                                                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 🎯 Botones - Especificación Completa

### PRIMARY Button (Azul, Acciones principales)
```
┌─────────────────────────┐
│ 📊 Exportar PDF         │
└─────────────────────────┘

STATES:
- Idle: BG #2563EB, TEXT #FFFFFF, shadow 0 2px 8px rgba(37,99,235,0.3)
- Hover: BG #1D4ED8, shadow 0 4px 12px rgba(37,99,235,0.4), scale 1.02
- Active: BG #1E40AF, scale 0.98
- Disabled: BG #D1D5DB, TEXT #9CA3AF, cursor not-allowed, opacity 0.5

PADDING: 10px 16px
HEIGHT: 36px
BORDER-RADIUS: 6px
FONT: 13px, weight 600, uppercase letter-spacing: 0.5px
TRANSITION: all 150ms ease-out
```

### SECONDARY Button (Bordered, Acciones secundarias)
```
┌──────────────────────────┐
│ 🔍 Ver Detalles         │
└──────────────────────────┘

STATES:
- Idle: BG transparent, TEXT #2563EB, BORDER 1px #2563EB
- Hover: BG #EFF6FF, BORDER #1D4ED8, TEXT #1D4ED8
- Active: BG #DBEAFE, BORDER #1E40AF
- Disabled: Similar a PRIMARY

PADDING: 10px 16px
HEIGHT: 36px
BORDER-RADIUS: 6px
FONT: 13px, weight 600
```

### GHOST Button (Text-only, Enlaces)
```
[Ver Detalles →]

STATES:
- Idle: TEXT #2563EB, text-decoration: underline
- Hover: TEXT #1D4ED8, underline-thicker
- Active: TEXT #1E40AF, text-decoration: underline
- Disabled: TEXT #D1D5DB

FONT: 12px, weight 500
NO PADDING, inline
Cursor: pointer
TRANSITION: color 100ms, text-decoration 100ms
```

### ICON Button (Solo icono, acciones)
```
[🔄] (refrescar)

STATES:
- Idle: BG transparent, TEXT #6B7280
- Hover: BG #F3F4F6, TEXT #374151, rotate 180deg
- Active: BG #E5E7EB, TEXT #374151

SIZE: 32x32px (icon 16x16px inside)
BORDER-RADIUS: 6px
TRANSITION: all 200ms ease-out
aria-label: Required
tooltip on hover
```

---

## 🎨 Iconos Utilizados (Lucide React)

```javascript
// Importar desde lucide-react
import {
  // Navigation & Actions
  LayoutDashboard,      // Dashboard
  ClipboardList,        // Plan de pruebas
  ListChecks,           // Tareas
  Users,                // Participantes
  Eye,                  // Ver / Observaciones
  FileSearch,           // Hallazgos / Reportes
  ChevronRight,         // Acciones (drill-down)
  ChevronDown,          // Expandir
  
  // Status & Severity
  CheckCircle,          // Completado (verde)
  AlertCircle,          // Advertencia (ámbar)
  AlertTriangle,        // Crítico (rojo)
  
  // Data & Charts
  TrendingUp,           // Tendencia positiva
  TrendingDown,         // Tendencia negativa
  BarChart3,            // Gráficos
  PieChart,             // Gráficos circulares
  
  // Actions
  RefreshCw,            // Actualizar
  Download,             // Descargar
  Share2,               // Compartir
  Settings,             // Configurar
  MoreVertical,         // Más opciones
  
  // UI
  X,                    // Cerrar
  Search,               // Buscar
  Calendar,             // Calendario
  Bell,                 // Notificaciones
  Info,                 // Información
  HelpCircle,           // Ayuda
} from 'lucide-react'
```

---

## 🎬 Animaciones y Transiciones

```css
/* Card Entrance */
@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.kpi-card { animation: cardFadeIn 300ms ease-out; }

/* Number Update Pulse */
@keyframes numberPulse {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(16, 185, 129, 0.2); }
}
.kpi-number-updated { animation: numberPulse 600ms ease-in-out; }

/* Skeleton Loading Shimmer */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}

/* Alert Slide In */
@keyframes alertSlideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.alert-item { animation: alertSlideIn 250ms ease-out; }

/* Hover Elevation */
.kpi-card {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.kpi-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

/* Button State Transition */
button {
  transition: all 150ms ease-out;
}
button:active {
  transform: scale(0.98);
}
```

---

## 📱 Responsive Design - Mobile/Tablet

### Mobile (< 768px)
```
HEADER: 100px (reducido)
  Breadcrumb: oculto en móvil (mostrar en iconos)
  Título: 20px (reducido)

CONTROL BAR: 120px (apilado)
  Daterange: 100% ancho
  Botones: apilados en row debajo

KPI PRIMARIOS:
  - 1-column (100% - 32px padding)
  - Altura: 160px (compacta)
  - Font números: 40px
  - Botones: apilados

KPI SECUNDARIOS:
  - 1-column
  - Altura: 120px

CHARTS:
  - 1-column (vertical stack)
  - Height: auto (min 300px)

ACTIVITY:
  - 100% ancho
  - Alert items más compact
```

### Tablet (768px - 1023px)
```
GRILLA: Sigue igual pero con márgenes reducidos
  - Márgenes: 16px left/right
  - Padding: 16px (componentes)

KPIs: Still 3-column pero con spacing reducido
CHARTS: Still 2-column

FONT: Reducida 1-2px en lugares secundarios
```

---

## 🧪 Estado de Carga

```
SKELETON LOADERS:
┌──────────────────────┐
│ ░░░░░░░░░░░░░░░░░░  │  ← Shimmer animation
│                      │
│     ░░░░░░░░░░░░     │
│                      │
│  ░░░░░░░  ░░░░░░░░   │
└──────────────────────┘

CHART SKELETON:
┌──────────────────────┐
│ ░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░  │
│ ░░░░░░░░░░░░░░░░░░  │
└──────────────────────┘

Shimmer: Linear gradient left-to-right, 2s infinite
```

---

## ✅ Aplicación de Principios UX en Hi-Fi

| Principio | Implementación |
|-----------|-----------------|
| **Jerarquía Visual** | Tamaños escalonados (56px, 32px, 14px), pesos (700, 600, 400), colores primarios |
| **Gestalt - Proximidad** | Cards agrupadas por tipo, gaps consistentes 16px |
| **Contraste** | Ratios 4.5:1+ para todos los textos, colores de severidad claros |
| **Feedback** | Hover states, loading skeletons, transitions suaves |
| **Navegación** | Breadcrumbs, botones contextuales en cada card |
| **Accesibilidad** | aria-labels, color + icono para severidad, keyboard navigation |
| **Emocional** | Colores significativos (rojo=urgencia), iconos reconocibles |

---

**Estado:** Listo para implementación en React/Next.js con Tailwind CSS  
**Siguiente:** Commit de Fase 3 con todos los wireframes  