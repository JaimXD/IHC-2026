/**
 * VALIDATION MESSAGE - Mensajes Dinámicos
 * Resuelve: Problema 6 (Mensajes error genéricos)
 */

'use client';

import { useEffect, useState } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface ValidationMessageProps {
  type: AlertType;
  message: string;
  title: string;
  duration?: number;
}

const typeConfig = {
  success: { icon: '✅', bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-900' },
  error: { icon: '❌', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-900' },
  warning: { icon: '⚠️', bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-900' },
  info: { icon: 'ℹ️', bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-900' }
};

export function ValidationMessage({
  type,
  message,
  title,
  duration = 5000
}: ValidationMessageProps) {
  const [visible, setVisible] = useState(true);
  const config = typeConfig[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`${config.bg} border-l-4 ${config.border} p-4 mb-4 rounded-lg flex gap-3`}>
      <span className="text-2xl">{config.icon}</span>
      <div className="flex-1">
        <h3 className={`font-semibold ${config.text}`}>{title}</h3>
        <p className={`text-sm ${config.text}`}>{message}</p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className={`${config.text} hover:opacity-70 text-lg`}
      >
        ✕
      </button>
    </div>
  );
}
