# Evaluación Heurística UX - Usability Test Dashboard 2.0

**Evaluador:** UX Engineer  
**Fecha:** 15 de mayo, 2026  
**Versión del Aplicativo:** 1.0.0  
**Método:** Nielsen's 10 Usability Heuristics  
**Alcance Evaluado:** Dashboard, Formularios, Navegación, Reportes (sin Login)

---

## Escala de Severidad

| Nivel | Definición | Acción |
|-------|-----------|--------|
| 🔴 Crítico | Bloquea flujo principal, alta frustración | Prioritario Sprint 1 |
| 🟠 Moderado | Afecta experiencia pero no bloquea | Sprint 2 |
| 🟡 Leve | Mejora cosmética, bajo impacto | Sprint 3+ |

---

## Problemas Identificados (EVALUACIÓN REAL DEL CÓDIGO)

### 1. **Ausencia de Breadcrumbs para Orientación** 🔴 CRÍTICO
- **Ubicación:** Todas las páginas (Dashboard, Plan, Tareas, Participantes, Observaciones, Hallazgos)
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** No hay indicador de ubicación del usuario en la jerarquía del sitio. El usuario no sabe dónde está ni cómo volvería atrás.
- **Impacto:** Desorientación, usuario no sabe ruta de navegación
- **Línea de Código:** `app-shell.tsx` - No existe componente breadcrumb
- **Solución Técnica:** Crear componente `Breadcrumb.tsx` usando `usePathname()` y mapear rutas a labels
- **Esfuerzo:** 5 pts

---

### 2. **Sin Indicador Visual de Carga en Dashboard** 🔴 CRÍTICO
- **Ubicación:** Dashboard principal al cargar métricas
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** El estado `loading` existe pero no hay skeleton o spinner visible. El usuario ve pantalla vacía sin saber si está cargando.
- **Impacto:** Usuario cree que la página está rota o no responde
- **Línea de Código:** `dashboard-view.tsx:100-110` - `if (loading) return <div>...</div>` no renderiza nada
- **Solución Técnica:** Agregar skeleton loaders para KPIs y gráficos
- **Esfuerzo:** 3 pts

---

### 3. **Sin Confirmación Modal en Eliminación** 🟠 MODERADO
- **Ubicación:** Botones Eliminar en tablas (Participantes, Tareas, Observaciones)
- **Heurística:** 5. Prevención de errores + 9. Ayuda y documentación
- **Descripción:** Estado `deleteConfirm` existe pero no hay modal confirmatorio. Usuario puede eliminar accidentalmente sin confirmación.
- **Impacto:** Pérdida accidental de datos, sin opción de recuperación
- **Línea de Código:** `participantes-view.tsx:190`, `tareas-view.tsx:310`, `observaciones-view.tsx:360`
- **Solución Técnica:** Mostrar `AlertDialog` confirmatorio antes de ejecutar DELETE
- **Esfuerzo:** 2 pts

---

### 4. **Tablas No Responsivas en Móvil** 🟠 MODERADO
- **Ubicación:** Tablas de participantes, tareas, observaciones, hallazgos
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Las tablas HTML no se adaptan a pantallas pequeñas, causando scroll horizontal y corte de contenido
- **Impacto:** Usuarios en móvil no pueden ver completamente los datos o interactuar con botones
- **Línea de Código:** Las tablas usan clase HTML genérica sin media queries ni `overflow-x-auto`
- **Solución Técnica:** Implementar `ResponsiveTable` con stacking en móvil o usar cards en lugar de tabla
- **Esfuerzo:** 5 pts

---

### 5. **Campos Requeridos sin Indicación Visual** 🟡 LEVE
- **Ubicación:** Todos los formularios (Participantes, Tareas, Observaciones, Plan)
- **Heurística:** 5. Prevención de errores
- **Descripción:** Los campos obligatorios definidos en Zod (`.min(1)`) no tienen asterisco o marcas visuales en los labels
- **Impacto:** Usuario no sabe qué campos son obligatorios hasta intentar enviar
- **Línea de Código:** `participantes-view.tsx:58`, `tareas-view.tsx:11` - input sin indicador de requerido
- **Solución Técnica:** Agregar `<span className="text-destructive">*</span>` en labels de campos requeridos
- **Esfuerzo:** 1 pt

---

