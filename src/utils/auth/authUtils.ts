
/**
 * Authentication utility functions
 */

// Helper function to clear user data from localStorage
export const clearUserData = () => {
  console.log('Clearing user data from localStorage');
  const keys = Object.keys(localStorage);
  const userDataKeys = keys.filter(key => key.startsWith('compliZen_'));
  userDataKeys.forEach(key => {
    localStorage.removeItem(key);
  });
};
