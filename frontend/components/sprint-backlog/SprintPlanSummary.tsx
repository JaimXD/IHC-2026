"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SprintPlanDay, SprintBacklogAction } from "./types"

const inputCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-150"

/** Cicla entre 5 pares de colores para los nodos de la timeline */
const nodeColors = [
  "from-indigo-500 to-blue-600",
  "from-violet-500 to-indigo-600",
  "from-blue-500 to-cyan-600",
  "from-sky-500 to-blue-600",
  "from-purple-500 to-violet-600",
]

interface SprintPlanSummaryProps {
  sprintPlan: SprintPlanDay[]
  isEditing: boolean
  dispatch: React.Dispatch<SprintBacklogAction>
}

export function SprintPlanSummary({ sprintPlan, isEditing, dispatch }: SprintPlanSummaryProps) {
  const visible = sprintPlan.slice(0, 7)
  const remaining = sprintPlan.length - 7

  return (
    <Card
      className={`shadow-sm transition-all duration-300 border-slate-200/80 ${
        isEditing ? "ring-2 ring-amber-300/60 shadow-amber-50" : "hover:shadow-md"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-slate-900 font-semibold tracking-tight">Plan del sprint</CardTitle>
        {isEditing && (
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
            Editando
          </span>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {/* Timeline container */}
        <div className="relative pl-10 max-h-[420px] overflow-y-auto pr-2">
          {/* Línea vertical continua */}
          <div className="absolute left-[18px] top-1 bottom-6 w-0.5 bg-gradient-to-b from-indigo-400 via-blue-300 to-transparent rounded-full" />

          {visible.map((d, i) => {
            const nodeGradient = nodeColors[i % nodeColors.length]
            return (
              <div key={i} className="relative mb-6 last:mb-0">
                {/* Nodo numerado */}
                <div
                  className={`absolute -left-10 w-7 h-7 rounded-full bg-gradient-to-br ${nodeGradient} flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white`}
                >
                  {d.day}
                </div>

                {/* Contenido del día */}
                <div className="bg-slate-50/70 hover:bg-white border border-slate-100 hover:border-indigo-100 rounded-xl p-3.5 transition-all duration-200 hover:shadow-sm">
                  {/* Cabecera del día */}
                  {isEditing ? (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">Día {d.day}</span>
                      <input
                        className={`${inputCls} flex-1 min-w-[120px] py-0.5`}
                        placeholder="Responsable"
                        value={d.suggestedOwner || ""}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_SPRINT_PLAN",
                            dayIndex: i,
                            field: "suggestedOwner",
                            value: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm font-semibold text-slate-800">Día {d.day}</span>
                      {d.suggestedOwner && (
                        <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full font-medium">
                          {d.suggestedOwner}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actividades */}
                  {isEditing ? (
                    <textarea
                      className={`${inputCls} w-full resize-none`}
                      rows={3}
                      placeholder="Una actividad por línea"
                      value={d.activities.join("\n")}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_SPRINT_PLAN",
                          dayIndex: i,
                          field: "activities",
                          value: e.target.value.split("\n"),
                        })
                      }
                    />
                  ) : (
                    <ul className="space-y-1">
                      {d.activities.map((a, j) => (
                        <li key={j} className="flex gap-2 items-start text-sm text-slate-600">
                          <span className="text-indigo-400 flex-shrink-0 mt-0.5 leading-none">•</span>
                          <span className="leading-relaxed">{a}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}

          {remaining > 0 && (
            <div className="relative pl-0">
              <div className="absolute -left-10 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                <span className="text-slate-500 text-[10px] font-bold">···</span>
              </div>
              <p className="text-xs text-slate-400 pt-1.5 pl-1">
                +{remaining} día{remaining > 1 ? "s" : ""} más — ver exportación MD
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