### 6. **Ícones en Botones sin Etiqueta** 🟡 LEVE
- **Ubicación:** Botones de acciones en tablas (Editar, Eliminar, Ver)
- **Heurística:** 1. Visibilidad del estado del sistema + 4. Compatibilidad con mundo real
- **Descripción:** Botones usan solo ícones (Pencil, Trash2, Eye) sin texto. Usuario debe hovear o tener conocimiento previo
- **Impacto:** Confusión sobre qué hace cada botón, especialmente para nuevos usuarios
- **Línea de Código:** `observaciones-view.tsx` - `<button><Eye className="w-4 h-4" /></button>`
- **Solución Técnica:** Agregar `aria-label` y tooltip o mostrar texto al lado del ícono
- **Esfuerzo:** 2 pts

---

### 7. **Jerarquía Visual Débil en Dashboard** 🟠 MODERADO
- **Ubicación:** Dashboard principal - sección de KPIs y gráficos
- **Heurística:** 2. Correspondencia entre sistema y mundo real
- **Descripción:** Todos los KPIs tienen tamaño similar. No hay diferenciación visual entre métricas "críticas" vs "informativas"
- **Impacto:** Usuario no identifica rápidamente las métricas más importantes
- **Línea de Código:** `dashboard-view.tsx:250-300` - KPIs con clases iguales
- **Solución Técnica:** Usar tamaño, color y posición para destacar KPIs críticos (Tareas Exitosas, Hallazgos Críticos)
- **Esfuerzo:** 4 pts

---

### 8. **Filtros No Descubiertos en Plan de Prueba** 🟡 LEVE
- **Ubicación:** Página de Plan de Prueba
- **Heurística:** 4. Compatibilidad entre sistema y mundo real
- **Descripción:** Estado `filterOpen: false` por defecto oculta completamente los filtros. Usuario puede no notar el botón Filter pequeño
- **Impacto:** Usuarios no usan filtrado disponible, resulta en búsqueda manual ineficiente
- **Línea de Código:** `plan-view.tsx:182-230` - filtros collapsibles hidden
- **Solución Técnica:** Mostrar filtros por defecto o hacer botón más visible con ícono + "Filtros"
- **Esfuerzo:** 2 pts

---

### 9. **Errores Genéricos sin Detalles** 🟠 MODERADO
- **Ubicación:** Manejo de errores en fetch de datos
- **Heurística:** 9. Ayuda y documentación + 1. Visibilidad del estado
- **Descripción:** Mensajes de error genéricos como "No se pudieron cargar..." sin especificar problema real (conexión, validación, etc.)
- **Impacto:** Usuario no sabe por qué falló ni cómo resolverlo. Difícil debugging
- **Línea de Código:** `dashboard-view.tsx:120`, `participantes-view.tsx:80` - catch sin detalles
- **Solución Técnica:** Mostrar código de error HTTP, mensaje backend específico o sugerir acción
- **Esfuerzo:** 2 pts

---

### 10. **Sin Validación Visual en Tiempo Real** 🟠 MODERADO
- **Ubicación:** Formularios (especialmente de Observaciones y Tareas)
- **Heurística:** 5. Prevención de errores
- **Descripción:** Zod valida pero los errores solo aparecen tras submit, no al escribir. Campo `tiempoSegundos` puede recibir -1
- **Impacto:** Usuario completa formulario y recibe error al final, debe corregir sin saber qué estaba mal
- **Línea de Código:** `observaciones-view.tsx:11` - `tiempoSegundos: z.number().min(1).max(3600)` sin validación inline
- **Solución Técnica:** Mostrar error message bajo campo con `formState: { errors }` al cambiar
- **Esfuerzo:** 3 pts

---

### 11. **Contraste Insuficiente en Algunos Textos** 🟡 LEVE
- **Ubicación:** Textos de descripción en navegación y badges
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Textos grises (`text-muted-foreground`) pueden tener ratio de contraste < 4.5:1 en algunos temas
- **Impacto:** Difícil lectura para usuarios con baja visión
- **Línea de Código:** `app-shell.tsx:56` - `text-sidebar-foreground/50`, `dashboard-view.tsx` - badges con colores claros
- **Solución Técnica:** Validar contraste con axe DevTools, aumentar opacidad mínima a 60%
- **Esfuerzo:** 2 pts

---

