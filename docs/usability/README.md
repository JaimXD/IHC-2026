**Usability — Guía y evidencias**

Carpeta para centralizar todos los artefactos relacionados a la evaluación de usabilidad.

Estructura recomendada:
- `evidencias/` → capturas, videos, JSONs de API
- `prototipo/` → exports del prototipo (PNG/PDF) o `prototipo_link.md`
- `flows/` → flujos por tarea (start→finish) en Markdown
- `manifest.csv` → índice de evidencias (filename, fecha, responsable, tarea, step, completado, tiempo_s, comentario, issue)
- `protocol.md` → protocolo de pruebas con usuarios
- `results_template.csv` → plantilla para registrar resultados de sesión

Uso:
1. Implementar las mejoras mínimas (WCAG, labels, focus, aria) en la rama de trabajo.
2. Ejecutar las pruebas por tarea y tomar capturas siguiendo `flows/`.
3. Guardar archivos en `evidencias/` y añadir una fila en `manifest.csv`.
4. Crear issues/commits para las correcciones y referenciarlos desde el PR.

Responsables: asigna `responsable` en `manifest.csv` para trazabilidad.
