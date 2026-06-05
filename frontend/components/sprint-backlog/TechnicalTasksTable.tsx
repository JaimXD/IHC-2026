"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { TechnicalTask, SprintBacklogAction } from "./types"

const inputCls =
  "bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-150"

interface TechnicalTasksTableProps {
  tasks: TechnicalTask[]
  isEditing: boolean
  dispatch: React.Dispatch<SprintBacklogAction>
}

export function TechnicalTasksTable({ tasks, isEditing, dispatch }: TechnicalTasksTableProps) {
  return (
    <Card
      className={`shadow-sm transition-all duration-300 border-slate-200/80 overflow-hidden ${
        isEditing ? "ring-2 ring-amber-300/60 shadow-amber-50" : "hover:shadow-md"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-slate-900 font-semibold tracking-tight">Tareas técnicas</CardTitle>
        {isEditing && (
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
            Editando
          </span>
        )}
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-y border-slate-100 text-xs uppercase text-slate-500 tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Historia</th>
              <th className="px-5 py-3 text-left font-semibold">Tarea</th>
              <th className="px-5 py-3 text-left w-28 font-semibold">Horas</th>
              <th className="px-5 py-3 text-left font-semibold">Notas técnicas</th>
              {isEditing && <th className="px-5 py-3 text-center w-16 font-semibold">—</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((t, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50/40 transition-colors duration-150 group"
              >
                <td className="px-5 py-3.5">
                  {isEditing ? (
                    <input
                      className={`${inputCls} w-20`}
                      value={t.userStoryId}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_TASK", index: i, field: "userStoryId", value: e.target.value })
                      }
                    />
                  ) : (
                    <span className="font-mono text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                      {t.userStoryId}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-800">
                  {isEditing ? (
                    <input
                      className={`${inputCls} w-full`}
                      value={t.title}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_TASK", index: i, field: "title", value: e.target.value })
                      }
                    />
                  ) : (
                    t.title
                  )}
                </td>
                <td className="px-5 py-3.5">
                  {isEditing ? (
                    <input
                      type="number"
                      className={`${inputCls} w-16`}
                      value={t.estimatedHours}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_TASK",
                          index: i,
                          field: "estimatedHours",
                          value: parseFloat(e.target.value),
                        })
                      }
                    />
                  ) : (
                    <span className="text-slate-600 font-medium">
                      {t.estimatedHours}
                      <span className="text-slate-400 text-xs">h</span>
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-slate-500 max-w-xs">
                  {isEditing ? (
                    <input
                      className={`${inputCls} w-full`}
                      value={t.technicalNotes || ""}
                      onChange={(e) =>
                        dispatch({ type: "UPDATE_TASK", index: i, field: "technicalNotes", value: e.target.value })
                      }
                    />
                  ) : (
                    <span className="text-sm leading-relaxed">{t.technicalNotes || "—"}</span>
                  )}
                </td>
                {isEditing && (
                  <td className="px-5 py-3.5 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0 rounded-lg transition-all duration-150 active:scale-95"
                      onClick={() => dispatch({ type: "REMOVE_TASK", index: i })}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {isEditing && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: "ADD_TASK" })}
              className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-150 active:scale-[0.97]"
            >
              <Plus className="w-3.5 h-3.5" /> Agregar Tarea
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
