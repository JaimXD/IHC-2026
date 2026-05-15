# WIREFRAME MID-FI (Fidelidad Media)

## Dashboard - Con Iconografía y Colores

```
┌──────────────────────────────────────────────────────┐
│ 📊 LOGO    Dashboard           [🔍] [⚙️] [👤] [⬇️]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Menú Lateral                  CONTENIDO PRINCIPAL    │
│ ┌──────────────┐   ┌───────────────────────────┐   │
│ │ 📊 Dashboard │   │ 📍 Home › Dashboard      │   │
│ │ 🔍 Hallazgos │   │ Inicio                    │   │
│ │ 👁️ Observ.   │   └───────────────────────────┘   │
│ │ 👥 Particip. │   ┌───────────────────────────┐   │
│ │ ✅ Tareas    │   │ 📈 Pruebas: 4,324 (+12%) │   │
│ │ 📋 Plan      │   │ 👥 Participantes: 127    │   │
│ └──────────────┘   └───────────────────────────┘   │
│                                                      │
│                   ┌──────┐  ┌──────┐  ┌──────┐      │
│                   │📋    │  │⚠️    │  │✅    │      │
│                   │Tareas│  │Error │  │Éxito │      │
│                   │1,234 │  │ 45   │  │3,220 │      │
│                   └──────┘  └──────┘  └──────┘      │
│                                                      │
│                   ┌──────┐  ┌──────┐  ┌──────┐      │
│                   │⏱️    │  │💾    │  │🎯    │      │
│                   │Tiempo│  │Cache │  │Tasa  │      │
│                   │4.2s  │  │89%   │  │92.5%│      │
│                   └──────┘  └──────┘  └──────┘      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Formulario - Con Validación

```
┌──────────────────────────────────────────────┐
│ 📍 Home › Participantes › Nuevo              │
├──────────────────────────────────────────────┤
│                                              │
│  Registrar Nuevo Participante                │
│                                              │
│  Nombre Completo *                           │
│  [________________________]                  │
│   Error: Mínimo 3 caracteres ❌             │
│                                              │
│  Email *                                     │
│  [________________________]                  │
│   ✓ Formato válido                          │
│                                              │
│  Rol *                                       │
│  [▼ Seleccionar rol              ]           │
│                                              │
│  [🔵 GUARDAR] [⚪ CANCELAR]                 │
│                                              │
│  ⏳ Guardando...                            │
│  ████████░░ 80% Completado                  │
│                                              │
└──────────────────────────────────────────────┘
```

## Características Mid-Fi

- ✓ Iconografía coherente (📊 👥 ✅ ⚠️)
- ✓ Colores por estado (🟢 éxito, 🟠 advertencia, 🔴 error)
- ✓ Breadcrumb con contexto
- ✓ Elementos interactivos claramente identificables
- ✓ Validación en tiempo real (✓ ✗)
- ✓ Barra de progreso para procesos
- ✓ Diferenciación visual de botones
