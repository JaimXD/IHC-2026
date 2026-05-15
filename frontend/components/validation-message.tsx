"use client"

import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react"

type ValidationLevel = "success" | "error" | "warning" | "info"

interface ValidationMessageProps {
  level: ValidationLevel
  message: string
  details?: string[]
  onDismiss?: () => void
}

const VALIDATION_CONFIG: Record<ValidationLevel, {
  bgColor: string
  borderColor: string
  textColor: string
  icon: React.ReactNode
  title: string
}> = {
  success: {
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
    textColor: "text-success",
    icon: <CheckCircle2 className="h-5 w-5" />,
    title: "Éxito",
  },
  error: {
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
    textColor: "text-destructive",
    icon: <AlertCircle className="h-5 w-5" />,
    title: "Error",
  },
  warning: {
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    textColor: "text-warning-foreground",
    icon: <AlertTriangle className="h-5 w-5" />,
    title: "Advertencia",
  },
  info: {
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
    textColor: "text-info",
    icon: <Info className="h-5 w-5" />,
    title: "Información",
  },
}

export function ValidationMessage({
  level,
  message,
  details,
  onDismiss,
}: ValidationMessageProps) {
  const config = VALIDATION_CONFIG[level]

  return (
    <div
      className={`rounded-lg border ${config.bgColor} ${config.borderColor} p-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={config.textColor}>{config.icon}</div>
        <div className="flex-1">
          <p className={`font-semibold ${config.textColor}`}>{message}</p>
          {details && (
            <ul className="mt-2 text-sm text-muted-foreground space-y-1 ml-2">
              {details.map((detail, i) => (
                <li key={i} className="list-disc">
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors mt-1"
            aria-label="Cerrar mensaje"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function FormValidationError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-destructive text-sm mt-1">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export function FieldValidationIndicator({
  isValid,
  isDirty,
  message,
}: {
  isValid: boolean
  isDirty: boolean
  message?: string
}) {
  if (!isDirty) return null

  return (
    <div className={`flex items-center gap-2 text-sm mt-1 ${isValid ? "text-success" : "text-destructive"}`}>
      {isValid ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      {message && <span>{message}</span>}
    </div>
  )
}
