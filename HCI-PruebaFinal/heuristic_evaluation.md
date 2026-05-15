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

## Problemas Identificados (EVALUACIÓN REAL DEL CÓDIGO - 40 TOTAL)

---

# SECCIÓN 1: DASHBOARD

## D1. **Sin Skeleton Loaders en Carga de Métricas** 🔴 CRÍTICO
- **Ubicación:** `dashboard-view.tsx:95-120` - `if (loading) return <div>...</div>`
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Estado `loading` existe pero no renderiza nada visible. Usuario ve pantalla vacía sin indicador de carga.
- **Impacto:** Pareciera que la página está rota o congelada
- **Solución:** Crear componente `MetricsSkeleton` con skeleton animados para KPIs y gráficos
- **Esfuerzo:** 4 pts

---

## D2. **KPIs sin Jerarquía Visual Clara** 🟠 MODERADO
- **Ubicación:** `dashboard-view.tsx:250-300` - Todos los KPIs con clases iguales
- **Heurística:** 2. Correspondencia entre sistema y mundo real
- **Descripción:** Las 5 métricas (Éxito, Promedio Tiempo, Errores, Hallazgos, Participantes) tienen tamaño y peso visual idéntico
- **Impacto:** Usuario no identifica rápidamente cuáles son las métricas críticas
- **Solución:** Resaltar "% Exitoso" y "Hallazgos Críticos" con tamaño mayor, color destacado y posición preferente
- **Esfuerzo:** 3 pts

---

## D3. **Sin Color/Iconografía en Valores Críticos** 🟠 MODERADO
- **Ubicación:** `dashboard-view.tsx:320-340` - Números sin contexto visual
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Valor de "% Exitoso" es 75% pero no hay color rojo/amarilla si está por debajo de umbral esperado
- **Impacto:** Usuario no ve si 75% es "bueno" o "malo" sin contexto histórico
- **Solución:** Agregar color rojo (< 60%), amarillo (60-80%), verde (> 80%) para cada KPI
- **Esfuerzo:** 2 pts

---

## D4. **Gráficos sin Leyenda o Etiquetas en Ejes** 🟡 LEVE
- **Ubicación:** `dashboard-view.tsx:360-400` - Recharts RadialBar y Bar sin labels
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Gráficos de Recharts no muestran etiquetas en puntos de datos (qué tarea, qué métrica)
- **Impacto:** Usuario debe adivinar qué representan los colores/barras
- **Solución:** Agregar `<CartesianGrid>`, `<Tooltip>`, `<Legend>` en gráficos Recharts
- **Esfuerzo:** 2 pts

---

## D5. **Sin Filtrado de Fechas en Dashboard** 🟡 LEVE
- **Ubicación:** `dashboard-view.tsx:1-50` - No hay componente de daterange
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Métricas siempre muestran "toda la vida" de datos, sin opción de rango de fechas (hoy, semana, mes)
- **Impacto:** No puedo ver evolución temporal ni diagnóstico de problemas recientes
- **Solución:** Agregar DateRangePicker permitiendo filtrar últimos 7 días, 30 días, 3 meses, todo
- **Esfuerzo:** 3 pts

---

## D6. **Tarjetas de Métricas sin Botones de Acción** 🟡 LEVE
- **Ubicación:** `dashboard-view.tsx:280-320` - Cards con solo lectura
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** KPI muestra "5 Hallazgos Críticos" pero no puedo hacer click para ir a verlos
- **Impacto:** Necesito navegar manualmente a Reportes, flujo ineficiente
- **Solución:** Convertir KPI cards en botones/links hacia secciones relacionadas (click en "Hallazgos" → va a /hallazgos?filter=critica)
- **Esfuerzo:** 2 pts

---

## D7. **Sin Indicador de Actualización de Datos** 🟠 MODERADO
- **Ubicación:** `dashboard-view.tsx:140-160` - useEffect refetch cada 45 segundos sin indicador
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Dashboard refresca datos automáticamente pero usuario no sabe cuándo fue el último update ni por qué cambian números
- **Impacto:** Confusión si datos están "frescos", desconfianza en números
- **Solución:** Agregar timestamp "Actualizado hace 2 min" y spinner subtle cuando refetching
- **Esfuerzo:** 2 pts

