# Dashboard Mejorado - Wireframe Mid-Fi

**Proyecto:** Usability Test Dashboard 2.0  
**Fase:** 3 - Rediseño UX  
**Fidelidad:** Media (componentes, dimensiones, grilla, paleta base)  
**Especificación:** Grilla 12-col, tipografía base, componentes reutilizables  

---

## 📏 Especificación de Grilla y Espaciado

```
VIEWPORT: 1440px (desktop estándar)
GRILLA: 12 columnas, 8px base unit
MÁRGENES: 24px (3 units) top/bottom, 32px (4 units) left/right
GUTTER: 16px (2 units) entre columnas
RADIUS: 8px base (componentes), 12px cards
Z-INDEX: 0=base, 10=dropdown, 20=modal, 100=toast
```

**Breakpoints:**
- Desktop: 1440px+
- Tablet: 768px - 1439px
- Mobile: < 768px

---

## 🎨 Paleta de Colores Base (Tema Claro)

```
PRIMARIOS:
├─ Azul Primario: #2563EB (para acciones, links)
├─ Rojo Urgencia: #DC2626 (errores, críticos)
├─ Naranja Advertencia: #EA580C (moderados, warnings)
├─ Verde Éxito: #16A34A (positivos, completados)
└─ Gris Neutral: #6B7280 (deshabilitado, secundario)

BACKGROUNDS:
├─ Blanco Principal: #FFFFFF
├─ Gris Claro: #F9FAFB (secciones alternas)
├─ Gris Borde: #E5E7EB (separadores)
└─ Gris Oscuro: #374151 (text principal)

TEXTOS:
├─ Primario: #111827 (headings, acciones)
├─ Secundario: #6B7280 (labels, hints)
├─ Invertido: #FFFFFF (sobre colores)
└─ Desactivado: #D1D5DB
```

---

## 📐 Sistema de Componentes

### Card Base - Primaria (KPI Crítico)

```
┌─────────────────────────────────────┐
│ [ICON] TÍTULO KPI                   │  
│ ─────────────────────────────────────│
│                                     │
│        NÚMERO GRANDE                │
│          72%                        │
│                                     │
│  Contexto pequeño: ↑ +5% esta semana│
│                                     │
│  ┌────────────────┐ ┌────────────────┐
│  │  [Botón 1]     │ │  [Botón 2]     │
│  └────────────────┘ └────────────────┘
└─────────────────────────────────────┘

DIMENSIONES:
- Ancho: 4 columnas (grid 12) = 400px
- Alto: 200px (fixed)
- Padding: 24px (3 units)
- Gap botones: 12px

TIPOGRAFÍA:
- Título: 14px, peso 600, color gris
- Número: 56px, peso 700, color primario del KPI
- Contexto: 13px, peso 500, color gris
- Botones: 12px, peso 600, uppercase

SHADOW: 0 4px 12px rgba(0,0,0,0.08)
BORDER: 1px solid #E5E7EB
RADIUS: 12px

ESTADOS:
- Idle: sombra base
- Hover: shadow +2px, background +1% contraste
- Active: shadow -4px (deprimido)
```

### Card Base - Secundaria (KPI Info)

```
┌─────────────────────────────────────┐
│ [ICON 16px] TÍTULO                  │
│ ───────────────────────────────────  │
│                                     │
│      NÚMERO (32px)                  │
│         4m 32s                      │
│                                     │
│  Rango: 2m - 8m                    │
│  [Link Opcional]                    │
└─────────────────────────────────────┘

DIMENSIONES:
- Ancho: 3 columnas = 300px (en desktop 1440)
- Alto: 160px
- Padding: 20px

TIPOGRAFÍA:
- Número: 32px, peso 600
- Rango/Context: 12px, peso 400, gris

SHADOW: 0 2px 8px rgba(0,0,0,0.04)
BORDER: 1px solid #F3F4F6
RADIUS: 8px
BACKGROUND: #FAFBFC (muy suave)
```

### Botón de Acción

