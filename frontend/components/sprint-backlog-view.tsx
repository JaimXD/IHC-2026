"use client"

import { useMemo, useState, useEffect, useReducer } from "react"
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
  ListChecks,
  Edit2,
  Save,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { sprintBacklogReducer } from "./sprint-backlog/reducer"
import type { SprintBacklogData } from "./sprint-backlog/types"
import { UserStoriesList } from "./sprint-backlog/UserStoriesList"
import { TechnicalTasksTable } from "./sprint-backlog/TechnicalTasksTable"
import { PrioritizationPanel } from "./sprint-backlog/PrioritizationPanel"
import { SprintPlanSummary } from "./sprint-backlog/SprintPlanSummary"

export function SprintBacklogView() {
  const [data, dispatch] = useReducer(sprintBacklogReducer, null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())

  const [pruebas, setPruebas] = useState<any[]>([])
  const [selectedPruebaId, setSelectedPruebaId] = useState<string>("")
  const [summary, setSummary] = useState<any>(null)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)

  // ── Persistencia sessionStorage ──────────────────────────────────────────
  useEffect(() => {
    const savedData = sessionStorage.getItem("sprintBacklog_data")
    const savedPruebaId = sessionStorage.getItem("sprintBacklog_selectedPruebaId")
    if (savedData) {
      try {
        dispatch({ type: "SET_DATA", payload: JSON.parse(savedData) })
      } catch (e) {
        console.error("Error parsing stored data", e)
      }
    }
    if (savedPruebaId) setSelectedPruebaId(savedPruebaId)
  }, [])

  useEffect(() => {
    if (data) {
      sessionStorage.setItem("sprintBacklog_data", JSON.stringify(data))
    } else {
      sessionStorage.removeItem("sprintBacklog_data")
    }
  }, [data])

  useEffect(() => {
    if (selectedPruebaId) {
      sessionStorage.setItem("sprintBacklog_selectedPruebaId", selectedPruebaId)
    } else {
      sessionStorage.removeItem("sprintBacklog_selectedPruebaId")
    }
  }, [selectedPruebaId])

  // ── Carga de pruebas ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPruebas = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await fetch(`${baseUrl}/api/pruebas`)
        if (res.ok) setPruebas(await res.json())
      } catch (err) {
        console.error("Error fetching pruebas", err)
      }
    }
    fetchPruebas()
  }, [])

  useEffect(() => {
    if (!selectedPruebaId) {
      setSummary(null)
      return
    }
    const fetchSummary = async () => {
      setIsLoadingSummary(true)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const res = await fetch(`${baseUrl}/api/pruebas/${selectedPruebaId}/summary`)
        if (res.ok) setSummary(await res.json())
      } catch (err) {
        console.error("Error fetching summary", err)
      } finally {
        setIsLoadingSummary(false)
      }
    }
    fetchSummary()
  }, [selectedPruebaId])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleClearSession = () => {
    dispatch({ type: "CLEAR_DATA" })
    setSelectedPruebaId("")
    setSummary(null)
    setIsEditing(false)
    sessionStorage.removeItem("sprintBacklog_data")
    sessionStorage.removeItem("sprintBacklog_selectedPruebaId")
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    dispatch({ type: "CLEAR_DATA" })
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const res = await fetch(`${baseUrl}/api/sprint-backlog/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pruebaId: selectedPruebaId }),
      })
      if (!res.ok) throw new Error("Error al comunicarse con la IA del servidor")
      const response = await res.json()
      dispatch({ type: "SET_DATA", payload: response.data as SprintBacklogData })
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

  const toggleStory = (id: string) => {
    setExpandedStories((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // ── Cálculos derivados ────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (!data) return null
    const horas = data.tasks.reduce((s, t) => s + (t.estimatedHours || 0), 0)
    const dias = data.sprintPlan?.length || 0
    const horasMax = dias > 0 ? dias * 8 : 40
    const horasPct = Math.min(Math.round((horas / horasMax) * 100), 100)
    return {
      historias: data.userStories.length,
      tareas: data.tasks.length,
      horas,
      dias,
      horasMax,
      horasPct,
      horasColor: horasPct > 90 ? "bg-red-500" : horasPct > 70 ? "bg-amber-500" : "bg-emerald-500",
    }
  }, [data])

  const ownerByStory = useMemo(() => {
    const map = new Map<string, string>()
    if (!data?.sprintPlan) return map
    data.sprintPlan.forEach((day) => {
      if (!day.suggestedOwner) return
      data.userStories.forEach((us) => {
        if (day.activities.some((a) => a.includes(us.id)) && !map.has(us.id)) {
          map.set(us.id, day.suggestedOwner!)
        }
      })
    })
    return map
  }, [data])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ── Cabecera ── */}
      <div className="flex justify-between items-start print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Sprint Backlog (IA)
          </h1>
          <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
            Convierte hallazgos, observaciones y métricas del dashboard en historias, tareas y plan de sprint.
          </p>
        </div>

        {data && (
          <div className="flex gap-2 flex-wrap justify-end">
            <Button
              variant="outline"
              onClick={handleClearSession}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200 transition-all duration-200 active:scale-[0.97]"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className={`gap-2 transition-all duration-200 active:scale-[0.97] ${
                isEditing
                  ? "bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-200"
                  : "hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {isEditing ? "Guardar Cambios" : "Modo Edición"}
            </Button>
            <Button
              variant="outline"
              onClick={handleExportMD}
              className="gap-2 transition-all duration-200 active:scale-[0.97] hover:border-indigo-300 hover:text-indigo-600"
            >
              <FileText className="w-4 h-4" />
              Exportar MD
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-2 transition-all duration-200 active:scale-[0.97] hover:border-indigo-300 hover:text-indigo-600"
            >
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button
              onClick={handleGenerate}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all duration-200 active:scale-[0.97]"
            >
              <Sparkles className="w-4 h-4" />
              Regenerar
            </Button>
          </div>
        )}
      </div>

      {/* ── Formulario de generación ── */}
      {!data && !isGenerating && (
        <Card className="border-indigo-100 shadow-lg shadow-indigo-50 bg-gradient-to-br from-indigo-50/60 to-blue-50/40 overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 flex items-center gap-2 text-lg font-semibold tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
              Asistente de planificación ágil
            </CardTitle>
            <CardDescription className="text-slate-500">
              Selecciona un Plan de Prueba para generar hasta 8 historias de usuario, tareas técnicas y plan por días.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <div className="w-full max-w-md mb-8 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Plan de Prueba (Flujo)</label>
                <select
                  value={selectedPruebaId}
                  onChange={(e) => setSelectedPruebaId(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150"
                >
                  <option value="">Selecciona un plan de prueba...</option>
                  {pruebas.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.producto} {p.modulo_evaluado ? `- ${p.modulo_evaluado}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {isLoadingSummary && (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                </div>
              )}

              {summary && !isLoadingSummary && (
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                    Resumen del Flujo
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      { label: "Tareas", value: summary.tareasCount },
                      { label: "Participantes", value: summary.participantesCount },
                      { label: "Observaciones", value: summary.observacionesCount },
                      { label: "Hallazgos", value: summary.hallazgosCount },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="text-slate-500 block text-xs uppercase tracking-wide mb-0.5">{label}</span>
                        <span className="font-bold text-slate-900 text-lg">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={!selectedPruebaId || isLoadingSummary}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-full px-10 shadow-lg shadow-indigo-200 transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:shadow-none"
            >
              <Sparkles className="w-4 h-4" />
              Generar Sprint Backlog
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Loader ── */}
      {isGenerating && (
        <Card className="border-indigo-100 shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-800">Analizando datos del dashboard...</p>
              <p className="text-sm text-slate-500 mt-1">La IA está procesando los hallazgos del flujo</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Vista de resultados ── */}
      {data && kpis && !isGenerating && (
        <div className="space-y-6 print:space-y-4">

          {/* Banner de meta — glassmorphism */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-700 rounded-2xl p-7 text-white shadow-xl shadow-indigo-200 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-200" />
                <h2 className="text-lg font-bold tracking-tight">Meta del Sprint</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: FileStack, label: `${data.userStories.length} historias` },
                  { icon: ListChecks, label: `${data.tasks.length} tareas` },
                  { icon: Clock, label: `${kpis.horas}h estimadas` },
                  { icon: Calendar, label: `${kpis.dias} días` },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-200" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Historias */}
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group bg-white">
              <div className="h-1 bg-blue-500 rounded-t-xl" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileStack className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{kpis.historias}</p>
                <p className="text-sm text-slate-500 mt-1">Historias</p>
              </CardContent>
            </Card>

            {/* Tareas técnicas */}
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group bg-white">
              <div className="h-1 bg-violet-500 rounded-t-xl" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ListChecks className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{kpis.tareas}</p>
                <p className="text-sm text-slate-500 mt-1">Tareas técnicas</p>
              </CardContent>
            </Card>

            {/* Horas estimadas — con barra de progreso */}
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group bg-white">
              <div className={`h-1 rounded-t-xl ${kpis.horasColor}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{kpis.horas}</p>
                <p className="text-sm text-slate-500 mt-1">Horas estimadas</p>
                <div className="mt-3">
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${kpis.horasColor}`}
                      style={{ width: `${kpis.horasPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{kpis.horas}/{kpis.horasMax}h capacidad</p>
                </div>
              </CardContent>
            </Card>

            {/* Días de sprint */}
            <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group bg-white">
              <div className="h-1 bg-amber-500 rounded-t-xl" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{kpis.dias}</p>
                <p className="text-sm text-slate-500 mt-1">Días de sprint</p>
              </CardContent>
            </Card>
          </div>

          {/* Subcomponentes */}
          <UserStoriesList
            userStories={data.userStories}
            expandedStories={expandedStories}
            ownerByStory={ownerByStory}
            isEditing={isEditing}
            onToggleStory={toggleStory}
            dispatch={dispatch}
          />

          <TechnicalTasksTable tasks={data.tasks} isEditing={isEditing} dispatch={dispatch} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PrioritizationPanel
              prioritization={data.prioritization}
              isEditing={isEditing}
              dispatch={dispatch}
            />
            <SprintPlanSummary sprintPlan={data.sprintPlan} isEditing={isEditing} dispatch={dispatch} />
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
