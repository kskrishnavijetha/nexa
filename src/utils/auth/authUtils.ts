
/**
 * Authentication utility functions
 */

// Helper function to clear user data from localStorage
export const clearUserData = () => {
  console.log('Clearing user data from localStorage');
  
  // Clear auth tokens
  localStorage.removeItem('sb-sbsnnlhjhlifoqrvoixb-auth-token');
  
  // Don't clear subscription data as we want to keep it across sessions
  // Just clear other user-specific non-subscription data
  
  // Clear redirect paths
  sessionStorage.removeItem('redirectAfterLogin');
  sessionStorage.removeItem('redirectAfterSuccessfulPayment');
  
  // Clear any other user-specific data with the compliZen_ prefix
  const keys = Object.keys(localStorage);
  const userDataKeys = keys.filter(key => 
    key.startsWith('compliZen_') && 
    !key.startsWith('subscription_') // Don't clear subscription data
  );
  
  userDataKeys.forEach(key => {
    localStorage.removeItem(key);
  });
};
