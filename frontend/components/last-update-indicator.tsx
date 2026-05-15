"use client"

import { useEffect, useState } from "react"
import { RotateCw, CheckCircle2 } from "lucide-react"

interface LastUpdateIndicatorProps {
  lastUpdateTime?: Date | null
  isRefreshing?: boolean
  onRefresh?: () => void
}

export function LastUpdateIndicator({
  lastUpdateTime,
  isRefreshing = false,
  onRefresh,
}: LastUpdateIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("Hace poco")

  useEffect(() => {
    if (!lastUpdateTime) return

    const updateTimeAgo = () => {
      const now = new Date()
      const diff = now.getTime() - lastUpdateTime.getTime()
      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)

      if (minutes === 0) {
        setTimeAgo(`Hace ${seconds}s`)
      } else if (minutes === 1) {
        setTimeAgo("Hace 1 min")
      } else if (minutes < 60) {
        setTimeAgo(`Hace ${minutes} min`)
      } else {
        const hours = Math.floor(minutes / 60)
        setTimeAgo(`Hace ${hours}h`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 10000) // Actualizar cada 10 segundos

    return () => clearInterval(interval)
  }, [lastUpdateTime])

  return (
    <div className="flex items-center gap-2 text-xs">
      {isRefreshing ? (
        <>
          <RotateCw className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
          <span className="text-muted-foreground">Actualizando...</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-success" />
          <span className="text-muted-foreground">
            Actualizado {timeAgo}
          </span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="ml-2 text-primary hover:text-primary/80 transition-colors"
              title="Refrescar datos manualmente"
              aria-label="Refrescar datos"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          )}
        </>
      )}
    </div>
  )
}