---

## D8. **Gráficos No Responsivos en Móvil** 🟠 MODERADO
- **Ubicación:** `dashboard-view.tsx:350-420` - Recharts sin configuración responsive
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Gráficos RadialBar y Bar no cambian de tamaño en móvil, causan scroll horizontal
- **Impacto:** En móvil, gráficos son inutilizables
- **Solución:** Agregar `ResponsiveContainer` correcto y cambiar orientación a stacked en viewport < 640px
- **Esfuerzo:** 3 pts

---

## D9. **Sin Drill-Down desde Dashboard a Detalle** 🟡 LEVE
- **Ubicación:** `dashboard-view.tsx` - Componente autónomo sin links
- **Heurística:** 3. Control del usuario
- **Descripción:** Dashboard es solo lectura. No hay forma de explorar datos detrás de métricas
- **Impacto:** Usuario debe volver a tablas manuales, experiencia de descubrimiento pobre
- **Solución:** Implementar modales o expandibles inline que muestren "Top 5 Tareas Fallidas" cuando click en % Exitoso
- **Esfuerzo:** 3 pts

---

## D10. **Error Genérico sin Reintento Automático** 🟠 MODERADO
- **Ubicación:** `dashboard-view.tsx:425-435` - `catch { addToast('error', 'No se pudieron cargar...') }`
- **Heurística:** 9. Ayuda y documentación + 5. Prevención de errores
- **Descripción:** Si falla fetch (red timeout), error toast dice "No se pudieron cargar" sin ofrecer "Reintentar"
- **Impacto:** Usuario debe refrescar página manualmente, frustración
- **Solución:** Agregar botón "Reintentar" en toast, implementar exponential backoff para retries automáticos
- **Esfuerzo:** 2 pts

---

---

# SECCIÓN 2: FORMULARIOS

## F1. **Campos Requeridos sin Indicador Visual** 🔴 CRÍTICO
- **Ubicación:** `participantes-view.tsx:58-85`, `tareas-view.tsx:15-25`, `observaciones-view.tsx:18-30`
- **Heurística:** 5. Prevención de errores
- **Descripción:** Schema Zod define campos con `.min(1)` pero labels NO tienen asterisco (*) rojo
- **Impacto:** Usuario llena parcialmente el formulario y recibe error POST sin saber qué está faltando
- **Solución:** Agregar `<span className="text-destructive ml-1">*</span>` a todos labels de campos requeridos
- **Esfuerzo:** 1 pt

---

## F2. **Sin Validación Visual en Tiempo Real** 🔴 CRÍTICO
- **Ubicación:** `observaciones-view.tsx:380-410`, `tareas-view.tsx:285-310`
- **Heurística:** 5. Prevención de errores
- **Descripción:** Errores de Zod solo aparecen después de submit. User escribe en campo inválido sin feedback inmediato
- **Impacto:** Experiencia frustrante, usuario no sabe qué corregir hasta final
- **Solución:** Usar `onChange` handlers para validar y mostrar error bajo campo con `formState.errors`
- **Esfuerzo:** 3 pts

---

## F3. **Demasiados Campos en Observaciones (9 inputs)** 🟠 MODERADO
- **Ubicación:** `observaciones-view.tsx:150-250` - Formulario con 9 campos sin agrupación
- **Heurística:** 8. Diseño estético y minimalista
- **Descripción:** Formulario desorganizado: participante, tarea, exito, tiempo, errores, comentarios, problema, severidad, mejora
- **Impacto:** Sobrecarga cognitiva, usuario se pierde en campos
- **Solución:** Organizar en tabs o pasos: "Datos Básicos" (participante, tarea) → "Resultados" (exito, tiempo, errores) → "Análisis" (problema, severidad, mejora)
- **Esfuerzo:** 4 pts

---

