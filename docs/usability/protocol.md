# Protocolo de pruebas de usabilidad

Objetivo: Evaluar efectividad, eficiencia y satisfacción del módulo para tareas representativas.

Duración estimada por sesión: 10–20 minutos por usuario.

Plantilla de sesión (moderador):
- ID sesión: sXX
- Evaluador: nombre
- Participante: alias/ID
- Tarea: nombre de la tarea (ver `flows/`)
- Instrucciones al participante: "Completa la tarea X usando la interfaz. No te preocupes si fallas, sólo habla en voz alta lo que piensas." 
- Medidas a recolectar: start_time, end_time, tiempo_s, completado (S/N), errores observados, comentarios, satisfaction_score (1-5).

Procedimiento:
1. Preparar entorno y datos (usuario logueado si aplica).
2. Explicar tarea al participante sin dar detalles de pasos.
3. Iniciar cronómetro cuando el participante haga el primer click relevante.
4. Tomar capturas en: Start, pasos intermedios, cualquier error, Finish.
5. Preguntar puntuación de satisfacción tras la tarea (1–5).
6. Guardar registros en `results_template.csv` y capturas en `evidencias/`.

Consentimiento: si grabas pantalla o video, obtener permiso explícito.
