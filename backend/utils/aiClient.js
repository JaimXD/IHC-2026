const { GoogleGenAI } = require('@google/genai');
const Ajv = require('ajv');
const { buildPrompt, JSON_OPEN, JSON_CLOSE } = require('./sprintBacklogPrompt');

const DEFAULT_MODEL = 'gemini-2.5-flash';

const schema = {
  type: 'object',
  properties: {
    userStories: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          priority: { type: 'number', minimum: 1, maximum: 5 },
          acceptanceCriteria: { type: 'array', items: { type: 'string' }, minItems: 1 }
        },
        required: ['id', 'title', 'description', 'priority', 'acceptanceCriteria']
      }
    },
    tasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userStoryId: { type: 'string' },
          title: { type: 'string' },
          estimatedHours: { type: 'number' },
          technicalNotes: { type: 'string' }
        },
        required: ['userStoryId', 'title', 'estimatedHours']
      }
    },
    prioritization: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          userStoryId: { type: 'string' },
          score: { type: 'number' },
          justification: { type: 'string' }
        },
        required: ['userStoryId', 'score', 'justification']
      }
    },
    sprintPlan: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'number' },
          activities: { type: 'array', items: { type: 'string' }, minItems: 1 },
          suggestedOwner: { type: 'string' }
        },
        required: ['day', 'activities']
      }
    },
    markdown: { type: 'string', minLength: 1 }
  },
  required: ['userStories', 'tasks', 'prioritization', 'sprintPlan', 'markdown']
};

const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);

const normalizeParsed = (parsed) => {
  if (!parsed || typeof parsed !== 'object') return parsed;

  const userStories = Array.isArray(parsed.userStories) ? parsed.userStories : [];

  const tasks = (parsed.tasks || []).map((t) => ({
    userStoryId: t.userStoryId || t.linkedStoryId || t.storyId || '',
    title: t.title || '',
    estimatedHours: Number(t.estimatedHours ?? t.estimateHours ?? 0),
    technicalNotes: t.technicalNotes || t.techNotes || ''
  }));

  const prioritization = (parsed.prioritization || []).map((p) => ({
    userStoryId: p.userStoryId || p.itemId || '',
    score: Number(p.score ?? p.priority ?? 3),
    justification: p.justification || p.reason || ''
  }));

  let sprintPlan = parsed.sprintPlan;
  if (sprintPlan && !Array.isArray(sprintPlan) && Array.isArray(sprintPlan.days)) {
    sprintPlan = sprintPlan.days.map((d, i) => ({
      day: d.day,
      activities: d.activities || [],
      suggestedOwner: sprintPlan.suggestedOwners?.[i]?.participantId
        || sprintPlan.suggestedOwners?.find((o) => o.storyId)?.participantId
        || ''
    }));
  }
  if (!Array.isArray(sprintPlan)) sprintPlan = [];

  return {
    userStories,
    tasks,
    prioritization,
    sprintPlan,
    markdown: typeof parsed.markdown === 'string' ? parsed.markdown : ''
  };
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

  const normalized = normalizeParsed(parsed);
  const valid = validate(normalized);
  if (!valid) {
    const errors = validate.errors || [];
    const msg = errors.map(e => `${e.instancePath} ${e.message}`).join('; ');
    const error = new Error('Validación JSON contra esquema falló: ' + msg);
    error.validationErrors = errors;
    throw error;
  }
  return normalized;
};

const generateWithPayload = async ({ sprintDurationDays, teamSize, contextJSON }, opts = {}) => {
  const model = opts.model || DEFAULT_MODEL;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY no configurada');

  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt({ sprintDurationDays, teamSize, contextJSON });

  const maxAttempts = (opts.retries && Number(opts.retries)) || 2;
  let attempt = 0;
  let lastErr = null;
  while (attempt <= maxAttempts) {
    attempt += 1;
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'text/plain' }
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