## F4. **Sin Validación de Números Negativos en Tiempo** 🟡 LEVE
- **Ubicación:** `observaciones-view.tsx:215` - `tiempoSegundos: z.number().min(1).max(3600)`
- **Heurística:** 5. Prevención de errores
- **Descripción:** Input type="number" permite escribir -60 (segundos negativos), aunque validación Zod lo rechaza
- **Impacto:** User recibe error al submit sin entender por qué
- **Solución:** Usar `<input type="number" min="1" max="3600" step="1" />` para prevenir en cliente
- **Esfuerzo:** 1 pt

---

## F5. **Dropdown Prueba/Participante sin Búsqueda** 🟠 MODERADO
- **Ubicación:** `tareas-view.tsx:35`, `observaciones-view.tsx:45` - Dropdowns limitados sin filtro
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Si hay 100 participantes, dropdown es lista larga sin posibilidad de buscar
- **Impacto:** Tedioso encontrar opción correcta
- **Solución:** Reemplazar select con `<Command>` (Shadcn) permitiendo búsqueda al escribir
- **Esfuerzo:** 2 pts

---

## F6. **Sin Confirmación de Cambio Perdiéndose** 🟡 LEVE
- **Ubicación:** Todos los formularios - Sin verificación de unsaved changes
- **Heurística:** 5. Prevención de errores
- **Descripción:** Si usuario está editando formulario y hace click en otra sección sin guardar, cambios se pierden sin aviso
- **Impacto:** Trabajo perdido, frustración
- **Solución:** Detectar `formState.isDirty`, mostrar confirmación "¿Descartar cambios?" si intenta navegar
- **Esfuerzo:** 2 pts

---

## F7. **Botón Guardar sin Loading State** 🟠 MODERADO
- **Ubicación:** `participantes-view.tsx:145`, `plan-view.tsx:220`
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Botón "Guardar" no cambia de estado mientras POST está en vuelo. Puede hacer click múltiples veces
- **Impacto:** Duplicados de registros, confusión si guardó
- **Solución:** Agregar `isSubmitting` state, deshabilitar botón, mostrar spinner "Guardando..."
- **Esfuerzo:** 2 pts

---

## F8. **Mensajes de Error Genéricos sin Detalles** 🟠 MODERADO
- **Ubicación:** `tareas-view.tsx:258`, `observaciones-view.tsx:290` - `error instanceof Error ? error.message : 'No se pudo actualizar'`
- **Heurística:** 9. Ayuda y documentación
- **Descripción:** Si validación falla, mensaje dice "No se pudo crear la tarea" sin especificar qué falló (prueba inválida, texto muy corto, etc)
- **Impacto:** User no sabe qué corregir
- **Solución:** Parsear `errorBody.detalles` del backend y mostrar mensaje específico por campo
- **Esfuerzo:** 2 pts

---

## F9. **Sin Confirmación Modal de Eliminación** 🟠 MODERADO
- **Ubicación:** `participantes-view.tsx:295`, `tareas-view.tsx:315`, `observaciones-view.tsx:375`
- **Heurística:** 5. Prevención de errores
- **Descripción:** Estado `deleteConfirm` existe pero no hay modal visible. Usuario puede eliminar accidentalmente
- **Impacto:** Pérdida de datos sin recuperación
- **Solución:** Mostrar `AlertDialog` confirmatorio con opción "Cancelar" destacada
- **Esfuerzo:** 1 pt

---

## F10. **Plan Form con 11 Campos sin Agrupación** 🟡 LEVE
- **Ubicación:** `plan-view.tsx:55-120` - Formulario extenso sin estructura
- **Heurística:** 8. Diseño estético y minimalista
- **Descripción:** 11 campos (producto, módulo, objetivo, método, tipo, presupuesto, duracion, inicio, fin, descripcion, protocolo) sin agrupar lógicamente
- **Impacto:** Usuario no entiende dónde va cada dato
- **Solución:** Agrupar en secciones: "Info Básica", "Fechas", "Configuración", mostrar cada grupo con separadores visuales
- **Esfuerzo:** 3 pts

---

---

# SECCIÓN 3: NAVEGACIÓNS

