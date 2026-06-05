import type { SprintBacklogData } from "@/components/sprint-backlog/types"

export function generateMarkdownFromData(data: SprintBacklogData): string {
  let md = "# Sprint Backlog\n\n"

  md += "## Historias de Usuario\n\n"
  data.userStories.forEach((us) => {
    md += `### ${us.id}: ${us.title} (Prioridad: ${us.priority})\n`
    md += `${us.description}\n\n**Criterios de Aceptación:**\n`
    us.acceptanceCriteria.forEach((c) => {
      if (c.trim()) md += `- ${c}\n`
    })
    md += "\n"
  })

  md += "## Tareas Técnicas\n\n"
  md += "| Historia | Tarea | Horas | Notas |\n|---|---|---|---|\n"
  data.tasks.forEach((t) => {
    md += `| ${t.userStoryId} | ${t.title} | ${t.estimatedHours}h | ${t.technicalNotes || "-"} |\n`
  })
  md += "\n"

  md += "## Priorización\n\n"
  data.prioritization.forEach((p) => {
    md += `- **${p.userStoryId}** (Score: ${p.score}/5): ${p.justification}\n`
  })
  md += "\n"

  md += "## Plan del Sprint\n\n"
  data.sprintPlan.forEach((d) => {
    md += `### Día ${d.day} ${d.suggestedOwner ? `(${d.suggestedOwner})` : ""}\n`
    d.activities.forEach((a) => {
      if (a.trim()) md += `- ${a}\n`
    })
    md += "\n"
  })

  return md
}
