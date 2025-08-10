
export const clearUserData = () => {
  // Clear any user-specific data from localStorage
  console.log('Clearing user data from localStorage');
  
  // Clear any keys that might store user-specific data
  const keysToRemove = ['subscription', 'user_preferences', 'audit_data'];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // You can add more specific cleanup logic here if needed
};
