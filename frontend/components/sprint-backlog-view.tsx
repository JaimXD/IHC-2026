"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sparkles,
  FileText,
  Download,
  Loader2,
  Bot,
  Target,
  FileStack,
  Clock,
  Calendar,
  Users,
  ListChecks,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { toast } from "sonner"

interface UserStory {
  id: string
  title: string
  description: string
  priority: number
  acceptanceCriteria: string[]
}

interface TechnicalTask {
  id: string
  title: string
  linkedStoryId: string
  estimateHours: number
  techNotes?: string
}

interface PrioritizationItem {
  itemId: string
  score: number
  reason: string
}

interface SprintBacklogData {
  userStories: UserStory[]
  tasks: TechnicalTask[]
  prioritization: PrioritizationItem[]
  sprintPlan: {
    days: { day: number; activities: string[] }[]
    suggestedOwners: { storyId: string; participantId: string }[]
  }
  markdown: string
}

const priorityLabel = (p: number) => {
  if (p >= 5) return { text: "Crítica", className: "bg-red-100 text-red-700" }
  if (p >= 4) return { text: "Alta", className: "bg-orange-100 text-orange-700" }
  if (p >= 3) return { text: "Media", className: "bg-amber-100 text-amber-700" }
  return { text: "Baja", className: "bg-green-100 text-green-700" }
}

export function SprintBacklogView() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [data, setData] = useState<SprintBacklogData | null>(null)
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())

  const kpis = useMemo(() => {
    if (!data) return null
    const totalHours = data.tasks.reduce((s, t) => s + (t.estimateHours || 0), 0)
    const sprintDays = data.sprintPlan?.days?.length || 0
    return {
      historias: data.userStories.length,
      tareas: data.tasks.length,
      horas: totalHours,
      dias: sprintDays,
    }
  }, [data])

  const toggleStory = (id: string) => {
    setExpandedStories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setData(null)

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const res = await fetch(`${baseUrl}/api/sprint-backlog/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (!res.ok) throw new Error("Error al comunicarse con la IA del servidor")

      const response = await res.json()
      setData(response.data as SprintBacklogData)
      setExpandedStories(new Set())

      if (response.metadata?.aiSource === "local-fallback") {
        toast.warning("Gemini no disponible. Se utilizó el generador local de respaldo.")
      } else {
        toast.success("Sprint Backlog generado con éxito")
      }
    } catch (error) {
      console.error(error)
      toast.error("Error al generar el backlog. Revisa el backend.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = () => {
    toast.info("Abre el diálogo de impresión y selecciona 'Guardar como PDF'")
    setTimeout(() => window.print(), 500)
  }

  const handleExportMD = () => {
    if (!data?.markdown) return
    const blob = new Blob([data.markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "sprint_backlog.md"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Archivo Markdown exportado")
  }

  const ownerMap = useMemo(() => {
    const map = new Map<string, string>()
    data?.sprintPlan?.suggestedOwners?.forEach((o) => map.set(o.storyId, o.participantId))
    return map
  }, [data])

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            Sprint Backlog (IA)
          </h1>
          <p className="text-muted-foreground max-w-3xl">
            Convierte hallazgos, observaciones y métricas del dashboard en historias, tareas y plan de sprint.
          </p>
        </div>

        {data && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportMD} className="gap-2">
              <FileText className="w-4 h-4" />
              Exportar MD
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button onClick={handleGenerate} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              <Sparkles className="w-4 h-4" />
              Regenerar
            </Button>
          </div>
        )}
      </div>

      {!data && !isGenerating && (
        <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="text-indigo-800 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Asistente de planificación ágil
            </CardTitle>
            <CardDescription>
              Analiza el Usability Test Dashboard y genera hasta 8 historias de usuario, tareas técnicas y plan por días.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-10">
            <Button
              size="lg"
              onClick={handleGenerate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-full px-8"
            >
              <Sparkles className="w-4 h-4" />
              Generar Sprint Backlog
            </Button>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="font-medium">Analizando datos del dashboard...</p>
          </CardContent>
        </Card>
      )}

      {data && kpis && !isGenerating && (
        <div className="space-y-6 print:space-y-4">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-indigo-200" />
              <h2 className="text-xl font-bold">Meta del Sprint</h2>
            </div>
            <p className="text-lg opacity-95">
              {data.userStories.length} historias · {data.tasks.length} tareas · {kpis.horas}h estimadas ·{" "}
              {kpis.dias} días planificados
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Historias</p>
                <p className="text-3xl font-bold">{kpis.historias}</p>
                <FileStack className="w-5 h-5 text-blue-600 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Tareas técnicas</p>
                <p className="text-3xl font-bold">{kpis.tareas}</p>
                <ListChecks className="w-5 h-5 text-purple-600 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Horas estimadas</p>
                <p className="text-3xl font-bold">{kpis.horas}</p>
                <Clock className="w-5 h-5 text-emerald-600 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Días de sprint</p>
                <p className="text-3xl font-bold">{kpis.dias}</p>
                <Calendar className="w-5 h-5 text-amber-600 mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historias de usuario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.userStories.map((us) => {
                const pr = priorityLabel(us.priority)
                const expanded = expandedStories.has(us.id)
                const owner = ownerMap.get(us.id)
                return (
                  <div key={us.id} className="border rounded-lg p-4 bg-slate-50/50">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-sm font-semibold">{us.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pr.className}`}>
                            {pr.text} ({us.priority}/5)
                          </span>
                          {owner && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Participante #{owner}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-slate-800">{us.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{us.description}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleStory(us.id)}>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>
                    {expanded && (
                      <ul className="mt-3 space-y-1 text-sm border-t pt-3">
                        {us.acceptanceCriteria.map((c, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-indigo-500">✓</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tareas técnicas</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Historia</th>
                    <th className="px-4 py-3 text-left">Tarea</th>
                    <th className="px-4 py-3 text-left">Horas</th>
                    <th className="px-4 py-3 text-left">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-mono">{t.id}</td>
                      <td className="px-4 py-3">{t.linkedStoryId}</td>
                      <td className="px-4 py-3 font-medium">{t.title}</td>
                      <td className="px-4 py-3">{t.estimateHours}h</td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">{t.techNotes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Priorización</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...data.prioritization]
                  .sort((a, b) => b.score - a.score)
                  .map((p) => (
                    <div key={p.itemId} className="text-sm border-l-4 border-indigo-400 pl-3">
                      <span className="font-mono font-semibold">{p.itemId}</span>
                      <span className="ml-2 text-indigo-600 font-medium">{p.score}/5</span>
                      <p className="text-slate-600 mt-0.5">{p.reason}</p>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan del sprint (resumen)</CardTitle>
              </CardHeader>
              <CardContent className="max-h-80 overflow-y-auto space-y-2 text-sm">
                {data.sprintPlan.days.slice(0, 7).map((d) => (
                  <div key={d.day}>
                    <span className="font-semibold text-indigo-700">Día {d.day}</span>
                    <ul className="list-disc list-inside text-slate-600 ml-1">
                      {d.activities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {data.sprintPlan.days.length > 7 && (
                  <p className="text-muted-foreground text-xs">
                    +{data.sprintPlan.days.length - 7} días más (ver exportación MD)
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden; }
          #sidebar, header, button { display: none !important; }
          .max-w-6xl, .max-w-6xl * { visibility: visible; }
          .max-w-6xl { position: absolute; left: 0; top: 0; width: 100% !important; }
        }
      `,
        }}
      />
    </div>
  )
}
