"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PrioritizationItem, SprintBacklogAction } from "./types"

const inputCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-150"

const scoreColors = [
  "bg-red-100 text-red-700 border-red-200",
  "bg-orange-100 text-orange-700 border-orange-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
]

interface PrioritizationPanelProps {
  prioritization: PrioritizationItem[]
  isEditing: boolean
  dispatch: React.Dispatch<SprintBacklogAction>
}

export function PrioritizationPanel({ prioritization, isEditing, dispatch }: PrioritizationPanelProps) {
  return (
    <Card
      className={`shadow-sm transition-all duration-300 border-slate-200/80 ${
        isEditing ? "ring-2 ring-amber-300/60 shadow-amber-50" : "hover:shadow-md"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-slate-900 font-semibold tracking-tight">Priorización</CardTitle>
        {isEditing && (
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
            Editando
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {[...prioritization]
          .sort((a, b) => a.score - b.score)
          .map((p) => {
            const colorClass = scoreColors[Math.min(Math.floor(p.score) - 1, 4)] ?? scoreColors[4]
            return (
              <div
                key={p.userStoryId}
                className="flex gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all duration-200"
              >
                {/* Score badge */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
                  {isEditing ? (
                    <input
                      type="number"
                      min="1"
                      max="5"
                      className={`${inputCls} w-14 text-center font-bold`}
                      value={p.score}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PRIORITIZATION",
                          id: p.userStoryId,
                          field: "score",
                          value: parseFloat(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <span
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center text-sm font-bold ${colorClass}`}
                    >
                      {p.score}
                    </span>
                  )}
                  {!isEditing && <span className="text-[10px] text-slate-400">/5</span>}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100 mb-1.5 inline-block">
                    {p.userStoryId}
                  </span>
                  {isEditing ? (
                    <textarea
                      className={`${inputCls} w-full mt-1 resize-none`}
                      rows={2}
                      value={p.justification}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_PRIORITIZATION",
                          id: p.userStoryId,
                          field: "justification",
                          value: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm text-slate-600 leading-relaxed">{p.justification}</p>
                  )}
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
