const db = require('../config/db');
const aiClient = require('../utils/aiClient');
const { buildLocalFallback } = require('../utils/sprintBacklogFallback');

const allowedSources = ['dashboard', 'planDePrueba', 'tareasGuion', 'participantes', 'observaciones', 'hallazgos', 'historicalBacklogs'];

const validateGenerateBody = (body) => {
  const errors = [];
  const payload = body && typeof body === 'object' ? body : {};

  if (payload.sources !== undefined) {
    if (!Array.isArray(payload.sources)) {
      errors.push('Campo "sources" debe ser un arreglo');
    } else {
      const invalidSources = payload.sources.filter(source => !allowedSources.includes(source));
      if (invalidSources.length > 0) {
        errors.push(`Campo "sources" contiene valores no permitidos: ${invalidSources.join(', ')}`);
      }
    }
  }

  if (payload.context !== undefined) {
    if (!payload.context || typeof payload.context !== 'object' || Array.isArray(payload.context)) {
      errors.push('Campo "context" debe ser un objeto');
    } else {
      if (payload.context.sprintDurationDays !== undefined && (!Number.isInteger(payload.context.sprintDurationDays) || payload.context.sprintDurationDays <= 0)) {
        errors.push('Campo "context.sprintDurationDays" debe ser un entero positivo');
      }

      if (payload.context.teamSize !== undefined && (!Number.isInteger(payload.context.teamSize) || payload.context.teamSize <= 0)) {
        errors.push('Campo "context.teamSize" debe ser un entero positivo');
      }
    }
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true };
};

exports.generateSprintBacklog = async (req, res, next) => {
  try {
    const validation = validateGenerateBody(req.body);
    if (!validation.valid) {
      const error = new Error('Validación fallida');
      error.statusCode = 400;
      error.detalles = validation.errors;
      throw error;
    }

    const queryAsync = (sql, params = []) => new Promise((resolve, reject) => {
      db.query(sql, params, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    const pruebasRow = (await queryAsync('SELECT id, producto, modulo_evaluado, objetivo FROM pruebas_usabilidad ORDER BY id DESC LIMIT 1'))[0] || { producto: 'Producto Desconocido', modulo_evaluado: null, objetivo: null };
    const totalPruebasRow = (await queryAsync('SELECT COUNT(*) AS total_pruebas FROM pruebas_usabilidad'))[0] || { total_pruebas: 0 };
    const hallazgos = await queryAsync('SELECT id, prueba_id, frecuencia, severidad, prioridad, estado, recomendacion_mejora FROM hallazgos');
    const tareas = await queryAsync('SELECT id, prueba_id, escenario, resultado_esperado, metrica_principal, criterio_exito FROM tareas');
    const observaciones = await queryAsync('SELECT id, participante_id, tarea_id, exito, tiempo_segundos, cantidad_errores, comentarios, problema_detectado, severidad, mejora_propuesta FROM observaciones');
    const participantes = await queryAsync('SELECT id, nombre, perfil FROM participantes');
    let historical = [];
    try {
      historical = await queryAsync('SELECT id, title, status, created_at, json_payload FROM sprint_backlogs ORDER BY created_at DESC LIMIT 5');
    } catch (e) {
      historical = [];
    }

    const totalPruebas = totalPruebasRow.total_pruebas || 0;
    let tasaExitoProm = null;
    let erroresTotales = 0;
    if (observaciones.length > 0) {
      const sumaExito = observaciones.reduce((s, o) => s + (Number(o.exito) || 0), 0);
      tasaExitoProm = Number((sumaExito / observaciones.length).toFixed(3));
      erroresTotales = observaciones.reduce((s, o) => s + (Number(o.cantidad_errores) || 0), 0);
    }

    const hallazgosPorPrioridad = hallazgos.reduce((acc, h) => {
      const key = h.prioridad || 'Sin prioridad';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const dashboard = {
      totalPruebas,
      tasaExitoProm,
      erroresTotales,
      hallazgosPorPrioridad
    };

    const planDePrueba = {
      id: pruebasRow.id || null,
      producto: pruebasRow.producto || 'Producto Desconocido',
      modulo_evaluado: pruebasRow.modulo_evaluado || null,
      objetivo: pruebasRow.objetivo || null
    };

    const tareasGuion = tareas.map(t => ({ id: t.id, prueba_id: t.prueba_id, escenario: t.escenario, resultado_esperado: t.resultado_esperado, metrica_principal: t.metrica_principal, criterio_exito: t.criterio_exito }));

    const participantesList = participantes.map(p => ({ id: p.id, nombre: p.nombre, perfil: p.perfil }));

    const observacionesList = observaciones.map(o => ({ id: o.id, participante_id: o.participante_id, tarea_id: o.tarea_id, exito: o.exito, tiempo_segundos: o.tiempo_segundos, cantidad_errores: o.cantidad_errores, comentarios: o.comentarios, problema_detectado: o.problema_detectado, severidad: o.severidad, mejora_propuesta: o.mejora_propuesta }));

    const hallazgosList = hallazgos.map(h => ({ id: h.id, prueba_id: h.prueba_id, frecuencia: h.frecuencia, severidad: h.severidad, prioridad: h.prioridad, estado: h.estado, recomendacion_mejora: h.recomendacion_mejora }));

    const historicalBacklogs = historical.map(h => {
      try {
        return JSON.parse(h.json_payload);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    const sources = Array.isArray(req.body && req.body.sources) && req.body.sources.length > 0 ? req.body.sources : allowedSources;

    const sprintDurationDays = (req.body && req.body.context && req.body.context.sprintDurationDays) || 14;
    const teamSize = (req.body && req.body.context && req.body.context.teamSize) || participantesList.length || 4;
    const payload = {
      context: {
        product: planDePrueba.producto,
        modulo: planDePrueba.modulo_evaluado,
        objetivo: planDePrueba.objetivo,
        sprintDurationDays,
        teamSize
      }
    };
    if (sources.includes('dashboard')) payload.dashboard = dashboard;
    if (sources.includes('planDePrueba')) payload.planDePrueba = planDePrueba;
    if (sources.includes('tareasGuion')) payload.tareasGuion = tareasGuion;
    if (sources.includes('participantes')) payload.participantes = participantesList;
    if (sources.includes('observaciones')) payload.observaciones = observacionesList;
    if (sources.includes('hallazgos')) payload.hallazgos = hallazgosList;
    if (sources.includes('historicalBacklogs')) payload.historicalBacklogs = historicalBacklogs;

    const fallbackPayload = {
      planDePrueba,
      dashboard,
      hallazgosList,
      observacionesList,
      participantesList,
      tareasGuion,
      sprintDurationDays
    };

    try {
      const datos = await aiClient.generateWithPayload(payload, { model: 'gemini-2.5-flash' });
      res.json({
        success: true,
        data: datos,
        metadata: {
          hallazgosProcesados: hallazgosList.length,
          tareasProcesadas: tareasGuion.length,
          aiSource: 'gemini-2.5-flash'
        }
      });
    } catch (apiError) {
      const fallbackJSON = buildLocalFallback(fallbackPayload);

      res.json({
        success: true,
        data: fallbackJSON,
        metadata: {
          hallazgosProcesados: hallazgosList.length,
          tareasProcesadas: tareasGuion.length,
          aiSource: 'local-fallback',
          aiError: apiError.message
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
