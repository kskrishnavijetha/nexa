
/**
 * Authentication utility functions
 */

// Helper function to clear user data from localStorage
export const clearUserData = () => {
  console.log('Clearing user data from localStorage');
  
  // Clear subscription data
  localStorage.removeItem('subscription');
  
  // Clear redirect paths
  sessionStorage.removeItem('redirectAfterLogin');
  sessionStorage.removeItem('redirectAfterSuccessfulPayment');
  
  // Clear any other user-specific data with the compliZen_ prefix
  const keys = Object.keys(localStorage);
  const userDataKeys = keys.filter(key => key.startsWith('compliZen_'));
  userDataKeys.forEach(key => {
    localStorage.removeItem(key);
  });
};