## N1. **Ausencia de Breadcrumbs** 🔴 CRÍTICO
- **Ubicación:** `app-shell.tsx` - No existe componente breadcrumb
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Usuario no ve ruta de navegación. En /plan/123/editar, no sabe cómo volver
- **Impacto:** Desorientación, usuario se pierde
- **Solución:** Crear componente `Breadcrumb.tsx` usando `usePathname()`, mostrar arriba del contenido
- **Esfuerzo:** 5 pts

---

## N2. **Sidebar Icons sin Etiqueta en Móvil Colapsado** 🟡 LEVE
- **Ubicación:** `app-shell.tsx:85-140` - Sidebar colapsado muestra solo ícono
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** En estado colapsado, usuario no sabe qué sección es cada ícono (LayoutDashboard, ClipboardList, etc)
- **Impacto:** Confusión en navegación
- **Solución:** Agregar `aria-label` a cada botón sidebar y tooltip on hover
- **Esfuerzo:** 2 pts

---

## N3. **Sin Indicador de Página Actual en Sidebar** 🔴 CRÍTICO
- **Ubicación:** `app-shell.tsx:180-200` - `usePathname()` se usa pero sin highlight visual
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Navbar no destaca cuál es la página actual. Visitante no sabe dónde está
- **Impacto:** Desorientación
- **Solución:** Agregar clase `bg-primary/20` al link activo, ícono destacado en color
- **Esfuerzo:** 1 pt

---

## N4. **Sin Logo o Branding en Sidebar** 🟡 LEVE
- **Ubicación:** `app-shell.tsx:1-50` - Sidebar solo muestra navegación
- **Heurística:** 2. Correspondencia entre sistema y mundo real
- **Descripción:** No hay logo o nombre de aplicación visible, siente genérico
- **Impacto:** Falta identidad de marca
- **Solución:** Agregar logo o texto "Usability Dashboard" en header del sidebar
- **Esfuerzo:** 1 pt

---

## N5. **Sin Menú Contextual en Móvil (Hamburger ineficiente)** 🟠 MODERADO
- **Ubicación:** `app-shell.tsx:145-175` - Hamburger menu abre overlay
- **Heurística:** 3. Control del usuario
- **Descripción:** En móvil, overlay cubre toda pantalla. Cerrar sidebar requiere volver a hacer click
- **Impacto:** Experiencia móvil pobre, navegación tediosa
- **Solución:** Usar drawer deslizable desde lateral izquierdo (no overlay), clickable en background para cerrar
- **Esfuerzo:** 2 pts

---

## N6. **Enlaces secundarios no Visibles** 🟡 LEVE
- **Ubicación:** `app-shell.tsx:220-240` - Navegación solo muestra 6 items principales
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Si hay acciones frecuentes (ej: Descargar Reporte, Configuración), no hay lugar para ellas
- **Impacto:** Usuario debe ir a settings o hacer múltiples clicks
- **Solución:** Agregar submenu expandible "Más" con opciones adicionales
- **Esfuerzo:** 2 pts

---

## N7. **Sin Indicador de Breadcrumb Mobile** 🟠 MODERADO
- **Ubicación:** `app-shell.tsx:1-350` - Layout no adapta para móvil
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** En móvil, espacio es limitado. Breadcrumb típico no cabe
- **Impacto:** Usuario no entiende dónde está en estructura
- **Solución:** Crear breadcrumb colapsible o breadcrumb simplificado para móvil (solo último nivel + botón "atrás")
- **Esfuerzo:** 3 pts

---

## N8. **Sin Búsqueda Global** 🟡 LEVE
- **Ubicación:** `app-shell.tsx` - No existe barra de búsqueda
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Usuario que busca participante específico debe ir a Participantes manualmente
- **Impacto:** Ineficiente, requiere navegación múltiple
- **Solución:** Agregar comando palette (CMD+K) o search bar en header para buscar cross-sección
- **Esfuerzo:** 4 pts

---

## N9. **Sin Indicador de Notificaciones** 🟡 LEVE
- **Ubicación:** `app-shell.tsx` - Navbar sin bell icon
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Si un hallazgo crítico se crea, usuario no recibe notificación visual
- **Impacto:** Pode perder información importante
- **Solución:** Agregar badge counter en navbar para tareas/hallazgos recientes
- **Esfuerzo:** 2 pts

