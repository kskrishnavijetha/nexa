
import { useEffect, useState } from 'react';

/**
 * Hook to detect system color scheme preference
 * @returns boolean True if system prefers dark mode
 */
export const useThemeDetector = (): boolean => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check if window is defined (for SSR)
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Skip if window is not defined
    if (typeof window === 'undefined') return;

    // Create media query list
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Define change handler
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    // Add event listener for theme changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isDarkMode;
};
