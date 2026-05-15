/**
 * FORM VALIDATION HOOK
 * Validación en tiempo real
 */

import { useState, useCallback } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export function useFormValidation(rules: Record<string, ValidationRule>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const validate = useCallback((fieldName: string, value: string): string | null => {
    const rule = rules[fieldName];
    if (!rule) return null;

    if (rule.required && !value.trim()) {
      return 'Este campo es requerido';
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `Mínimo ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Máximo ${rule.maxLength} caracteres`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (rule.custom && !rule.custom(value)) {
      return 'Valor no válido';
    }

    return null;
  }, [rules]);

  const handleChange = useCallback((fieldName: string, value: string) => {
    const error = validate(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }));
  }, [validate]);

  const handleBlur = useCallback((fieldName: string) => {
    setTouched(prev => new Set([...prev, fieldName]));
  }, []);

  const validateAll = useCallback((formData: Record<string, string>) => {
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([field, value]) => {
      const error = validate(field, value);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validate]);

  return {
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setErrors
  };
}
