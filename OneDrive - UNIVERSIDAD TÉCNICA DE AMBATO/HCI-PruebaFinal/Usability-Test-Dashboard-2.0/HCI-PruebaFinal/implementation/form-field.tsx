/**
 * FORM FIELD - Campos Mejorados
 * Resuelve: Problema 5 (Campos no diferenciados)
 */

'use client';

import { useState } from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormField({
  label,
  name,
  type = 'text',
  required = false,
  error,
  placeholder,
  value,
  onChange
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {required && <span className="text-xs text-gray-500 ml-1">(Requerido)</span>}
      </label>
      
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg transition-colors
          ${error 
            ? 'border-red-500 bg-red-50 focus:ring-red-500' 
            : 'border-gray-300 focus:ring-blue-500'
          } focus:outline-none focus:ring-2`}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
          <span>❌</span> {error}
        </p>
      )}
    </div>
  );
}
