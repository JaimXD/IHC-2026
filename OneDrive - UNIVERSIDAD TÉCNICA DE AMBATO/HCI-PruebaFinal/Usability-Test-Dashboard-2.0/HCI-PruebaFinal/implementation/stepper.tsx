/**
 * STEPPER - Navegación por Pasos
 * Mejora UX: Navegación visual clara
 */

'use client';

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick
}: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Círculo del paso */}
            <button
              onClick={() => onStepClick(index)}
              className={`
                w-10 h-10 rounded-full font-semibold transition-all
                flex items-center justify-center cursor-pointer
                ${index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-300 text-gray-600'
                }
              `}
            >
              {index < currentStep ? '✓' : index + 1}
            </button>

            {/* Línea conectora */}
            {index < steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 transition-all
                  ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
          </div>
        ))}
      </div>

      {/* Etiquetas de los pasos */}
      <div className="flex justify-between mt-4 text-xs text-gray-600">
        {steps.map((step, index) => (
          <span key={index} className="text-center flex-1">
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
