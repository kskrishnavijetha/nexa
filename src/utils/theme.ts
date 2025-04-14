
/**
 * Set up the theme based on system preference or user settings
 * @param isDarkMode Whether dark mode is enabled
 */
export const setupTheme = (isDarkMode: boolean): void => {
  // Apply dark mode class to document if needed
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Set meta theme color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDarkMode ? '#1a1a1a' : '#ffffff');
  }
};
