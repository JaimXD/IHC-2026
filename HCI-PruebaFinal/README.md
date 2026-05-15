# HCI-PruebaFinal: Mejoras UX al Usability Test Dashboard 2.0

## 📋 Descripción

Prueba práctica final del curso HCI (Interacción Humano Computador) - Quinto Semestre de Ingeniería en Software.

**Objetivo:** Aplicar principios de HCI, UX y Scrum para mejorar la experiencia de usuario del Usability Test Dashboard 2.0 identificando problemas, rediseñando funcionalidades críticas e implementando mejoras reales.

**Docente:** Jose Ruben Caiza Caizabuano  
**Duración Prueba:** 2 horas  
**Modalidad:** Individual

---

## 🎯 Fases del Proyecto

### ✅ FASE 1: Planificación Scrum
- [x] Product Backlog (8 user stories)
- [x] Sprint Planning (3 sprints)
- [x] User Stories con criterios de aceptación
- [x] Priorización de tareas
- [x] Definition of Done

**Archivos:**
- `product_backlog.md` - Historias prioritarias y epics
- `sprint_planning.md` - Plan de 3 sprints con detalle
- `ai_evidence.md` - Documentación de asistencia IA

---

### 📋 FASE 2: Evaluación Heurística (En Progreso)
Aplicar evaluación heurística basada en 10 heurísticas de Nielsen:

**Áreas:** Login, Dashboard, Formularios, Navegación, Reportes

**Problemas Identificados:** 10 problemas UX clasificados como:
- 🔴 3 Críticos (Sprint 1)
- 🟠 3 Moderados (Sprint 2)
- 🟡 4 Leves (Sprint 3+)

**Archivo:**
- `heuristic_evaluation.md` - Análisis completo con soluciones

---

### 🎨 FASE 3: Rediseño UX (Próximo)
Mejorar una pantalla crítica aplicando:
- Leyes de Gestalt
- Jerarquía visual
- Arquitectura de información
- Navegación contextual
- Prevención de errores
- Diseño emocional

**Deliverables:**
- Lo-Fi Wireframes
- Mid-Fi Wireframes
- Hi-Fi Wireframes

**Carpeta:** `wireframes/`

---

### 💻 FASE 4: Implementación Funcional (Próximo)
Implementar mejoras UX reales:
- Breadcrumbs
- Stepper/Pasos
- Validaciones
- Mensajes dinámicos
- Barra de progreso
- Navegación contextual
- Feedback visual

**Carpeta:** `implementation/`

---

### 🤖 FASE 5: Evidencia IA (Completada)
Documentar uso de IA en diseño UX:
- Prompts utilizados
- Herramienta IA (GitHub Copilot)
- Resultados obtenidos
- Impacto en diseño

**Archivo:**
- `ai_evidence.md` - 7 sesiones IA documentadas

---

### 🔗 FASE 6: GitHub y Control de Versiones (En Progreso)
Mínimo 5 commits reales:
1. ✅ `fix: alinear base de datos del backend` (Backend fix)
2. ⬜ `docs: scrum y planificación UX` (Esta sesión)
3. ⬜ `docs: evaluación heurística UX`
4. ⬜ `design: wireframes Lo-Fi, Mid-Fi, Hi-Fi`
5. ⬜ `feat: implementar mejoras UX funcionales`

---

## 📁 Estructura del Proyecto

```
HCI-PruebaFinal/
├── product_backlog.md          # 8 user stories priorizado
├── sprint_planning.md          # 3 sprints detallados
├── heuristic_evaluation.md     # 10 problemas UX clasificados
├── ai_evidence.md              # Uso de IA documentado
│
├── wireframes/                 # Wireframes en fases
│   ├── dashboard_lofi.md       # Lo-Fi
│   ├── dashboard_midfi.md      # Mid-Fi
│   └── dashboard_hifi.md       # Hi-Fi
│
└── implementation/             # Código implementado
    ├── breadcrumbs.tsx         # Componente breadcrumbs
    ├── validations.ts          # Esquemas Zod
    ├── form_improvements.tsx   # Mejoras de formularios
    └── dashboard_redesign.tsx  # Dashboard rediseñado

README.md                        # Este archivo
```

---

## 🎯 User Stories Priorizadas

### Sprint 1: Navegación y Validación (10 pts)
| US | Título | Complejidad | Pts |
|----|--------|-----------|-----|
| US-001 | Mejorar Navegación | Alta | 5 |
| US-002 | Validaciones en Tiempo Real | Media | 3 |
| US-004 | Feedback Visual | Media | 2 |

### Sprint 2: Visualización y Accesibilidad (10 pts)
| US | Título | Complejidad | Pts |
|----|--------|-----------|-----|
| US-003 | Mejorar Métricas | Media | 4 |
| US-005 | Mejorar Accesibilidad | Alta | 5 |
| US-007 | Organizar Reportes | Baja | 1 |

