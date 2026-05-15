/**
 * PROGRESS BAR - Barra de Progreso
 * Resuelve: Problema 10 (Sin feedback visual en exportación)
 */

'use client';

interface ProgressBarProps {
  progress: number;
  status: 'loading' | 'completed' | 'error';
  label?: string;
}

const statusConfig = {
  loading: { icon: '⏳', color: 'bg-blue-500' },
  completed: { icon: '✅', color: 'bg-green-500' },
  error: { icon: '❌', color: 'bg-red-500' }
};

export function ProgressBar({
  progress,
  status,
  label
}: ProgressBarProps) {
  const config = statusConfig[status];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label || 'Procesando...'}</span>
        <span className="text-2xl">{config.icon}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${config.color} h-full rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>{progress}%</span>
        <span>Tiempo: {Math.ceil((100 - progress) * 0.5)} seg</span>
      </div>
    </div>
  );
}
