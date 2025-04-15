
/**
 * Service for managing payment methods
 */

/**
 * Fetch customer payment methods (for returning customers)
 */
export const fetchPaymentMethods = async (): Promise<any[]> => {
  // Mock implementation - would fetch from your backend in a real app
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return empty array for new customers or mock data for testing
  return [];
};
