import { useState, useCallback } from 'react';

export interface FieldState {
  value: any;
  error: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FieldState;
}

export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface FieldRules {
  [key: string]: ValidationRule[];
}

/**
 * Hook for managing form validation state
 * Tracks values, errors, and touched state for each field
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: FieldRules = {}
) {
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    for (const key in initialValues) {
      state[key] = {
        value: initialValues[key],
        error: '',
        touched: false,
      };
    }
    return state;
  });

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName: string, value: any): string => {
      const fieldRules = rules[fieldName];
      if (!fieldRules) return '';

      for (const rule of fieldRules) {
        if (!rule.validate(value)) {
          return rule.message;
        }
      }
      return '';
    },
    [rules]
  );

  /**
   * Set field value and validate
   */
  const setFieldValue = useCallback(
    (fieldName: string, value: any) => {
      const error = validateField(fieldName, value);
      setFormState((prev) => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          value,
          error,
        },
      }));
    },
    [validateField]
  );

  /**
   * Mark field as touched (for showing errors)
   */
  const setFieldTouched = useCallback((fieldName: string, touched = true) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        touched,
      },
    }));
  }, []);

  /**
   * Set field error manually
   */
  const setFieldError = useCallback((fieldName: string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        error,
      },
    }));
  }, []);

  /**
   * Validate all fields
   */
  const validateForm = useCallback((): boolean => {
    let isValid = true;
    const newState = { ...formState };

    for (const fieldName in formState) {
      const error = validateField(fieldName, formState[fieldName].value);
      newState[fieldName] = {
        ...formState[fieldName],
        error,
        touched: true,
      };
      if (error) isValid = false;
    }

    setFormState(newState);
    return isValid;
  }, [formState, validateField]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    const state: FormState = {};
    for (const key in initialValues) {
      state[key] = {
        value: initialValues[key],
        error: '',
        touched: false,
      };
    }
    setFormState(state);
  }, [initialValues]);

  /**
   * Get current form values
   */
  const getValues = useCallback((): T => {
    const values: any = {};
    for (const key in formState) {
      values[key] = formState[key].value;
    }
    return values;
  }, [formState]);

  /**
   * Check if form has any errors
   */
  const hasErrors = useCallback((): boolean => {
    return Object.values(formState).some((field) => field.error !== '');
  }, [formState]);

  /**
   * Check if form is touched
   */
  const isTouched = useCallback((): boolean => {
    return Object.values(formState).some((field) => field.touched);
  }, [formState]);

  return {
    formState,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    validateField,
    validateForm,
    resetForm,
    getValues,
    hasErrors,
    isTouched,
  };
}

/**
 * Common validation rules factory
 */
export const validationRules = {
  required: (message = 'Field ini wajib diisi'): ValidationRule => ({
    validate: (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'number') return !isNaN(value);
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true; // Let 'required' handle empty
      return String(value).length >= min;
    },
    message: message || `Minimal ${min} karakter`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return String(value).length <= max;
    },
    message: message || `Maksimal ${max} karakter`,
  }),

  min: (min: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value && value !== 0) return true;
      return Number(value) >= min;
    },
    message: message || `Minimal ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value && value !== 0) return true;
      return Number(value) <= max;
    },
    message: message || `Maksimal ${max}`,
  }),

  pattern: (regex: RegExp, message = 'Format tidak valid'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(String(value));
    },
    message,
  }),

  email: (message = 'Email tidak valid'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
    },
    message,
  }),

  phone: (message = 'Nomor telepon tidak valid'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const cleaned = String(value).replace(/[\s-]/g, '');
      return /^(08|62)\d{8,12}$/.test(cleaned);
    },
    message,
  }),

  url: (message = 'URL tidak valid'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        const url = new URL(String(value));
        return Boolean(url.protocol && url.host);
      } catch {
        return false;
      }
    },
    message,
  }),

  yearRange: (
    min: number,
    max: number,
    message?: string
  ): ValidationRule => ({
    validate: (value) => {
      if (!value && value !== 0) return true;
      const year = Number(value);
      return year >= min && year <= max;
    },
    message: message || `Tahun harus antara ${min} dan ${max}`,
  }),
};
