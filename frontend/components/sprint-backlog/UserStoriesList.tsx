"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Users } from "lucide-react"
import type { UserStory, SprintBacklogAction } from "./types"
import { priorityLabel } from "./utils"

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all duration-150"

const textareaCls = `${inputCls} resize-none`

interface UserStoriesListProps {
  userStories: UserStory[]
  expandedStories: Set<string>
  ownerByStory: Map<string, string>
  isEditing: boolean
  onToggleStory: (id: string) => void
  dispatch: React.Dispatch<SprintBacklogAction>
}

export function UserStoriesList({
  userStories,
  expandedStories,
  ownerByStory,
  isEditing,
  onToggleStory,
  dispatch,
}: UserStoriesListProps) {
  return (
    <Card
      className={`shadow-sm transition-all duration-300 border-slate-200/80 ${
        isEditing ? "ring-2 ring-amber-300/60 shadow-amber-50" : "hover:shadow-md"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-slate-900 font-semibold tracking-tight">Historias de usuario</CardTitle>
        {isEditing && (
          <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
            Editando
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {userStories.map((us) => {
          const pr = priorityLabel(us.priority)
          const expanded = expandedStories.has(us.id)
          const owner = ownerByStory.get(us.id)
          return (
            <div
              key={us.id}
              className="border border-slate-200/80 rounded-xl p-5 bg-white shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    {/* ID badge */}
                    <span className="font-mono text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                      {us.id}
                    </span>
                    {isEditing ? (
                      <select
                        className="border border-slate-200 rounded-full text-xs px-2.5 py-0.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-150"
                        value={us.priority}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_STORY",
                            id: us.id,
                            field: "priority",
                            value: parseInt(e.target.value),
                          })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${pr.className}`}>
                        {pr.text} ({us.priority}/5)
                      </span>
                    )}
                    {owner && (
                      <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                        <Users className="w-3 h-3" />
                        {owner}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 mt-2 w-full">
                      <input
                        className={`${inputCls} font-semibold`}
                        value={us.title}
                        placeholder="Título de la historia"
                        onChange={(e) =>
                          dispatch({ type: "UPDATE_STORY", id: us.id, field: "title", value: e.target.value })
                        }
                      />
                      <textarea
                        className={textareaCls}
                        rows={2}
                        placeholder="Descripción"
                        value={us.description}
                        onChange={(e) =>
                          dispatch({ type: "UPDATE_STORY", id: us.id, field: "description", value: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-slate-900 leading-snug">{us.title}</h3>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{us.description}</p>
                    </>
                  )}
                </div>

                {/* Toggle button — chevron rotates */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStory(us.id)}
                  className="rounded-full w-8 h-8 p-0 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 flex-shrink-0"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : "rotate-0"}`}
                  />
                </Button>
              </div>

              {/* Accordion — CSS grid trick para animación suave */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  expanded ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Criterios de Aceptación
                    </p>
                    {isEditing ? (
                      <textarea
                        className={textareaCls}
                        rows={4}
                        placeholder="Un criterio por línea"
                        value={us.acceptanceCriteria.join("\n")}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_STORY",
                            id: us.id,
                            field: "acceptanceCriteria",
                            value: e.target.value.split("\n"),
                          })
                        }
                      />
                    ) : (
                      <ul className="space-y-1.5">
                        {us.acceptanceCriteria.map((c, i) => (
                          <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                            <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                              ✓
                            </span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
