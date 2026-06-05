/** Prioridad 1 = más alta, 5 = más baja */
const priorityFromHallazgo = (h) => {
  const p = (h.prioridad || '').toLowerCase();
  if (p === 'alta' || p === 'critica' || p === 'crítica') return 1;
  if (p === 'media') return 3;
  return 4;
};

const buildMarkdown = ({ planDePrueba, dashboard, userStories, tasks, prioritization, sprintPlan }) => {
  const lines = [
    '# Borrador Sprint Backlog',
    '',
    '## Contexto',
    `- **Producto:** ${planDePrueba.producto || 'N/A'}`,
    `- **Módulo:** ${planDePrueba.modulo_evaluado || 'N/A'}`,
    `- **Objetivo:** ${planDePrueba.objetivo || 'N/A'}`,
    '',
    '## Métricas agregadas',
    '| Métrica | Valor |',
    '|---------|-------|',
    `| Tasa de éxito | ${dashboard.tasaExitoProm != null ? `${Math.round(dashboard.tasaExitoProm * 100)}%` : 'N/A'} |`,
    `| Errores totales | ${dashboard.erroresTotales} |`,
    `| Tiempo promedio (s) | ${dashboard.tiempoPromedioSeg ?? 'N/A'} |`,
    '',
    '## Historias de usuario',
    ...userStories.flatMap(us => [
      `### ${us.id} — ${us.title} (Prioridad ${us.priority})`,
      us.description,
      '',
      '**Criterios de aceptación:**',
      ...us.acceptanceCriteria.map(c => `- ${c}`),
      ''
    ]),
    '## Tareas técnicas',
    '| Historia | Tarea | Horas |',
    '|----------|-------|-------|',
    ...tasks.map(t => `| ${t.userStoryId} | ${t.title} | ${t.estimatedHours} |`),
    '',
    '## Priorización',
    ...prioritization.map(p => `- **${p.userStoryId}** (${p.score}/5): ${p.justification}`),
    '',
    '## Plan del sprint',
    ...sprintPlan.map(d => `- **Día ${d.day}** (${d.suggestedOwner || 'sin asignar'}): ${d.activities.join('; ')}`)
  ];
  return lines.join('\n');
};

const buildLocalFallback = ({
  planDePrueba,
  dashboard,
  hallazgosList,
  observacionesList,
  participantesList,
  tareasGuion,
  sprintDurationDays,
  teamSize
}) => {
  const days = sprintDurationDays || 14;
  const owners = participantesList.slice(0, Math.max(1, teamSize || 4));

  if (hallazgosList.length === 0 && observacionesList.length === 0) {
    return {
      userStories: [],
      tasks: [],
      prioritization: [],
      sprintPlan: [],
      markdown: '# Borrador Sprint Backlog\n\nNo hay hallazgos ni observaciones en el flujo seleccionado para generar historias.'
    };
  }

  const userStories = hallazgosList.slice(0, 8).map((h, i) => {
    const id = `US-${i + 1}`;
    const rec = (h.recomendacion_mejora || '').substring(0, 200);
    return {
      id,
      title: `Resolver hallazgo #${h.id}`,
      description: `Como usuario del sistema, quiero ${rec || 'mejorar la interfaz del módulo evaluado'} para reducir errores y completar las tareas del guion.`,
      priority: priorityFromHallazgo(h),
      acceptanceCriteria: [
        `Se aborda la recomendación del hallazgo #${h.id}.`,
        'En re-test se reduce la cantidad de errores respecto a la línea base.',
        h.frecuencia ? `El problema reportado (${h.frecuencia}) deja de reproducirse en condiciones normales.` : 'El equipo valida el cambio con una sesión de prueba.'
      ].filter(Boolean).slice(0, 3)
    };
  });

  observacionesList
    .filter(o => !o.exito && o.mejora_propuesta)
    .slice(0, Math.max(0, 8 - userStories.length))
    .forEach((obs, idx) => {
      const id = `US-${userStories.length + 1}`;
      userStories.push({
        id,
        title: `Mejora desde observación #${obs.id}`,
        description: `Como participante de la prueba, quiero ${obs.mejora_propuesta.substring(0, 180)} para completar la tarea ${obs.tarea_id} sin fricción.`,
        priority: obs.cantidad_errores >= 3 ? 2 : 3,
        acceptanceCriteria: [
          obs.problema_detectado ? `Se corrige: ${obs.problema_detectado.substring(0, 120)}` : 'La mejora propuesta queda implementada.',
          'La observación queda registrada como resuelta en validación.'
        ]
      });
    });

  const tasks = [];
  userStories.forEach((us, i) => {
    tasks.push({
      userStoryId: us.id,
      title: `Diseño UX / wireframes (${us.id})`,
      estimatedHours: 4,
      technicalNotes: 'Basado en escenarios del guion y observaciones vinculadas.'
    });
    tasks.push({
      userStoryId: us.id,
      title: `Implementación frontend (${us.id})`,
      estimatedHours: 6,
      technicalNotes: 'React/Next; alinear con módulo evaluado en el plan de prueba.'
    });
    if (i % 2 === 0) {
      tasks.push({
        userStoryId: us.id,
        title: `Validación de usabilidad (${us.id})`,
        estimatedHours: 3,
        technicalNotes: 'Re-ejecutar escenario del guion; registrar observaciones en el dashboard.'
      });
    }
  });

  const prioritization = userStories.map(us => ({
    userStoryId: us.id,
    score: us.priority,
    justification: `Prioridad ${us.priority}/5 derivada de severidad/frecuencia en hallazgos u observaciones del flujo.`
  }));

  const tareaRef = tareasGuion.find(t => t.criterio_exito) || tareasGuion[0];
  const sprintPlan = [];
  const chunk = Math.max(1, Math.ceil(days / Math.max(userStories.length, 1)));

  for (let d = 1; d <= days; d += 1) {
    const storyIdx = Math.min(userStories.length - 1, Math.floor((d - 1) / chunk));
    const us = userStories[storyIdx];
    const owner = owners[(d - 1) % owners.length];
    const ownerLabel = owner ? `${owner.nombre} (${owner.perfil || 'participante'})` : '';

    let activities;
    if (d === 1) {
      activities = [`Sprint planning — ${planDePrueba.producto}`, 'Revisión de métricas del flujo'];
    } else if (d === days) {
      activities = ['Sprint review y retrospectiva', `Validar: ${tareaRef?.criterio_exito || 'cierre de historias'}`];
    } else {
      activities = [`Avance en ${us?.id || 'backlog'}`, 'Daily standup'];
    }

    sprintPlan.push({ day: d, activities, suggestedOwner: ownerLabel });
  }

  const markdown = buildMarkdown({
    planDePrueba,
    dashboard,
    userStories,
    tasks,
    prioritization,
    sprintPlan
  });

  return { userStories, tasks, prioritization, sprintPlan, markdown };
};

module.exports = { buildLocalFallback };
