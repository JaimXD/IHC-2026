# Usability Test Dashboard 2.0 — HCI Final

Asignatura: Interacción Humano Computador  
Nombre: Juan Pablo Vayas 
Nivel: 5to Semestre 
Carrera: ngeniería en Software  
Docente: Ing. Jose Rubén Caiza  

---

##  Resumen

Mejora de la experiencia de usuario del "Usability Test Dashboard 2.0" mediante:
- Evaluación heurística (10 problemas identificados)
- Rediseño UX con wireframes (Lo-Fi, Mid-Fi, Hi-Fi)
- Implementación de componentes React funcionales

---

##  Fases Completadas

###  FASE 1: Planificación Scrum
- Product Backlog: [product_backlog.md](product_backlog.md)
- Sprint Planning: [sprint_planning.md](sprint_planning.md)

###  FASE 2: Evaluación Heurística
- 10 problemas UX identificados: [heuristic_evaluation.md](heuristic_evaluation.md)

###  FASE 3: Rediseño UX
- **Wireframes Lo-Fi:** [wireframes/01_LOFI.md](wireframes/01_LOFI.md)
- **Wireframes Mid-Fi:** [wireframes/02_MIDFI.md](wireframes/02_MIDFI.md)
- **Wireframes Hi-Fi:** [wireframes/03_HIFI.md](wireframes/03_HIFI.md)

###  FASE 4: Implementación Funcional
Componentes React en `/implementation/`:
- **breadcrumb.tsx** - Navegación contextual (Problema #8)
- **form-field.tsx** - Campos mejorados (Problema #5)
- **validation-message.tsx** - Mensajes dinámicos (Problema #6)
- **progress-bar.tsx** - Feedback visual (Problema #10)
- **stepper.tsx** - Navegación por pasos
- **useFormValidation.ts** - Hook de validación

###  FASE 5: Evidencia IA
- [ai_evidence.md](ai_evidence.md)

---

##  Estructura

```
HCI-PruebaFinal/
├── wireframes/              # Fase 3: Wireframes
│   ├── 01_LOFI.md
│   ├── 02_MIDFI.md
│   └── 03_HIFI.md
│
├── implementation/          # Fase 4: Componentes React
│   ├── breadcrumb.tsx
│   ├── form-field.tsx
│   ├── validation-message.tsx
│   ├── progress-bar.tsx
│   ├── stepper.tsx
│   └── useFormValidation.ts
│
├── heuristic_evaluation.md  # Fase 2: 10 problemas
├── product_backlog.md       # Fase 1: Scrum
├── sprint_planning.md       # Fase 1: Scrum
├── ai_evidence.md           # Fase 5: IA
└── README.md                # Este archivo
```

---

##  Cómo Usar

### 1. Ver Wireframes
```
Abre: wireframes/01_LOFI.md (estructura)
      wireframes/02_MIDFI.md (diseño)
      wireframes/03_HIFI.md (final)
```

### 2. Usar Componentes
```typescript
// Ejemplo en tu página React
import { Breadcrumb } from '@/components/breadcrumb';
import { FormField } from '@/components/form-field';
import { ProgressBar } from '@/components/progress-bar';
import { Stepper } from '@/components/stepper';

export function MyPage() {
  return (
    <>
      <Breadcrumb />
      <FormField label="Nombre" name="name" required />
      <ProgressBar progress={50} status="loading" />
    </>
  );
}
```

---

##  Problemas Resueltos

| # | Problema | Solución | Archivo |
|---|----------|----------|---------|
| 3 | Falta jerarquía visual | Rediseño de dashboard | wireframes/03_HIFI.md |
| 5 | Campos no diferenciados | Asteriscos + labels | form-field.tsx |
| 6 | Mensajes error genéricos | Alertas dinámicas | validation-message.tsx |
| 8 | Sin breadcrumbs | Navegación contextual | breadcrumb.tsx |
| 10 | Sin feedback export | Barra de progreso | progress-bar.tsx |

---

##  Componentes

### Breadcrumb
Navegación contextual automática basada en rutas.

### FormField
Campos con validación clara, asteriscos para requeridos, y mensajes de error.

### ValidationMessage
Alertas dinámicas (éxito, error, advertencia, info) con auto-cierre.

### ProgressBar
Barra animada con porcentaje y tiempo estimado.

### Stepper
Indicador de pasos con navegación visual clara.

### useFormValidation
Hook personalizado para validar formularios en tiempo real.

---

##  Notas

- Los componentes son **reutilizables** e **independientes**
- Compatible con **Next.js 13+** (App Router)
- Sin dependencias externas adicionales
- Código limpio y documentado

---




