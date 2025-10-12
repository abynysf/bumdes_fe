/**
 * Formatting utility functions
 */

/**
 * Format number as Indonesian Rupiah currency
 */
export function formatCurrency(value: number | string, options?: {
  withSymbol?: boolean;
  withDecimal?: boolean;
}): string {
  const { withSymbol = true, withDecimal = false } = options || {};
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '-';

  const formatted = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: withDecimal ? 2 : 0,
    maximumFractionDigits: withDecimal ? 2 : 0,
  }).format(numValue);

  return withSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Format phone number to Indonesian format
 * Example: 081234567890 -> 0812-3456-7890
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10) return phone;

  // Format: 08XX-XXXX-XXXX
  if (cleaned.startsWith('08')) {
    return cleaned.replace(/^(\d{4})(\d{4})(\d{4})$/, '$1-$2-$3');
  }

  // Format: 62XXX-XXXX-XXXX
  if (cleaned.startsWith('62')) {
    return cleaned.replace(/^(\d{2})(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3-$4');
  }

  return phone;
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '-';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(dateObj);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '-';
  return new Intl.NumberFormat('id-ID').format(numValue);
}

/**
 * Parse formatted number string back to number
 */
export function parseFormattedNumber(formatted: string): number {
  return parseFloat(formatted.replace(/\./g, '').replace(',', '.'));
}

/**
 * Mask sensitive information (e.g., account numbers)
 * Example: 1234567890 -> 123***7890
 */
export function maskString(str: string, visibleStart = 3, visibleEnd = 4, maskChar = '*'): string {
  if (str.length <= visibleStart + visibleEnd) return str;

  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  const masked = maskChar.repeat(3);

  return `${start}${masked}${end}`;
}
