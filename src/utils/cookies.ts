/**
 * Cookie utility functions for managing browser cookies
 */

/**
 * Set a cookie with an expiration time in minutes
 * @param name - Cookie name
 * @param value - Cookie value (will be JSON stringified if object)
 * @param minutes - Expiration time in minutes
 */
export function setCookie(name: string, value: unknown, minutes: number): void {
  const stringValue = typeof value === "string" ? value : JSON.stringify(value);

  if (minutes > 0) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(stringValue)};${expires};path=/`;
  } else {
    // Session cookie - no expires = deleted when browser closes
    document.cookie = `${name}=${encodeURIComponent(stringValue)};path=/`;
  }
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 * @param name - Cookie name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Get a cookie value and parse it as JSON
 * @param name - Cookie name
 * @returns Parsed JSON object or null if not found or parse fails
 */
export function getCookieJSON<T>(name: string): T | null {
  const value = getCookie(name);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Failed to parse cookie "${name}":`, error);
    return null;
  }
}
