/**
 * Validation utility functions
 */

export const validators = {
  /**
   * Check if a value is a valid URL
   */
  isUrl(value: string): boolean {
    if (!value || !value.trim()) return false;
    try {
      const url = new URL(value);
      return Boolean(url.protocol && url.host);
    } catch {
      return false;
    }
  },

  /**
   * Check if a value is empty (null, undefined, empty string, empty array)
   */
  isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  },

  /**
   * Check if a string is a valid phone number (Indonesian format)
   */
  isValidPhone(phone: string): boolean {
    // Indonesian phone: 08xx-xxxx-xxxx or 62xx-xxxx-xxxx
    const phoneRegex = /^(08|62)\d{8,12}$/;
    const cleaned = phone.replace(/[\s-]/g, '');
    return phoneRegex.test(cleaned);
  },

  /**
   * Check if string contains only numbers
   */
  isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  },

  /**
   * Check if value is a valid year (between 1900 and current year + 10)
   */
  isValidYear(year: number): boolean {
    const currentYear = new Date().getFullYear();
    return year >= 1900 && year <= currentYear + 10;
  },

  /**
   * Check if a string has minimum length
   */
  minLength(value: string, min: number): boolean {
    return value.trim().length >= min;
  },

  /**
   * Check if a string has maximum length
   */
  maxLength(value: string, max: number): boolean {
    return value.trim().length <= max;
  },

  /**
   * Check if a number is within a range
   */
  inRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },
};

/**
 * Form validation helper
 */
export interface ValidationRule<T = string> {
  validator: (value: T) => boolean;
  message: string;
}

export function validate<T = string>(
  value: T,
  rules: ValidationRule<T>[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const rule of rules) {
    if (!rule.validator(value)) {
      errors.push(rule.message);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Common validation rules factory
 */
export const rules = {
  required: (message = 'Field ini wajib diisi'): ValidationRule => ({
    validator: (value: string) => !validators.isEmpty(value),
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validator: (value: string) => validators.minLength(value, min),
    message: message || `Minimal ${min} karakter`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validator: (value: string) => validators.maxLength(value, max),
    message: message || `Maksimal ${max} karakter`,
  }),

  phone: (message = 'Nomor telepon tidak valid'): ValidationRule => ({
    validator: (value: string) => validators.isValidPhone(value),
    message,
  }),

  url: (message = 'URL tidak valid'): ValidationRule => ({
    validator: (value: string) => validators.isUrl(value),
    message,
  }),

  numeric: (message = 'Hanya boleh berisi angka'): ValidationRule => ({
    validator: (value: string) => validators.isNumeric(value),
    message,
  }),
};
