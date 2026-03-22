"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Users,
  Activity,
  ChevronRight,
} from "lucide-react"
import {
  RadialBarChart,
  RadialBar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"

interface ApiObservacion {
  id: number
  participante_id: number
  tarea_id: number
  exito: boolean | number
  tiempo_segundos: number
  cantidad_errores: number
}

interface ApiHallazgo {
  id: number
  severidad: "baja" | "media" | "alta" | "critica"
  estado: "abierto" | "en_progreso" | "resuelto"
  recomendacion_mejora: string
}

interface ApiTarea {
  id: number
}

interface ApiParticipante {
  id: number
}

const SEVERIDAD_META = {
  critica: { name: "Crítico", fill: "var(--color-destructive)" },
  alta: { name: "Grave", fill: "var(--color-warning)" },
  media: { name: "Moderado", fill: "var(--color-info)" },
  baja: { name: "Menor", fill: "var(--color-success)" },
} as const

const SEVERITY_BADGE: Record<string, string> = {
  Crítico: "bg-destructive/15 text-destructive border-destructive/30",
  Grave: "bg-warning/15 text-warning-foreground border-warning/30",
  Moderado: "bg-info/15 text-info border-info/30",
  Menor: "bg-success/15 text-success border-success/30",
}

const STATUS_BADGE: Record<string, string> = {
  Abierto: "bg-destructive/10 text-destructive",
  "En progreso": "bg-warning/10 text-warning-foreground",
  Resuelto: "bg-success/10 text-success",
}

const DASHBOARD_REFRESH_MS = 45_000

const toBoolean = (value: boolean | number) => value === true || value === 1

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00 min"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, "0")} min`
}

const formatTaskLabel = (id: number) => `T-${String(id).padStart(2, "0")}`

