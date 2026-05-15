# Evaluación Heurística UX - Usability Test Dashboard 2.0

**Evaluador:** UX Engineer  
**Fecha:** 15 de mayo, 2026  
**Versión del Aplicativo:** 1.0.0  
**Método:** Nielsen's 10 Usability Heuristics

---

## Escala de Severidad

| Nivel | Definición | Acción |
|-------|-----------|--------|
| 🔴 Crítico | Bloquea flujo principal, alta frustración | Prioritario Sprint 1 |
| 🟠 Moderado | Afecta experiencia pero no bloquea | Sprint 2 |
| 🟡 Leve | Mejora cosmética, bajo impacto | Sprint 3+ |

---

## Problemas Identificados

### 1. **Falta de Orientación en Navegación** 🔴 CRÍTICO
- **Ubicación:** Todas las páginas excepto la principal
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Usuario no sabe en qué sección está ni cómo regresar
- **Impacto:** El usuario se pierde y abandona flujos
- **Solución:** Implementar breadcrumbs + highlight sidebar activo
- **Esfuerzo:** 5 pts

---

### 2. **Validaciones de Formulario Ausentes** 🔴 CRÍTICO
- **Ubicación:** Formularios de participantes, tareas, observaciones
- **Heurística:** 5. Prevención de errores
- **Descripción:** Formularios aceptan datos inválidos, sin avisos de error
- **Impacto:** Datos corruptos en BD, re-trabajo del usuario
- **Solución:** Validaciones en cliente + mensajes dinámicos
- **Esfuerzo:** 3 pts

---

### 3. **Sin Feedback de Confirmación** 🔴 CRÍTICO
- **Ubicación:** Acciones de guardar, editar, eliminar
- **Heurística:** 6. Reconocimiento en lugar de recuerdo
- **Descripción:** No hay confirmación visual de que la acción se completó
- **Impacto:** Usuario no sabe si guardó correctamente
- **Solución:** Toast notifications, spinners de carga
- **Esfuerzo:** 2 pts

---

### 4. **Diseño No Responsivo (Móvil)** 🟠 MODERADO
- **Ubicación:** Formularios, tablas, sidebar
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Aplicativo no funciona correctamente en dispositivos móviles
- **Impacto:** Usuarios en campo no pueden capturar datos
- **Solución:** Diseño responsivo, sidebar collapsible
- **Esfuerzo:** 5 pts

---

### 5. **Contraste de Colores Insuficiente** 🟠 MODERADO
- **Ubicación:** Texto gris sobre fondos claros, badges
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Algunos elementos tienen ratio de contraste < 4.5:1
- **Impacto:** Difícil lectura para usuarios con baja visión
- **Solución:** Ajustar paleta de colores, garantizar WCAG AA
- **Esfuerzo:** 3 pts

---

### 6. **Jerarquía Visual Débil en Dashboard** 🟠 MODERADO
- **Ubicación:** Dashboard principal
- **Heurística:** 2. Correspondencia entre sistema y mundo real
- **Descripción:** Métricas no tienen jerarquía clara, difícil identificar KPIs principales
- **Impacto:** Usuario no entiende rápidamente el estado de las pruebas
- **Solución:** Rediseño con tamaño, color y posición estratégicos
- **Esfuerzo:** 4 pts

---

### 7. **Ícones No Intuitivos** 🟡 LEVE
- **Ubicación:** Botones en tablas (editar, eliminar, ver)
- **Heurística:** 1. Visibilidad del estado del sistema
- **Descripción:** Ícones no son reconocibles, usuarios no saben qué hacen
- **Impacto:** Confusión en acciones, clicks indeseados
- **Solución:** Agregar etiquetas, usar ícones estándar
- **Esfuerzo:** 2 pts

---

### 8. **Campos Obligatorios No Marcados** 🟡 LEVE
- **Ubicación:** Formularios en general
- **Heurística:** 5. Prevención de errores
- **Descripción:** No hay indicador visual de campos requeridos
- **Impacto:** Usuario llena formulario parcialmente
- **Solución:** Asterisco rojo + label descriptivo
- **Esfuerzo:** 1 pt

---

### 9. **Falta de Confirmación en Eliminación** 🟡 LEVE
- **Ubicación:** Botón eliminar en tablas
- **Heurística:** 9. Ayuda y documentación
- **Descripción:** Eliminación sin confirmación dialogo
- **Impacto:** Accidental delete de datos importantes
- **Solución:** Modal de confirmación antes de eliminar
- **Esfuerzo:** 1 pt

---

### 10. **Tablas No Ordenables/Filtrables** 🟡 LEVE
- **Ubicación:** Listados de participantes, tareas, observaciones
- **Heurística:** 7. Flexibilidad y eficiencia de uso
- **Descripción:** Usuario no puede ordenar por columna ni filtrar
- **Impacto:** Difícil encontrar datos en listas largas
- **Solución:** Agregar sort by header + filtros simples
- **Esfuerzo:** 2 pts

---

## Resumen por Severidad

| Severidad | Cantidad | Effort Total | Priority |
|-----------|----------|------------|----------|
| 🔴 Crítico | 3 | 10 pts | Sprint 1 |
| 🟠 Moderado | 3 | 12 pts | Sprint 2 |
| 🟡 Leve | 4 | 6 pts | Sprint 3+ |
| **TOTAL** | **10** | **28 pts** | - |

---

## Recomendaciones Estratégicas

### Corto Plazo (Sprint 1)
1. **Breadcrumbs + Navigation Highlight** - Aumentar orientación
2. **Form Validations** - Prevenir errores de datos
3. **Toast Notifications** - Feedback de acciones

### Mediano Plazo (Sprint 2)
4. **Responsive Design** - Soporte móvil
5. **Color Contrast Fix** - Accesibilidad WCAG AA
6. **Dashboard Redesign** - Jerarquía visual clara

### Largo Plazo (Sprint 3+)
7. **Icon Labels** - Claridad visual
8. **Required Field Markers** - Prevención de errores
9. **Delete Confirmation** - Protección de datos
10. **Sortable/Filterable Tables** - Eficiencia de búsqueda

---

## Comparativa Pre/Post

### Antes
- ❌ Usuario se pierde en navegación
- ❌ Formularios sin validación
- ❌ Sin feedback de acciones
- ❌ No funciona en móvil
- ❌ Contraste bajo
- ❌ Poca jerarquía visual

### Después (Meta)
- ✅ Navegación clara con breadcrumbs
- ✅ Validaciones en tiempo real
- ✅ Toast notifications y feedback
- ✅ Diseño totalmente responsivo
- ✅ WCAG AA compliant
- ✅ Jerarquía visual optimizada

---

## Seguimiento

- [ ] Fase 1: 3 problemas críticos resueltos
- [ ] Fase 2: 3 problemas moderados resueltos
- [ ] Fase 3: 4 problemas leves resueltos
- [ ] Post-Launch: Validar con usuarios reales