```
VARIANTES:

1. PRIMARY (Acción importante):
   ┌─────────────────┐
   │  [→] Ver Detalles│
   └─────────────────┘
   BG: #2563EB
   TEXT: #FFFFFF
   PADDING: 10px 16px
   HEIGHT: 36px
   WEIGHT: 600
   SIZE: 13px
   RADIUS: 6px
   HOVER: BG #1D4ED8, shadow +2px

2. SECONDARY (Acción terciaria):
   ┌─────────────────┐
   │  Ir a Reportes  │
   └─────────────────┘
   BG: transparent
   TEXT: #2563EB
   BORDER: 1px #2563EB
   HOVER: BG #EFF6FF, border #1D4ED8

3. GHOST (Links):
   [Ver Detalles]
   BG: none
   TEXT: #2563EB, underline
   HOVER: TEXT #1D4ED8, darker underline
```

### Badge de Estado

```
SEVERIDAD:
┌───────────────┐
│ 🔴 Crítica    │  BG: #FEE2E2, TEXT: #991B1B, BORDER: 1px #FECACA
└───────────────┘

┌───────────────┐
│ 🟠 Alta       │  BG: #FEF3C7, TEXT: #92400E, BORDER: 1px #FCD34D
└───────────────┘

┌───────────────┐
│ 🟡 Media      │  BG: #FEF08A, TEXT: #713F12, BORDER: 1px #FDE047
└───────────────┘

┌───────────────┐
│ 🟢 Baja       │  BG: #DCFCE7, TEXT: #166534, BORDER: 1px #BBF7D0
└───────────────┘

PADDING: 6px 12px
BORDER-RADIUS: 6px
FONT: 12px, peso 600
```

---

