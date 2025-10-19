import { useState, useEffect } from 'react';

/**
 * Custom hook to track media query matches
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQuery.matches);

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// Predefined breakpoint hooks
// Note: lg breakpoint is 1024px in Tailwind, so useIsMobile should match screens < lg
export const useIsMobile = () => useMediaQuery('(max-width: 1023px)');
export const useIsTablet = () => useMediaQuery('(min-width: 641px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1440px)');
