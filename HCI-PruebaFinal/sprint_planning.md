# Sprint Planning - Usability Test Dashboard 2.0

## Sprint 1: Navegación y Validación
**Duración:** 1 semana  
**Objetivo:** Mejorar navegación principal y validación de formularios  
**Fecha Inicio:** 15 de mayo, 2026  
**Fecha Fin:** 22 de mayo, 2026

### Capacidad del Equipo
- Capacity: 10 puntos
- Burndown esperado: lineal

### Historias Asignadas

#### US-001: Mejorar Navegación del Dashboard (5 pts)
- **Tareas:**
  1. Analizar estructura actual de navegación
  2. Diseñar breadcrumbs component
  3. Implementar breadcrumbs en todas las páginas
  4. Resaltar sección activa en sidebar
  5. Pruebas de navegación

- **Aceptación:**
  - Breadcrumbs visibles en Desktop y Móvil
  - Funciona en todas las rutas
  - Clickeable y navegable

#### US-002: Validaciones en Tiempo Real (3 pts)
- **Tareas:**
  1. Identificar campos que necesitan validación
  2. Implementar validaciones con Zod
  3. Mostrar mensajes de error dinámicos
  4. Agregar indicadores visuales
  5. Pruebas de validación

- **Aceptación:**
  - Validación inmediata al desenfoque
  - Mensajes claros en español
  - Previene envío de formulario inválido

#### US-004: Feedback Visual (2 pts)
- **Tareas:**
  1. Implementar toast notifications
  2. Agregar spinners en cargas
  3. Transiciones suaves
  4. Confirmaciones antes de eliminar

- **Aceptación:**
  - Toast aparece tras guardar/eliminar
  - Loader visible en acciones async
  - Confirmación dialogo en delete

---

## Sprint 2: Visualización y Accesibilidad
**Duración:** 1 semana  
**Objetivo:** Mejorar diseño visual y accesibilidad  

### Historias Asignadas

#### US-003: Mejorar Visualización de Métricas (4 pts)
- **Tareas:**
  1. Rediseñar layout del dashboard principal
  2. Jerarquía visual clara (tamaño, color, posición)
  3. Agrupar métricas relacionadas
  4. Mejorar contraste de colores
  5. Testing visual

- **Aceptación:**
  - Métricas principales sobresalen
  - Grouping lógico
  - WCAG AA compliant

#### US-005: Mejorar Accesibilidad (5 pts)
- **Tareas:**
  1. Audit de accesibilidad actual
  2. Fijar ratios de contraste
  3. Agregar roles ARIA
  4. Navegación por teclado
  5. Testing con screen readers

- **Aceptación:**
  - Score Lighthouse A11y ≥ 90
  - Tab navigation funcional
  - Etiquetas descriptivas

#### US-007: Organizar Reportes (1 pt)
- **Tareas:**
  1. Agregar filtros en reporte
  2. Mejora búsqueda

---

## Sprint 3: Móvil y Documentación
**Duración:** 1 semana  
**Objetivo:** Optimizar móvil y completar documentación

### Historias Asignadas

#### US-006: Experiencia Móvil (5 pts)
- **Tareas:**
  1. Audit responsivo
  2. Ajustar tap targets
  3. Optimizar altura de inputs
  4. Sidebar mobile collapsible
  5. Testing en dispositivos reales

- **Aceptación:**
  - Funciona en iPhone y Android
  - Tap targets ≥ 44x44px
  - Sin scroll horizontal innecesario

#### US-008: Guía Contextual (2 pts)
- **Tareas:**
  1. Agregar tooltips
  2. Mejorar ícones
  3. Documentar uso

---

## Métricas y Seguimiento

### Velocity
- Sprint 1: 10 pts
- Sprint 2: 10 pts
- Sprint 3: 7 pts
- **Velocity Promedio: 9 pts**

### Burndown Chart
```
Puntos
  |
10|  ●
  |   ●
 8|    ●
  |     ●
 6|      ●
  |       ●
 4|        ●
  |         ●
 2|          ●
  |           ●
 0|____________●
  Day 1 2 3 4 5
```

### Definición de "Listo"
- [ ] Código escrito
- [ ] Código revisado
- [ ] Pruebas pasadas
- [ ] Documentado
- [ ] Pusheado a main

---

## Riesgos Identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| Complejidad de Accessibility | Media | Alto | Usar tools como axe DevTools |
| Testing en múltiples dispositivos | Media | Medio | Emuladores + dispositivos reales |
| Cambios de scope | Alta | Medio | Reuniones de alineación diarias |

---

## Notas Importantes

- Daily standup: 09:00 AM
- Sprint review: Viernes 5 PM
- Sprint retro: Viernes 5:30 PM
- Código debe pasar linting y tests antes de merge