---

## N10. **Transiciones de Página Abruptas sin Feedback** 🟡 LEVE
- **Ubicación:** `app-shell.tsx` - Next.js navegación sin loading state
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Click en sidebar, página cambia pero sin indicador. User no sabe si está cargando
- **Impacto:** Experiencia confusa en conexión lenta
- **Solución:** Agregar progress bar or loading skeleton al cambiar ruta (useTransition hook)
- **Esfuerzo:** 2 pts

---

---

# SECCIÓN 4: REPORTES

## R1. **Sin Filtros Avanzados en Hallazgos** 🟠 MODERADO
- **Ubicación:** `hallazgos-view.tsx:150-170` - Solo filtro de severidad
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Usuario solo puede filtrar por severidad (baja, media, alta). No hay filtro por estado (abierto, resuelto) o prueba
- **Impacto:** Tedioso encontrar hallazgos específicos en lista larga
- **Solución:** Agregar multi-select para estado, prueba, rango de fechas
- **Esfuerzo:** 3 pts

---

## R2. **Sin Exportación de Reporte a PDF/Excel** 🟠 MODERADO
- **Ubicación:** `hallazgos-view.tsx` - No hay botón export
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Usuario no puede descargar datos de hallazgos para presentar a stakeholders
- **Impacto:** Requiere manual copy-paste o screenshot
- **Solución:** Agregar botón "Exportar PDF" usando library como jsPDF o html2pdf
- **Esfuerzo:** 3 pts

---

## R3. **Tabla de Hallazgos No Ordenable** 🟡 LEVE
- **Ubicación:** `hallazgos-view.tsx:320-380` - Tabla renderiza items sin sort
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Usuario no puede ordenar por Severidad, Prioridad o Fecha para ver hallazgos críticos primero
- **Impacto:** Ineficiente, debe leer toda lista
- **Solución:** Hacer headers clickables, agregar icon ↑↓ para indicar sort direction
- **Esfuerzo:** 2 pts

---

## R4. **Sin Resumen Ejecutivo (Statistics Panel)** 🟠 MODERADO
- **Ubicación:** `hallazgos-view.tsx:1-100` - Componente empieza directamente en lista
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** No hay resumen visual: Total hallazgos, Críticos pendientes, Resueltos, % completación
- **Impacto:** User no entiende rápidamente la situación de hallazgos
- **Solución:** Agregar stats cards arriba de tabla similar a dashboard
- **Esfuerzo:** 3 pts

---

## R5. **Sin Indicador de Prioridad en Hallazgos (UX confusa)** 🟡 LEVE
- **Ubicación:** `hallazgos-view.tsx:55-75` - PRIORIDAD_LABELS solo text color sin background
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Prioridad "Alta" es solo rojo sin background, difícil distinguir de otros textos
- **Impacto:** Confusión visual, usuario no ve rápidamente qué es prioritario
- **Solución:** Usar background color sólido como severidad (SEVERIDAD_LABELS model)
- **Esfuerzo:** 1 pt

---

## R6. **Sin Historial de Cambios en Hallazgo** 🟡 LEVE
- **Ubicación:** `hallazgos-view.tsx:180-220` - DetailModal no muestra cuándo se creó/editó
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Al ver hallazgo, no hay timestamp de creación o última actualización
- **Impacto:** User no sabe cuán reciente es la información
- **Solución:** Agregar "Creado el: 15 mayo 2026, 14:30" y "Actualizado por: Admin"
- **Esfuerzo:** 1 pt

---

## R7. **Sin Validación de Campos Recomendacion Mejora** 🟡 LEVE
- **Ubicación:** `hallazgos-view.tsx:16` - `recomendacionMejora: z.string().min(10).max(5000)`
- **Heurística:** 5. Prevención de errores
- **Descripción:** Campo requiere 10 caracteres mínimo pero no da sugerencia, si usuario escribe 5, error al submit
- **Impacto:** Frustración, trial-and-error
- **Solución:** Mostrar contador de caracteres "5/10 caracteres mínimo" bajo campo en tiempo real
- **Esfuerzo:** 1 pt

