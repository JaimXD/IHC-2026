"use client"

import { Check } from "lucide-react"

interface StepperStep {
  id: string
  label: string
  status: "completed" | "current" | "upcoming"
}

interface StepperProps {
  steps: StepperStep[]
  orientation?: "horizontal" | "vertical"
}

export function Stepper({ steps, orientation = "horizontal" }: StepperProps) {
  return (
    <div
      className={`flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} gap-4`}
      role="progressbar"
      aria-valuenow={steps.filter((s) => s.status === "completed").length}
      aria-valuemin={0}
      aria-valuemax={steps.length}
    >
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} items-center ${
            orientation === "horizontal" ? "flex-1" : ""
          } gap-3`}
        >
          {/* Step Circle */}
          <div
            className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
              step.status === "completed"
                ? "border-success bg-success text-white"
                : step.status === "current"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-muted bg-muted text-muted-foreground"
            }`}
          >
            {step.status === "completed" ? (
              <Check className="h-5 w-5" />
            ) : (
              <span className="text-sm">{index + 1}</span>
            )}
          </div>

          {/* Label */}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                step.status === "completed"
                  ? "text-success"
                  : step.status === "current"
                    ? "text-foreground"
                    : "text-muted-foreground"
              }`}
            >
              {step.label}
            </p>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`${
                orientation === "horizontal"
                  ? "absolute left-0 top-5 h-0.5 w-[calc(100%+1rem)]"
                  : "ml-5 h-8 w-0.5"
              } ${
                step.status === "completed" ? "bg-success" : "bg-muted"
              }`}
              style={
                orientation === "horizontal"
                  ? { left: "calc(50% + 1.25rem)" }
                  : undefined
              }
            />
          )}
        </div>
      ))}
    </div>
  )
}
