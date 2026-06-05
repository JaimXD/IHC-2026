const { GoogleGenAI } = require('@google/genai');
const Ajv = require('ajv');

const DEFAULT_MODEL = 'gemini-2.5-flash';
const JSON_OPEN = '---BEGIN_JSON---';
const JSON_CLOSE = '---END_JSON---';

const schema = {
  type: 'object',
  properties: {
    userStories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'number' },
          acceptanceCriteria: { type: 'array', items: { type: 'string' } }
        },
        required: ['id', 'title', 'description', 'priority', 'acceptanceCriteria']
      }
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          linkedStoryId: { type: 'string' },
          estimateHours: { type: 'number' },
          techNotes: { type: 'string' }
        },
        required: ['id', 'title', 'linkedStoryId', 'estimateHours']
      }
    },
    prioritization: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          itemId: { type: 'string' },
          score: { type: 'number' },
          reason: { type: 'string' }
        },
        required: ['itemId', 'score', 'reason']
      }
    },
    sprintPlan: {
      type: 'object',
      properties: {
        days: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              day: { type: 'number' },
              activities: { type: 'array', items: { type: 'string' } }
            },
            required: ['day', 'activities']
          }
        },
        suggestedOwners: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              storyId: { type: 'string' },
              participantId: { type: 'string' }
            },
            required: ['storyId', 'participantId']
          }
        }
      }
    },
    markdown: { type: 'string' }
  },
  required: ['userStories', 'tasks', 'prioritization', 'sprintPlan', 'markdown']
};

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

const buildPrompt = (payload) => {
  const instruction = [
    'Eres un asistente experto en metodologías ágiles e Ingeniería de Software. Tu tarea es analizar datos de un "Usability Test Dashboard" y generar un borrador estructurado de un Sprint Backlog.',
    '',
    'INSTRUCCIONES DE ANÁLISIS:',
    '1. Revisa el contexto del proyecto, métricas, plan de prueba, tareas, participantes, observaciones y hallazgos del INPUT JSON.',
    '2. Genera hasta 8 Historias de Usuario principales basadas en los hallazgos y el plan de prueba. Cada historia debe incluir de 1 a 4 criterios de aceptación.',
    '3. Sugiere Tareas Técnicas para cada historia, estimando el esfuerzo en horas y añadiendo notas técnicas útiles para los desarrolladores.',
    '4. Prioriza las historias de usuario (del 1 al 5, donde 5 es la máxima prioridad) y provee una justificación corta en prioritization.',
    '5. Propón una Organización Preliminar del Sprint según context.sprintDurationDays, con distribución por días y asignación sugerida de dueños (owners) basada en participantes del INPUT.',
    '6. Incluye el campo markdown con un documento completo en español (encabezados #, ##, listas y tablas).',
    '',
    'REGLAS ESTRICTAS DE FORMATO:',
    `RESPONDE ÚNICAMENTE con un objeto JSON válido entre ${JSON_OPEN} y ${JSON_CLOSE}. Sin saludos ni texto fuera de las marcas.`,
    'Esquema requerido:',
    '{"userStories":[{"id":"US-01","title":"...","description":"...","priority":5,"acceptanceCriteria":["..."]}],',
    '"tasks":[{"id":"TK-01","title":"...","linkedStoryId":"US-01","estimateHours":4,"techNotes":"..."}],',
    '"prioritization":[{"itemId":"US-01","score":5,"reason":"..."}],',
    '"sprintPlan":{"days":[{"day":1,"activities":["..."]}],"suggestedOwners":[{"storyId":"US-01","participantId":"1"}]},',
    '"markdown":"# Borrador Sprint Backlog\\n..."}',
    '',
    'Usa IDs US-01, US-02… y TK-01, TK-02…. priority y score van de 1 a 5. participantId es el id numérico del participante como string.',
    'Si faltan datos, infiere con prudencia pero mantén el esquema completo.'
  ].join('\n');

  return `${instruction}\n\nINPUT:\n${JSON.stringify(payload)}\n\n${JSON_OPEN}\n{}\n${JSON_CLOSE}`;
};

const extractJsonBetweenMarkers = (text) => {
  if (!text || typeof text !== 'string') throw new Error('Respuesta de IA vacía');
  const open = text.indexOf(JSON_OPEN);
  const close = text.lastIndexOf(JSON_CLOSE);
  if (open !== -1 && close !== -1 && close > open) {
    return text.substring(open + JSON_OPEN.length, close).trim();
  }
  const match = text.match(/\{[\s\S]*\}/m);
  return match ? match[0] : null;
};

const parseAndValidate = (rawText) => {
  const candidate = extractJsonBetweenMarkers(rawText);
  if (!candidate) throw new Error('No se encontró JSON en la respuesta');
  let parsed;
  try {
    parsed = JSON.parse(candidate);
  } catch (e) {
    throw new Error('Respuesta IA no es JSON válido');
  }

  const valid = validate(parsed);
  if (!valid) {
    const errors = validate.errors || [];
    const msg = errors.map(e => `${e.instancePath} ${e.message}`).join('; ');
    const error = new Error('Validación JSON contra esquema falló: ' + msg);
    error.validationErrors = errors;
    throw error;
  }
  return parsed;
};

const generateWithPayload = async (payload, opts = {}) => {
  const model = opts.model || DEFAULT_MODEL;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(payload);

  const maxAttempts = (opts.retries && Number(opts.retries)) || 2;
  let attempt = 0;
  let lastErr = null;
  while (attempt <= maxAttempts) {
    attempt += 1;
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      const text = response && (response.text || response.outputText || response.content || '');
      return parseAndValidate(text);
    } catch (err) {
      lastErr = err;
      if (attempt > maxAttempts) throw lastErr;
      await new Promise(r => setTimeout(r, 600 * attempt));
    }
  }
};

module.exports = { generateWithPayload, JSON_OPEN, JSON_CLOSE };
