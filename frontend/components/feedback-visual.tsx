"use client"

import { CheckCircle2, AlertCircle, Loader } from "lucide-react"
import { useEffect, useState } from "react"

type FeedbackType = "loading" | "success" | "error"

interface FeedbackBadgeProps {
  type: FeedbackType
  message: string
  autoDismissMs?: number
  onDismiss?: () => void
}

export function FeedbackBadge({
  type,
  message,
  autoDismissMs,
  onDismiss,
}: FeedbackBadgeProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!autoDismissMs || type === "loading") return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, autoDismissMs)

    return () => clearTimeout(timer)
  }, [autoDismissMs, type, onDismiss])

  if (!isVisible) return null

  const config = {
    loading: {
      bg: "bg-info/10",
      text: "text-info",
      icon: <Loader className="h-4 w-4 animate-spin" />,
    },
    success: {
      bg: "bg-success/10",
      text: "text-success",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    error: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      icon: <AlertCircle className="h-4 w-4" />,
    },
  }

  const current = config[type]

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full ${current.bg} ${current.text} px-4 py-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-300`}
      role="status"
    >
      {current.icon}
      <span>{message}</span>
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = "Cargando..." }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="rounded-lg bg-card p-6 shadow-lg flex items-center gap-3">
        <Loader className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  variant?: "success" | "warning" | "info"
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  variant = "info",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantConfig = {
    success: "bg-success",
    warning: "bg-warning",
    info: "bg-info",
  }

  return (
    <div className="space-y-2">
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${variantConfig[variant]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  )
}