---

## R8. **Sin Agrupación o Categorización de Hallazgos** 🟠 MODERADO
- **Ubicación:** `hallazgos-view.tsx:300-350` - Lista flat sin agrupación
- **Heurística:** 2. Correspondencia entre sistema y mundo real
- **Descripción:** 50 hallazgos aparecen en lista sin agrupar por prueba, categoría o módulo
- **Impacto:** Difícil ver patrones o problemas sistémicos
- **Solución:** Agregar agrupación por prueba o severidad con collapsible sections
- **Esfuerzo:** 3 pts

---

## R9. **Sin Template o Asistente para Crear Hallazgo** 🟡 LEVE
- **Ubicación:** `hallazgos-view.tsx:125-150` - Formulario vacío sin guía
- **Heurística:** 9. Ayuda y documentación
- **Descripción:** Usuario no sabe qué escribir en "Frecuencia" o "Recomendación Mejora"
- **Impacto:** Entradas inconsistentes, baja calidad de datos
- **Solución:** Agregar helper text bajo cada campo: "Ej: 3 de 5 usuarios no encontraron botón" para Frecuencia
- **Esfuerzo:** 2 pts

---

## R10. **Sin Estados de Flujo Workflow claro** 🟠 MODERADO
- **Ubicación:** `hallazgos-view.tsx:45-48` - Estados: abierto, en_progreso, resuelto sin visualización de flujo
- **Heurística:** 3. Control del usuario + 1. Visibilidad del estado
- **Descripción:** Dropdown permite seleccionar cualquier estado. No hay workflow enforced (abierto → en_progreso → resuelto)
- **Impacto:** Hallazgos pueden saltarse estados, confusión en progreso real
- **Solución:** Crear stepper visual mostrando estado actual, permitir solo transiciones válidas
- **Esfuerzo:** 3 pts

---

---

## Resumen General (40 PROBLEMAS)

| Sección | Cantidad | Críticos | Moderados | Leves | Effort Total |
|---------|----------|----------|-----------|-------|------------|
| 🎯 Dashboard | 10 | 1 | 4 | 5 | 28 pts |
| 📝 Formularios | 10 | 2 | 4 | 4 | 24 pts |
| 🧭 Navegación | 10 | 2 | 2 | 6 | 27 pts |
| 📊 Reportes | 10 | 0 | 5 | 5 | 23 pts |
| **TOTAL** | **40** | **5** | **15** | **20** | **102 pts** |

---

## Matriz de Problemas vs Heurísticas Nielsen

| Heurística | Total | Problemas Principales |
|-----------|-------|----------------------|
| 1. Visibilidad estado | 14 | D1, D2, D7, F1, N1, N3, N7, R4, R5, R6 |
| 2. Correspondencia | 4 | D2, D4, N4, R8 |
| 3. Control usuario | 3 | F6, N5, R10 |
| 5. Prevención errores | 9 | F1, F2, F4, F8, F9, N1 |
| 7. Flexibilidad/Eficiencia | 11 | D5, D6, F5, F6, N6, N8, R1, R2, R3, R8 |
| 8. Diseño estético | 2 | F3, F10 |
| 9. Ayuda/Documentación | 5 | D10, F8, R7, R9 |

---

## Plan Implementación (5 Sprints)

### Sprint 1 (Críticos - 15 pts)
- D1: Skeleton Loaders Dashboard
- F1: Indicadores campos requeridos
- F2: Validación real-time
- N1: Breadcrumbs
- N3: Active link highlight

### Sprint 2 (Moderados Prioritarios - 25 pts)
- D2, D7, D10: Jerarquía, actualización, errores
- F3, F7: Campos agrupados, loading state
- N5, N7: Móvil drawer, breadcrumb mobile
- R1, R4, R8, R10: Filtros, stats, workflow

### Sprint 3+ (Leves - 62 pts)
- Completar todos los leves con prioridad de impacto

---

## Conclusión