### 12. **Sin Feedback Visual de Progreso en Guardado** 🟡 LEVE
- **Ubicación:** Botones de guardar en formularios
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Botón "Guardar" no cambia de estado (loading, disabled) mientras se procesa la solicitud
- **Impacto:** Usuario puede hacer click múltiples veces, causando duplicados. No ve que está procesando
- **Línea de Código:** `participantes-view.tsx:145-160` - botón sin estado de loading
- **Solución Técnica:** Agregar `isLoading` state, deshabilitar botón y mostrar spinner mientras POST está en vuelo
- **Esfuerzo:** 2 pts

---

## Resumen por Severidad

| Severidad | Cantidad | Problemas | Effort Total | Priority |
|-----------|----------|-----------|------------|----------|
| 🔴 Crítico | 3 | #1, #2, #3 | 10 pts | Sprint 1 |
| 🟠 Moderado | 4 | #4, #7, #9, #10 | 13 pts | Sprint 2 |
| 🟡 Leve | 5 | #5, #6, #8, #11, #12 | 9 pts | Sprint 3+ |
| **TOTAL** | **12** | - | **32 pts** | - |

---

## Matriz de Problemas vs Heurísticas Nielsen

| Heurística | Problemas | Severidad |
|-----------|-----------|-----------|
| 1. Visibilidad del estado | #1, #2, #6, #11, #12 | Crítico-Leve |
| 2. Correspondencia | #7, #8 | Moderado-Leve |
| 4. Compatibilidad | #6, #8 | Leve |
| 5. Prevención de errores | #3, #5, #10 | Moderado-Leve |
| 7. Flexibilidad/Eficiencia | #4 | Moderado |
| 9. Ayuda/Documentación | #3, #9 | Crítico-Moderado |

---

## Validación de Accesibilidad (WCAG 2.1 AA)

| Criterio | Estado | Problema |
|----------|--------|---------|
| Contraste (4.5:1) | ⚠️ Parcial | #11 - Algunos textos grises bajos |
| Navegación Teclado | ✅ Completo | Sidebar y formularios son navegables |
| ARIA Labels | ⚠️ Parcial | #6 - Botones sin `aria-label` |
| Etiquetas Form | ✅ Completo | Labels están presentes pero sin requerido |
| Estructura Headings | ✅ Completo | Estructura semántica correcta |

---

## Recomendaciones Estratégicas

### Corto Plazo (Sprint 1 - CRÍTICOS)
1. **Breadcrumbs** - Orientación inmediata
2. **Loading Indicators** - Feedback de estado
3. **Delete Confirmation** - Protección de datos

### Mediano Plazo (Sprint 2 - MODERADOS)
4. **Responsive Tables** - Soporte móvil
5. **Jerarquía Dashboard** - Prioridad visual clara
6. **Error Messages** - Detalles específicos
7. **Real-time Validation** - Feedback inline

### Largo Plazo (Sprint 3+ - LEVES)
8. **Icon Labels** - Claridad visual
9. **Required Fields** - Prevención errores
10. **Filter Visibility** - Descubrimiento
11. **Contrast Audit** - Accesibilidad WCAG
12. **Loading States** - Botones actualizados

---

## Comparativa Pre/Post Implementación

### Antes
- ❌ Usuario se pierde sin breadcrumbs
- ❌ Pantalla vacía sin indicador de carga
- ❌ Eliminación sin confirmación
- ❌ Tablas rompen en móvil
- ❌ Jerarquía visual confusa
- ❌ Errores genéricos sin solución

### Después (Meta)
- ✅ Breadcrumbs en cada página
- ✅ Skeletons durante carga
- ✅ Modal de confirmación
- ✅ Tablas o cards responsivas
- ✅ KPIs destacados con color/tamaño
- ✅ Errores específicos con acciones

---

## Plan de Implementación

### Fase 2: Iteración de Fixes
- **Commit 3:** Implementar breadcrumbs + loading indicators (críticos)
- **Commit 4:** Responsive design + delete confirmation (moderados)
- **Commit 5:** Mejoras leves (leves)

### Herramientas para Validación
- **axe DevTools:** Auditoría de accesibilidad
- **Lighthouse:** Performance y accesibilidad
- **Wave Tool:** Contraste y etiquetas
- **Chrome DevTools:** Testing responsivo

---

## Conclusión