## 🖼️ Layout Mid-Fi Completo (1440px)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ HEADER (120px) - BG: #FFFFFF, BORDER-BOTTOM: 1px #E5E7EB                ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Padding: 20px 32px                                                       ┃
┃                                                                          ┃
┃ ROW 1: Breadcrumb (12-col)                                              ┃
┃ ┌────────────────────────────────────────────────────────────────────┐ ┃
┃ │ Dashboard > Resumen (12px, #6B7280)                               │ ┃
┃ └────────────────────────────────────────────────────────────────────┘ ┃
┃                                                                          ┃
┃ ROW 2: Título + Controles (12-col con gap 16px)                         ┃
┃ ┌─────────────────────────────────────────────┐ ┌──────────────────┐  ┃
┃ │ Control de Pruebas de Usabilidad            │ │ 🔄 Hace 2 min   │  ┃
┃ │ (24px, weight 700)                          │ │ (Hover: refresh) │  ┃
┃ └─────────────────────────────────────────────┘ └──────────────────┘  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ CONTROL BAR (60px) - BG: #F9FAFB, BORDER-BOTTOM: 1px #E5E7EB            ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Padding: 12px 32px                                                       ┃
┃ Display: Flex, align-items: center, justify-content: space-between      ┃
┃                                                                          ┃
┃ ┌─────────────────────────────────────────────┐  ┌────────┐ ┌────────┐┃
┃ │ [📅 Rango: Última semana ▼] (3 col)         │  │ PDF    │ │  ⚙️   ││
┃ │ Preset: Hoy, Semana, Mes, Trimestre, Todos  │  │[Export]│ │[Config││
┃ │ Custom: Selector dual de fechas              │  └────────┘ └────────┘┃
┃ └─────────────────────────────────────────────┘                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ KPI PRIMARIOS (240px) - BG: #FFFFFF                                      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Padding: 24px 32px                                                       ┃
┃ Margin-bottom: 24px                                                      ┃
┃                                                                          ┃
┃ GRID 3-COLUMN (4-col each, 16px gap):                                    ┃
┃ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    ┃
┃ │              │  │              │  │              │                    ┃
┃ │   KPI #1     │  │   KPI #2     │  │   KPI #3     │                    ┃
┃ │  (Éxito)     │  │  (Críticos)  │  │  (Progreso)  │                    ┃
┃ │              │  │              │  │              │                    ┃
┃ └──────────────┘  └──────────────┘  └──────────────┘                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ KPI SECUNDARIOS (180px) - BG: #F9FAFB                                    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Padding: 24px 32px                                                       ┃
┃ Margin-bottom: 32px                                                      ┃
┃                                                                          ┃
┃ GRID 3-COLUMN (4-col each, 16px gap):                                    ┃
┃ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    ┃
┃ │              │  │              │  │              │                    ┃
┃ │  KPI Sec #1  │  │  KPI Sec #2  │  │  KPI Sec #3  │                    ┃
┃ │   (Tiempo)   │  │   (Errores)  │  │(Participantes)                    ┃
┃ │              │  │              │  │              │                    ┃
┃ └──────────────┘  └──────────────┘  └──────────────┘                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ CHARTS SECTION (400px) - BG: #FFFFFF                                     ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Padding: 24px 32px                                                       ┃
┃ Margin-bottom: 32px                                                      ┃
┃                                                                          ┃
┃ GRID 2-COLUMN (6-col each, 24px gap):                                    ┃
┃ ┌────────────────────┐  ┌────────────────────┐                           ┃
┃ │  Gráfico #1        │  │  Gráfico #2        │                           ┃
┃ │  (Éxito por Tarea) │  │  (Hallazgos)       │                           ┃
┃ │  - Radial Chart    │  │  - Bar Chart H.    │                           ┃
┃ │  - 320x320         │  │  - 320x280         │                           ┃
┃ │  - Legend abajo    │  │  - Legend derecha  │                           ┃
┃ │                    │  │                    │                           ┃
┃ │  [Ver Detalles]    │  │  [Filtrar]         │                           ┃
┃ └────────────────────┘  └────────────────────┘                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ACTIVITY SECTION (320px min) - BG: #F9FAFB                               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃ Padding: 24px 32px                                                       ┃
┃ Border-top: 1px #E5E7EB                                                  ┃
┃                                                                          ┃
┃ HEADER: "🔔 Alertas Recientes (últimas 24h)" (16px, weight 600)        ┃
┃ Margin-bottom: 16px                                                      ┃
┃                                                                          ┃
┃ ITEMS (4 visible, scroll para más):                                      ┃
┃ ┌──────────────────────────────────────────────────────────────────┐   ┃
┃ │ 🔴 [16:45] Crítico - Botón login no encontrado                 │   ┃
┃ │      Detectado en Tarea 3 por 4 usuarios  [VER]               │   ┃
┃ └──────────────────────────────────────────────────────────────────┘   ┃
┃ ┌──────────────────────────────────────────────────────────────────┐   ┃
┃ │ 🟠 [15:20] Moderado - 2 usuarios offline                        │   ┃
┃ │      Sesión incompleta  [CONTACTAR]                            │   ┃
┃ └──────────────────────────────────────────────────────────────────┘   ┃
┃ ┌──────────────────────────────────────────────────────────────────┐   ┃
┃ │ 🟡 [14:10] Info - Prueba iniciada "Checkout"                    │   ┃
┃ │      3 de 5 participantes activos                              │   ┃
┃ └──────────────────────────────────────────────────────────────────┘   ┃
┃ ┌──────────────────────────────────────────────────────────────────┐   ┃
┃ │ ✅ [13:45] Completado - "Sign-up" terminada con 95% éxito       │   ┃
┃ │      7 hallazgos encontrados  [REVISAR]                        │   ┃
┃ └──────────────────────────────────────────────────────────────────┘   ┃
┃                                                                          ┃
┃ FOOTER: [← Anteriores]  [Marcar todo como leído]  [Limpiar]             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

FOOTER PADDING: 24px (bottom)
```

---

## 🎯 Componentes Detallados

### KPI Primario - ESPECIFICACIÓN COMPLETA

```
┌─────────────────────────────────────────────────────┐
│  [✅] TAREAS EXITOSAS                   [×] collapse │ Zona: 24px top
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │ Zona: 20px
│                     72%                             │
│              (56px, weight 700)                     │
│         Color: #16A34A (verde éxito)               │
│                                                     │ Zona: 12px
│              ↑ +5% esta semana                      │
│          (13px, weight 500, gris)                   │
│          (💡 Indica tendencia positiva)             │
│                                                     │ Zona: 16px
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  [Ver Detalle]   │  │  [Ver Tareas]    │        │
│  │  (12px, azul)    │  │  (12px, borde)   │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │ Zona: 12px bottom
└─────────────────────────────────────────────────────┘

ANCHO TOTAL: 400px (4 columnas en grid 12-col de 1440px)
ALTO TOTAL: 200px
PADDING INTERIOR: 24px (todos lados)

COLOR POR TIPO KPI:
- Éxito/Positivo: Green (#16A34A)
- Crítico/Urgent: Red (#DC2626)
- Progreso: Blue (#2563EB)

TRANSICIONES:
- Box-shadow: 150ms ease-out
- Scale hover: 1.02
- Opacity cambio: 200ms smooth
```

### Alert Item - ESPECIFICACIÓN

```
┌────────────────────────────────────────────────────────┐
│ 🔴 [16:45]  Crítico - Botón login no encontrado  [×]  │
│ ───────────────────────────────────────────────────────│
│ Detectado en Tarea 3 por 4 usuarios · Afecta 40%      │
│ [Reportar] [Ignorar] [VER DETALLES →]                 │
│                                                       │
│ Opacidad: 100%, BG: #FEF2F2 (rojo muy claro)          │
│ BorderL: 4px solid #DC2626 (izquierda)                │
│ Padding: 16px                                          │
│ Margin-bottom: 12px                                    │
│ Radius: 8px                                            │
└────────────────────────────────────────────────────────┘

ELEMENTO IMPORTANTE:
- Icono + Severity color left border comunica urgencia
- Timestamp 12px gris (16:45)
- Descripción 14px (principal)
- Contexto adicional 12px gris (segunda línea)
- Botones de acción abajo derecha
```

---

## 🔄 Estados y Transiciones

```
CARD STATES:
├─ Default: shadow 0 2px 8px rgba(0,0,0,0.08)
├─ Hover: shadow 0 8px 16px rgba(0,0,0,0.12), scale 1.02
├─ Active/Click: shadow 0 1px 4px rgba(0,0,0,0.08), scale 0.98
└─ Disabled: opacity 0.5, cursor not-allowed

LOADING STATE:
├─ Skeleton placeholder (shimmer animation 2s infinite)
├─ Progress: Incremento visible de valor
└─ Complete: Fade-in suave 300ms

ALERT ANIMATIONS:
├─ Entrada: Slide-in desde arriba 250ms ease-out
├─ Hover: Background lightens 150ms
└─ Salida: Fade-out 200ms, collapse 300ms ease-in
```

---

## 📱 Responsive (Tablet & Mobile)

### Tablet (768px - 1023px)
```
- KPIs: Aún 3-column pero con más padding
- Gráficos: Aún 2-column
- Font sizes: -1px (48px → 48px en número)
```

### Mobile (< 768px)
```
STACK VERTICAL:

Header: 100% ancho
Control Bar: 100% ancho (inputs apilados)

KPIs Primarios: 
├─ 100% ancho (1-column)
├─ Altura: 180px (compacta)
├─ Font: 40px número, 12px contexto
└─ Botones: Apilados 8px gap

KPIs Secundarios:
├─ 100% ancho (1-column)
├─ Altura: 140px

Gráficos: 100% ancho, apilados verticalmente

Alertas: 100% ancho, cards más compactos

PADDING GENERAL: 16px left/right, 12px top/bottom
```

---

## ✨ Microinteracciones

```
1. HOVER EN KPI:
   - Shadow aumenta 2px vertical
   - Background sube 1%
   - Cursor: pointer
   - Botones se revelan más prominentes

2. HOVER EN BOTÓN:
   - Background oscurece 10%
   - Scale 1.05
   - Shadow aumenta

3. CLICK EN ALERTA:
   - Se expande mostrando detalles completos
   - O navega a vista detallada
   - Toast confirma acción

4. ENTRADA DE PÁGINA:
   - Header fade-in 200ms
   - KPIs stagger-fade 100ms cada uno
   - Gráficos skeleton → content 400ms
   - Alertas slide-in cascade 150ms cada uno

5. DATA UPDATE:
   - Número cambia: flash 200ms (background color cambio)
   - Flecha ↑/↓ aparece suavemente
   - Después de 2s vuelve a normal
```

---

## 📋 Especificación Fuente

```
TIPOGRAFÍA:

Headings:
├─ H1: 28px, weight 700, #111827 (títulos principales)
├─ H2: 24px, weight 600, #111827 (títulos secciones)
├─ H3: 18px, weight 600, #374151 (subtítulos)
└─ H4: 16px, weight 600, #374151 (card titles)

Body:
├─ Body L: 16px, weight 400, #374151 (descripción)
├─ Body M: 14px, weight 400, #6B7280 (normal text)
├─ Body S: 12px, weight 400, #9CA3AF (secondary)
└─ Body XS: 11px, weight 400, #D1D5DB (hints)

Numbers:
├─ Large: 56px, weight 700 (KPI primario)
├─ Medium: 32px, weight 600 (KPI secundario)
└─ Small: 20px, weight 600 (en charts)

Mono: "SF Mono", "Monaco", monospace (para values en tables)
Font Family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
```

---

**SIGUIENTE PASO:** Crear wireframe Hi-Fi con colores finales, ilustraciones, y especificación visual completa.