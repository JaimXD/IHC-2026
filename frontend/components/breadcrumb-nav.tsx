"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

const BREADCRUMB_MAP: Record<string, BreadcrumbItem[]> = {
  "/": [{ label: "Dashboard" }],
  "/plan": [
    { label: "Dashboard", href: "/" },
    { label: "Plan de Pruebas" },
  ],
  "/tareas": [
    { label: "Dashboard", href: "/" },
    { label: "Tareas" },
  ],
  "/participantes": [
    { label: "Dashboard", href: "/" },
    { label: "Participantes" },
  ],
  "/observaciones": [
    { label: "Dashboard", href: "/" },
    { label: "Observaciones" },
  ],
  "/hallazgos": [
    { label: "Dashboard", href: "/" },
    { label: "Hallazgos" },
  ],
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  
  // Encontrar la ruta más específica en el mapa
  let items = BREADCRUMB_MAP["/"]
  
  for (const [path, breadcrumbs] of Object.entries(BREADCRUMB_MAP)) {
    if (path !== "/" && pathname.startsWith(path)) {
      items = breadcrumbs
      break
    }
  }

  return (
    <nav 
      className="flex items-center gap-2 text-sm"
      aria-label="Navegación de migas de pan"
    >
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight 
              className="h-4 w-4 text-muted-foreground flex-shrink-0"
              aria-hidden="true"
            />
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-primary hover:underline transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