export function DashboardView() {
  const [observaciones, setObservaciones] = useState<ApiObservacion[]>([])
  const [hallazgos, setHallazgos] = useState<ApiHallazgo[]>([])
  const [tareas, setTareas] = useState<ApiTarea[]>([])
  const [participantes, setParticipantes] = useState<ApiParticipante[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchDashboardData = async (isBackgroundRefresh = false) => {
      if (!isBackgroundRefresh) {
        setLoading(true)
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        const [obsRes, hallRes, tareasRes, partRes] = await Promise.all([
          fetch(`${baseUrl}/api/observaciones`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/hallazgos`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/tareas`, { cache: "no-store" }),
          fetch(`${baseUrl}/api/participantes`, { cache: "no-store" }),
        ])

        if (!obsRes.ok || !hallRes.ok || !tareasRes.ok || !partRes.ok) {
          throw new Error("No se pudieron cargar las métricas del dashboard")
        }

        const [obsData, hallData, tareasData, partData] = await Promise.all([
          obsRes.json() as Promise<ApiObservacion[]>,
          hallRes.json() as Promise<ApiHallazgo[]>,
          tareasRes.json() as Promise<ApiTarea[]>,
          partRes.json() as Promise<ApiParticipante[]>,
        ])

        if (cancelled) return

        setObservaciones(obsData)
        setHallazgos(hallData)
        setTareas(tareasData)
        setParticipantes(partData)
        setFetchError(null)
      } catch (error) {
        console.error(error)
        if (cancelled) return
        setFetchError("No se pudieron cargar algunas métricas en tiempo real")
      } finally {
        if (!cancelled && !isBackgroundRefresh) {
          setLoading(false)
        }
      }
    }

    void fetchDashboardData()
    const intervalId = window.setInterval(() => {
      void fetchDashboardData(true)
    }, DASHBOARD_REFRESH_MS)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [])

  const metrics = useMemo(() => {
    const totalObservaciones = observaciones.length
    const exitosas = observaciones.filter((item) => toBoolean(item.exito)).length
    const exitoPct = totalObservaciones > 0 ? Math.round((exitosas / totalObservaciones) * 100) : 0
    const totalTiempo = observaciones.reduce((acc, item) => acc + (item.tiempo_segundos || 0), 0)
    const avgTiempo = totalObservaciones > 0 ? Math.round(totalTiempo / totalObservaciones) : 0
    const totalErrores = observaciones.reduce((acc, item) => acc + (item.cantidad_errores || 0), 0)
    const totalHallazgos = hallazgos.length
    const pendientesHallazgos = hallazgos.filter((item) => item.estado !== "resuelto").length

    const severidadCount = {
      critica: 0,
      alta: 0,
      media: 0,
      baja: 0,
    }

    hallazgos.forEach((item) => {
      if (item.severidad in severidadCount) {
        severidadCount[item.severidad] += 1
      }
    })

    const severidadData = [
      { name: SEVERIDAD_META.critica.name, value: severidadCount.critica, fill: SEVERIDAD_META.critica.fill },
      { name: SEVERIDAD_META.alta.name, value: severidadCount.alta, fill: SEVERIDAD_META.alta.fill },
      { name: SEVERIDAD_META.media.name, value: severidadCount.media, fill: SEVERIDAD_META.media.fill },
      { name: SEVERIDAD_META.baja.name, value: severidadCount.baja, fill: SEVERIDAD_META.baja.fill },
    ]

    const tareasData = tareas
      .map((tarea) => {
        const obsTarea = observaciones.filter((obs) => obs.tarea_id === tarea.id)
        const exito = obsTarea.filter((obs) => toBoolean(obs.exito)).length
        return {
          tarea: formatTaskLabel(tarea.id),
          exito,
          fallo: obsTarea.length - exito,
        }
      })
      .sort((a, b) => a.tarea.localeCompare(b.tarea))

    const recentFindings = [...hallazgos]
      .sort((a, b) => b.id - a.id)
      .slice(0, 4)
      .map((item) => ({
        id: `H-${String(item.id).padStart(3, "0")}`,
        descripcion: item.recomendacion_mejora,
        severidad: SEVERIDAD_META[item.severidad].name,
        estado:
          item.estado === "abierto"
            ? "Abierto"
            : item.estado === "en_progreso"
              ? "En progreso"
              : "Resuelto",
      }))

    const tareasTotales = tareas.length
    const tareasPorParticipante = new Map<number, Set<number>>()
    observaciones.forEach((obs) => {
      if (!tareasPorParticipante.has(obs.participante_id)) {
        tareasPorParticipante.set(obs.participante_id, new Set<number>())
      }
      tareasPorParticipante.get(obs.participante_id)?.add(obs.tarea_id)
    })

    let sesionesCompletadas = 0
    let enProgreso = 0

    participantes.forEach((participante) => {
      const completadas = tareasPorParticipante.get(participante.id)?.size || 0
      if (tareasTotales > 0 && completadas >= tareasTotales) {
        sesionesCompletadas += 1
      } else if (completadas > 0) {
        enProgreso += 1
      }
    })

    const pendientes = Math.max(participantes.length - sesionesCompletadas - enProgreso, 0)

    const kpiData = [
      {
        id: "exito",
        label: "Tareas Exitosas",
        value: `${exitoPct}%`,
        subtext: `${exitosas} de ${totalObservaciones} observaciones exitosas`,
        icon: CheckCircle2,
        color: "text-success",
        bg: "bg-success/10",
        border: "border-success/20",
      },
      {
        id: "tiempo",
        label: "Tiempo Promedio",
        value: formatTime(avgTiempo),
        subtext: "Promedio por observación",
        icon: Clock,
        color: "text-info",
        bg: "bg-info/10",
        border: "border-info/20",
      },
      {
        id: "errores",
        label: "Total de Errores",
        value: String(totalErrores),
        subtext: `En ${participantes.length} participantes`,
        icon: AlertCircle,
        color: "text-destructive",
        bg: "bg-destructive/10",
        border: "border-destructive/20",
      },
      {
        id: "hallazgos",
        label: "Hallazgos Totales",
        value: String(totalHallazgos),
        subtext: `${pendientesHallazgos} pendientes de resolución`,
        icon: Lightbulb,
        color: "text-warning",
        bg: "bg-warning/10",
        border: "border-warning/20",
      },
    ]

    return {
      kpiData,
      severidadData,
      tareasData,
      recentFindings,
      participantsSummary: {
        total: participantes.length,
        completadas: sesionesCompletadas,
        enProgreso,
        pendientes,
      },
    }
  }, [observaciones, hallazgos, tareas, participantes])

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Dashboard Principal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general de las métricas de usabilidad capturadas en tiempo real.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Actualización automática cada 45 segundos.</p>
        {fetchError && (
          <p className="mt-2 text-xs text-destructive">{fetchError}</p>
        )}
        {loading && (
          <p className="mt-2 text-xs text-muted-foreground">Cargando métricas...</p>
        )}
      </div>

      {/* KPI Cards */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Indicadores clave de rendimiento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.kpiData.map((kpi) => {
            const Icon = kpi.icon
            return (
              <article
                key={kpi.id}
                className={`bg-card rounded-lg border ${kpi.border} p-5 flex items-start gap-4`}
                aria-label={kpi.label}
              >
                <div className={`${kpi.bg} rounded-md p-2.5 shrink-0`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className={`text-2xl font-bold mt-0.5 ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{kpi.subtext}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart: Tareas */}
        <section
          aria-labelledby="tareas-chart-heading"
          className="bg-card rounded-lg border border-border p-5 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" aria-hidden="true" />
            <h2 id="tareas-chart-heading" className="text-sm font-semibold text-foreground">
              Resultado por Tarea
            </h2>
          </div>
          <div className="h-48" role="img" aria-label="Gráfico de barras: éxito y fallo por tarea">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.tareasData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="tarea" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="exito" name="Éxito" fill="var(--color-success)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="fallo" name="Fallo" fill="var(--color-destructive)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Severity donut-like chart */}
        <section
          aria-labelledby="severidad-chart-heading"
          className="bg-card rounded-lg border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" aria-hidden="true" />
            <h2 id="severidad-chart-heading" className="text-sm font-semibold text-foreground">
              Hallazgos por Severidad
            </h2>
          </div>
          <div className="h-36" role="img" aria-label="Gráfico radial de hallazgos por severidad">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="30%"
                outerRadius="90%"
                data={metrics.severidadData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" label={false}>
                  {metrics.severidadData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </RadialBar>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1" aria-label="Leyenda de severidad">
            {metrics.severidadData.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ background: item.fill }}
                    aria-hidden="true"
                  />
                  {item.name}
                </span>
                <span className="font-semibold text-foreground">{item.value}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Recent findings table */}
      <section aria-labelledby="findings-heading" className="bg-card rounded-lg border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" aria-hidden="true" />
            <h2 id="findings-heading" className="text-sm font-semibold text-foreground">
              Hallazgos Recientes
            </h2>
          </div>
          <a
            href="/hallazgos"
            className="text-xs text-primary hover:underline flex items-center gap-0.5 focus:outline-none focus:ring-2 focus:ring-ring rounded"
            aria-label="Ver todos los hallazgos"
          >
            Ver todos <ChevronRight className="w-3 h-3" aria-hidden="true" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Tabla de hallazgos recientes">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">ID</th>
                <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Descripción</th>
                <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Severidad</th>
                <th scope="col" className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentFindings.map((f, i) => (
                <tr
                  key={f.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 1 ? "bg-muted/10" : ""}`}
                >
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{f.id}</td>
                  <td className="px-5 py-3 text-sm text-foreground leading-relaxed max-w-xs">{f.descripcion}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded border text-xs font-medium ${SEVERITY_BADGE[f.severidad] ?? ""}`}>
                      {f.severidad}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${STATUS_BADGE[f.estado] ?? ""}`}>
                      {f.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {metrics.recentFindings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-4 text-center text-xs text-muted-foreground">
                    Aún no hay hallazgos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Participants summary */}
      <section aria-labelledby="participants-heading" className="bg-card rounded-lg border border-border p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary" aria-hidden="true" />
          <h2 id="participants-heading" className="text-sm font-semibold text-foreground">
            Participantes
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total registrados", value: String(metrics.participantsSummary.total) },
            { label: "Sesiones completadas", value: String(metrics.participantsSummary.completadas) },
            { label: "En progreso", value: String(metrics.participantsSummary.enProgreso) },
            { label: "Pendientes", value: String(metrics.participantsSummary.pendientes) },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold text-primary">{item.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
