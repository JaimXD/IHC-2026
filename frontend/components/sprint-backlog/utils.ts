/** Prioridad 1 = más alta, 5 = más baja */
export function priorityLabel(p: number): { text: string; className: string } {
  if (p <= 1) return { text: "Crítica", className: "bg-red-100 text-red-700" }
  if (p <= 2) return { text: "Alta", className: "bg-orange-100 text-orange-700" }
  if (p <= 3) return { text: "Media", className: "bg-amber-100 text-amber-700" }
  if (p <= 4) return { text: "Baja", className: "bg-green-100 text-green-700" }
  return { text: "Muy baja", className: "bg-slate-100 text-slate-600" }
}
