"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  ListChecks,
  Eye,
  FileSearch,
  Menu,
  X,
  FlaskConical,
  Users,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Vista general",
  },
  {
    href: "/plan",
    label: "Plan de Prueba",
    icon: ClipboardList,
    description: "Gestión de planes",
  },
  {
    href: "/tareas",
    label: "Tareas y Guion",
    icon: ListChecks,
    description: "Escenarios y scripts",
  },
  {
    href: "/participantes",
    label: "Participantes",
    icon: Users,
    description: "Perfiles de usuarios",
  },
  {
    href: "/observaciones",
    label: "Observaciones",
    icon: Eye,
    description: "Registro en vivo",
  },
  {
    href: "/hallazgos",
    label: "Hallazgos",
    icon: FileSearch,
    description: "Síntesis y análisis",
  },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        role="navigation"
        aria-label="Navegación principal"
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 shadow-xl md:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header - Logo area */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border/50">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 shadow-lg shadow-sidebar-primary/25">
            <FlaskConical className="w-5 h-5 text-sidebar-primary-foreground" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold leading-tight text-sidebar-foreground tracking-tight">UX Testing</p>
            <p className="text-xs text-sidebar-foreground/50 leading-tight">Research Platform</p>
          </div>
          <button
            className="md:hidden text-sidebar-foreground/70 hover:text-sidebar-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring rounded-lg p-1.5 hover:bg-sidebar-accent transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav section label */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Navegación
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto" aria-label="Secciones">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sidebar-ring relative overflow-hidden",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sidebar-primary-foreground rounded-r-full" />
                )}
                
                <div className={cn(
                  "flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0",
                  isActive 
                    ? "bg-sidebar-primary-foreground/20" 
                    : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent"
                )}>
                  <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "truncate font-medium",
                    isActive ? "text-sidebar-primary-foreground" : ""
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-[10px] truncate",
                    isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/40"
                  )}>
                    {item.description}
                  </p>
                </div>

                <ChevronRight className={cn(
                  "w-4 h-4 shrink-0 transition-transform",
                  isActive ? "text-sidebar-primary-foreground/70" : "text-sidebar-foreground/30 group-hover:translate-x-0.5"
                )} />
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-6 py-5 border-t border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-xs font-semibold text-sidebar-accent-foreground">UX</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground/80 truncate">v1.0.0</p>
              <p className="text-[10px] text-sidebar-foreground/40 truncate">UX Research Tool</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-6 py-3 bg-card/80 backdrop-blur-md border-b border-border h-16">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {navItems.find((n) => n.href === pathname)?.label ?? "Dashboard"}
            </span>
          </div>
        </header>

        {/* Page content */}
        {children}
      </div>
    </div>
  )
}
