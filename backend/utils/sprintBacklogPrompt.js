const JSON_OPEN = '---BEGIN_JSON---';
const JSON_CLOSE = '---END_JSON---';

const PROMPT_TEMPLATE = `Eres un asistente de planificación ágil especializado en proyectos de pruebas de usabilidad.

El usuario ha seleccionado un flujo completo de prueba de usabilidad del cual desea generar un Sprint Backlog. Este flujo está compuesto por los siguientes datos recolectados y relacionados entre sí:

- Plan de prueba: el producto evaluado, el módulo bajo prueba y el objetivo de la sesión.
- Tareas / guion: los escenarios que se pidió ejecutar a los participantes, los criterios de éxito y las métricas definidas.
- Participantes: los perfiles de las personas que realizaron la prueba.
- Observaciones: lo que ocurrió durante la sesión (éxitos, fallos, tiempos, errores encontrados y mejoras propuestas), cada una vinculada a un participante y una tarea específica.
- Hallazgos: la síntesis de los problemas detectados, con su frecuencia, severidad, prioridad y recomendación de mejora.
- Métricas agregadas: tasa de éxito global, total de errores, tiempo promedio y distribución de hallazgos por prioridad.

Tu objetivo es generar un borrador de Sprint Backlog en formato JSON basándote exclusivamente en el contexto del flujo proporcionado. No inventes información que no esté presente o sea inferible a partir de los datos. Si algún bloque del contexto está vacío, ignóralo sin generar contenido ficticio.

Sigue estas reglas:
1. Genera hasta 8 historias de usuario directamente vinculadas a los hallazgos, observaciones o fallos de tareas del flujo seleccionado.
2. Redacta cada historia en formato: "Como [rol], quiero [acción] para [beneficio]."
3. Por cada historia, genera las tareas técnicas necesarias con horas estimadas y notas técnicas relevantes.
4. Asigna una prioridad del 1 (más alta) al 5 (más baja) a cada historia, justificada por la severidad o frecuencia del hallazgo o fallo relacionado.
5. Distribuye las historias y tareas en un plan de sprint día a día, considerando la duración del sprint y el tamaño del equipo indicados.
6. Genera un documento Markdown completo que resuma el sprint backlog generado.
7. Responde ÚNICAMENTE con un bloque JSON entre ${JSON_OPEN} y ${JSON_CLOSE}. No incluyas ninguna explicación, introducción ni texto fuera de esos delimitadores.

Configuración del sprint:
- Duración del sprint: {{sprintDurationDays}} días
- Tamaño del equipo: {{teamSize}} personas

Contexto del flujo seleccionado:
{{contextJSON}}

Formato de salida esperado:
${JSON_OPEN}
{
  "userStories": [
    {
      "id": "US-1",
      "title": "",
      "description": "Como [rol], quiero [acción] para [beneficio].",
      "priority": 1,
      "acceptanceCriteria": [""]
    }
  ],
  "tasks": [
    {
      "userStoryId": "US-1",
      "title": "",
      "estimatedHours": 0,
      "technicalNotes": ""
    }
  ],
  "prioritization": [
    {
      "userStoryId": "US-1",
      "score": 0,
      "justification": ""
    }
  ],
  "sprintPlan": [
    {
      "day": 1,
      "activities": [""],
      "suggestedOwner": ""
    }
  ],
  "markdown": ""
}
${JSON_CLOSE}`;

const buildPrompt = ({ sprintDurationDays, teamSize, contextJSON }) => {
  return PROMPT_TEMPLATE
    .replace('{{sprintDurationDays}}', String(sprintDurationDays))
    .replace('{{teamSize}}', String(teamSize))
    .replace('{{contextJSON}}', JSON.stringify(contextJSON, null, 2));
};

module.exports = { buildPrompt, JSON_OPEN, JSON_CLOSE };
