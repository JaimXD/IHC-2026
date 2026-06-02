const db = require('../config/db');
const { GoogleGenAI } = require('@google/genai');

exports.generateSprintBacklog = async (req, res, next) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 1. Obtener datos
    const queryPruebas = 'SELECT * FROM pruebas_usabilidad LIMIT 1';
    const queryHallazgos = 'SELECT * FROM hallazgos';
    const queryTareas = 'SELECT * FROM tareas';

    db.query(queryPruebas, (err, pruebas) => {
      if (err) return next(err);
      
      db.query(queryHallazgos, (err, hallazgos) => {
        if (err) return next(err);

        db.query(queryTareas, async (err, tareas) => {
          if (err) return next(err);

          const prueba = pruebas[0] || { producto: 'Producto Desconocido' };

          // 2. Construir el prompt para Gemini (Formato JSON)
          const prompt = `
Actúa como un Product Owner experto. Tu tarea es analizar los siguientes hallazgos de pruebas de usabilidad y generar un Sprint Backlog estructurado.

Debes responder ÚNICAMENTE con un objeto JSON válido. No incluyas texto fuera del JSON, ni bloques de código markdown como \`\`\`json. La estructura debe estar optimizada para ser renderizada en un dashboard profesional con KPIs, tablas dinámicas y tarjetas.

El JSON debe cumplir ESTRICTAMENTE con esta estructura:

{
  "dashboardData": {
    "kpisPrincipales": {
      "totalHistorias": 0,
      "puntosEsfuerzoTotal": 0,
      "tareasDiseno": 0,
      "tareasDesarrollo": 0
    },
    "bannerMeta": {
      "titulo": "🎯 Meta del Sprint",
      "descripcion": "[Redacta un objetivo claro y accionable basado en resolver los problemas de UX/UI]"
    },
    "resumenEjecutivo": "[Párrafo breve explicando el enfoque del sprint]"
  },
  "historiasUsuario": [
    {
      "id": "US-01",
      "prioridad": "Alta",
      "puntos": 5,
      "titulo": "[Título descriptivo]",
      "descripcion": "Como [usuario], quiero [acción] para [beneficio]."
    }
  ],
  "desgloseTareas": {
    "uiux": [
      {"id": "T-UI-1", "texto": "[Tarea de diseño]", "estado": "pendiente"}
    ],
    "desarrollo": [
      {"id": "T-DEV-1", "texto": "[Tarea de código frontend/backend]", "estado": "pendiente"}
    ],
    "qa": [
      {"id": "T-QA-1", "texto": "[Tarea de pruebas]", "estado": "pendiente"}
    ]
  },
  "criteriosAceptacionGlobales": [
    "[Criterio medible 1]",
    "[Criterio medible 2]"
  ]
}

Procesa los siguientes datos reales para poblar este JSON:
- Producto Evaluado: "${prueba.producto}"
- Tareas Evaluadas: ${JSON.stringify(tareas)}
- Hallazgos de Usabilidad: ${JSON.stringify(hallazgos)}
`;

          try {
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json' 
              }
            });

            const datosDashboard = JSON.parse(response.text);

            res.json({
              success: true,
              data: datosDashboard,
              metadata: {
                 hallazgosProcesados: hallazgos.length,
                 tareasProcesadas: tareas.length,
                 aiSource: 'gemini-2.5-flash'
              }
            });
          } catch (apiError) {
             console.warn("Gemini API Error, falling back to mock JSON generator:", apiError.message);
             
             // Fallback local deterministic JSON generator si falla Gemini
             const numHistorias = Math.max(1, hallazgos.length);
             const puntosTotal = numHistorias * 3;
             
             let historiasUsuarioFallback = [];
             if (hallazgos.length > 0) {
               historiasUsuarioFallback = hallazgos.map((h, i) => ({
                  id: `US-${String(i + 1).padStart(2, '0')}`,
                  prioridad: h.prioridad || "Alta",
                  puntos: 3,
                  titulo: `Mejora basada en hallazgo #${h.id || i + 1}`,
                  descripcion: `Como usuario, quiero ${h.recomendacion_mejora || 'una interfaz intuitiva'} para evitar errores y fricciones.`
               }));
             } else {
               historiasUsuarioFallback.push({
                  id: "US-01",
                  prioridad: "Media",
                  puntos: 2,
                  titulo: "Revisión general de usabilidad",
                  descripcion: "Como usuario, quiero una interfaz pulida para navegar sin inconvenientes."
               });
             }

             const fallbackJSON = {
              "dashboardData": {
                "kpisPrincipales": {
                  "totalHistorias": numHistorias,
                  "puntosEsfuerzoTotal": puntosTotal,
                  "tareasDiseno": 2,
                  "tareasDesarrollo": 2
                },
                "bannerMeta": {
                  "titulo": "🎯 Meta del Sprint (Respaldo Local)",
                  "descripcion": `Solucionar de manera prioritaria los ${numHistorias} problemas de usabilidad identificados para optimizar ${prueba.producto}.`
                },
                "resumenEjecutivo": "Enfoque principal en estabilizar la experiencia de usuario y aplicar las correcciones reportadas durante la prueba."
              },
              "historiasUsuario": historiasUsuarioFallback,
              "desgloseTareas": {
                "uiux": [
                  {"id": "T-UI-1", "texto": "Revisar flujos y aplicar rediseño recomendado.", "estado": "pendiente"},
                  {"id": "T-UI-2", "texto": "Validar componentes en Figma.", "estado": "pendiente"}
                ],
                "desarrollo": [
                  {"id": "T-DEV-1", "texto": "Implementar mejoras visuales en Frontend.", "estado": "pendiente"},
                  {"id": "T-DEV-2", "texto": "Ajustar lógica de Backend si la captura de datos cambia.", "estado": "pendiente"}
                ],
                "qa": [
                  {"id": "T-QA-1", "texto": "Ejecutar casos de prueba sobre vistas corregidas.", "estado": "pendiente"}
                ]
              },
              "criteriosAceptacionGlobales": [
                "Los errores de usabilidad reportados ya no ocurren.",
                "Los componentes nuevos cumplen con accesibilidad básica."
              ]
            };

             res.json({
              success: true,
              data: fallbackJSON,
              metadata: {
                 hallazgosProcesados: hallazgos.length,
                 tareasProcesadas: tareas.length,
                 aiSource: 'local-fallback'
              }
            });
          }
        });
      });
    });
  } catch (error) {
    next(error);
  }
};
