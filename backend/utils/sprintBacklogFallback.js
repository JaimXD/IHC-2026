const priorityFromHallazgo = (h) => {
  const p = (h.prioridad || '').toLowerCase();
  if (p === 'alta' || p === 'critica' || p === 'crítica') return 5;
  if (p === 'media') return 3;
  return 2;
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
    '## Métricas',
    `| Métrica | Valor |`,
    `|---------|-------|`,
    `| Pruebas registradas | ${dashboard.totalPruebas} |`,
    `| Tasa de éxito | ${dashboard.tasaExitoProm != null ? `${Math.round(dashboard.tasaExitoProm * 100)}%` : 'N/A'} |`,
    `| Errores totales | ${dashboard.erroresTotales} |`,
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
    '| ID | Historia | Tarea | Horas |',
    '|----|----------|-------|-------|',
    ...tasks.map(t => `| ${t.id} | ${t.linkedStoryId} | ${t.title} | ${t.estimateHours} |`),
    '',
    '## Priorización',
    ...prioritization.map(p => `- **${p.itemId}** (${p.score}/5): ${p.reason}`),
    '',
    '## Plan del sprint',
    ...sprintPlan.days.map(d => `- **Día ${d.day}:** ${d.activities.join('; ')}`)
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
  sprintDurationDays
}) => {
  const days = sprintDurationDays || 14;
  const owners = participantesList.slice(0, 8);

  const userStories = (hallazgosList.length > 0 ? hallazgosList : [{ id: 0, recomendacion_mejora: 'Mejorar la usabilidad general del módulo evaluado.', prioridad: 'media' }])
    .slice(0, 8)
    .map((h, i) => {
      const id = `US-${String(i + 1).padStart(2, '0')}`;
      const priority = priorityFromHallazgo(h);
      const rec = h.recomendacion_mejora || 'una interfaz más clara y eficiente';
      return {
        id,
        title: `Mejora de usabilidad: hallazgo ${h.id || i + 1}`,
        description: `Como usuario, quiero ${rec.substring(0, 200)} para completar mis tareas con menos errores.`,
        priority,
        acceptanceCriteria: [
          'La mejora está implementada en el módulo evaluado.',
          'En re-test, los participantes reducen errores respecto a la línea base.',
          'El equipo documenta el cambio en el dashboard de hallazgos.'
        ].slice(0, 3)
      };
    });

  const obs = observacionesList[0];
  if (obs && obs.mejora_propuesta && userStories.length < 8) {
    userStories.push({
      id: `US-${String(userStories.length + 1).padStart(2, '0')}`,
      title: 'Aplicar mejora desde observación de prueba',
      description: `Como usuario, quiero que se aplique: ${obs.mejora_propuesta.substring(0, 180)}`,
      priority: 4,
      acceptanceCriteria: [
        'La mejora propuesta en observaciones está reflejada en la UI.',
        obs.criterio_exito ? `Se cumple el criterio de la tarea asociada.` : 'Se valida con al menos una sesión de prueba.'
      ]
    });
  }

  const tasks = [];
  userStories.forEach((us, i) => {
    tasks.push({
      id: `TK-${String(tasks.length + 1).padStart(2, '0')}`,
      title: `Análisis UX y wireframes para ${us.id}`,
      linkedStoryId: us.id,
      estimateHours: 4,
      techNotes: 'Documentar flujo actual vs propuesto; alinear con escenarios del guion de prueba.'
    });
    tasks.push({
      id: `TK-${String(tasks.length + 1).padStart(2, '0')}`,
      title: `Implementación frontend para ${us.id}`,
      linkedStoryId: us.id,
      estimateHours: 6,
      techNotes: 'Componentes React/Next; reutilizar design system del proyecto.'
    });
    if (i % 2 === 0) {
      tasks.push({
        id: `TK-${String(tasks.length + 1).padStart(2, '0')}`,
        title: `Pruebas de usabilidad de validación (${us.id})`,
        linkedStoryId: us.id,
        estimateHours: 3,
        techNotes: 'Registrar observaciones en API; comparar tiempo y errores vs baseline.'
      });
    }
  });

  const prioritization = userStories.map(us => ({
    itemId: us.id,
    score: us.priority,
    reason: `Derivado de hallazgos/observaciones del dashboard; prioridad ${us.priority}/5.`
  }));

  const tareaRef = tareasGuion.find(t => t.criterio_exito) || tareasGuion[0];
  const sprintDays = [];
  const chunk = Math.max(1, Math.ceil(days / Math.min(userStories.length, 5)));
  for (let d = 1; d <= days; d += 1) {
    const storyIdx = Math.min(userStories.length - 1, Math.floor((d - 1) / chunk));
    const us = userStories[storyIdx];
    const activities = d === 1
      ? [`Sprint planning — ${planDePrueba.producto}`, 'Revisión de métricas del dashboard']
      : d === days
        ? ['Sprint review y retrospectiva', `Validar criterio: ${tareaRef?.criterio_exito || 'cierre de historias'}`]
        : [`Avance en ${us?.id || 'historias'}`, 'Daily y actualización de hallazgos'];
    sprintDays.push({ day: d, activities });
  }

  const suggestedOwners = userStories.map((us, i) => ({
    storyId: us.id,
    participantId: String(owners[i % owners.length]?.id || '1')
  }));

  const sprintPlan = { days: sprintDays, suggestedOwners };

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