### Sprint 3: Móvil y Documentación (7 pts)
| US | Título | Complejidad | Pts |
|----|--------|-----------|-----|
| US-006 | Experiencia Móvil | Alta | 5 |
| US-008 | Guía Contextual | Baja | 2 |

---

## 🔍 10 Problemas UX Identificados

| # | Problema | Severidad | Heurística | Solución |
|---|----------|----------|-----------|----------|
| 1 | Sin orientación en navegación | 🔴 | Visibilidad | Breadcrumbs + Highlight |
| 2 | Validaciones ausentes | 🔴 | Prevención | Zod + Mensajes |
| 3 | Sin feedback de acciones | 🔴 | Reconocimiento | Toast + Spinners |
| 4 | No responsivo (móvil) | 🟠 | Flexibilidad | Diseño adaptable |
| 5 | Contraste insuficiente | 🟠 | Visibilidad | WCAG AA |
| 6 | Jerarquía visual débil | 🟠 | Correspondencia | Rediseño layout |
| 7 | Ícones no intuitivos | 🟡 | Visibilidad | Etiquetas + Estándares |
| 8 | Campos sin marcar como requeridos | 🟡 | Prevención | Asterisco + Label |
| 9 | Sin confirmación en delete | 🟡 | Ayuda | Modal confirmación |
| 10 | Tablas no ordenables | 🟡 | Flexibilidad | Sort + Filtros |

---

## 🛠️ Tecnologías Aplicadas

### Frontend
- **Next.js 16** - Framework React moderno
- **TypeScript** - Type safety
- **Zod** - Validaciones de schema
- **Radix UI** - Componentes accesibles
- **Tailwind CSS** - Estilos

### Backend
- **Node.js/Express** - API REST
- **MySQL** - Base de datos
- **CORS** - Comunicación frontend-backend

### Herramientas UX/Accesibilidad
- **Nielsen Heuristics** - Evaluación UX
- **WCAG 2.1 AA** - Estándares de accesibilidad
- **Figma** - Wireframing (planeado)
- **axe DevTools** - Testing accesibilidad

---

## 📊 Métricas del Proyecto

### Cobertura UX
- ✅ 10 problemas identificados (100%)
- ✅ 8 user stories definidas
- ✅ 3 sprints planificados
- ✅ 28 puntos de estimación total

### Fases Completadas
- ✅ Fase 1: Planificación Scrum (100%)
- ✅ Fase 5: Evidencia IA (100%)
- ⏳ Fase 2: Evaluación Heurística (100%)
- ⏳ Fase 3: Rediseño UX (0%)
- ⏳ Fase 4: Implementación (0%)
- ⏳ Fase 6: Commits (40%)

### Commits Requeridos
- ✅ 1/5 - Backend fix
- ⏳ 4/5 - Fases UX (en progreso)

---

## 🚀 Próximos Pasos

### Inmediato (Hoy)
- [ ] Commit de Fase 1 completada
- [ ] Iniciar Fase 2 con evaluación profunda
- [ ] Preparar wireframes Lo-Fi

### Corto Plazo (Esta semana)
- [ ] Diseñar wireframes Mid-Fi y Hi-Fi
- [ ] Implementar breadcrumbs en código
- [ ] Agregar validaciones Zod

### Mediano Plazo
- [ ] Mejorar accesibilidad WCAG AA
- [ ] Testing en dispositivos móviles
- [ ] Finalizar documentación

---

## 📝 Rúbrica de Evaluación (2 puntos totales)

| Criterio | Peso | Meta |
|----------|------|------|
| Scrum y Planificación | 0.30 pts | ✅ Completado |
| Evaluación Heurística | 0.40 pts | ⏳ En progreso |
| Wireframes y Rediseño | 0.30 pts | ⏳ Próximo |
| Implementación Funcional | 0.50 pts | ⏳ Próximo |
| GitHub y Evidencia | 0.30 pts | ⏳ En progreso |
| Uso de IA | 0.20 pts | ✅ Completado |
| **TOTAL** | **2.00 pts** | - |

---

## 👤 Autora

**Estudiante:** Ingeniera en Software - Quinto Semestre  
**Prueba:** HCI/UX - Final Practice  
**Fecha Inicio:** 15 de mayo, 2026  
**Modalidad:** Individual  
**Restricciones:** No copiar diseños de internet, no commits vacíos, repositorio público

---

## 📚 Referencias

- Nielsen, J. (1994). "10 Usability Heuristics for User Interface Design"
- W3C. (2023). "Web Content Accessibility Guidelines (WCAG) 2.1"
- Scrum Alliance. (2023). "Scrum Guide"
- Gestalt Principles in UX Design

---

## 📞 Contacto

**Docente:** Jose Ruben Caiza Caizabuano  
**Repositorio:** GitHub (público)  
**Estado:** En Desarrollo

---

*Última actualización: 15 de mayo, 2026*
