
/**
 * Authentication utility functions
 */

/**
 * Clear all user-specific data from localStorage
 */
export const clearUserData = () => {
  console.log('clearUserData - Clearing user data from localStorage');
  
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      console.log('clearUserData - Removing key:', key);
      localStorage.removeItem(key);
    }
  });
  
  // Clear any other user-specific data
  localStorage.removeItem('user_subscription');
  localStorage.removeItem('slack_token');
  
  console.log('clearUserData - User data cleared');
};
