
/**
 * Service for handling payment processing
 */

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  expirationDate?: Date;
}

export interface SubscriptionInfo {
  active: boolean;
  plan: string;
  scansUsed: number;
  scansLimit: number;
  expirationDate: Date;
}

// Store the user's current subscription in localStorage
export const saveSubscription = (plan: string, paymentId: string) => {
  const pricingTiers = {
    free: { scans: 1, days: 30 },
    basic: { scans: 10, days: 30 },
    pro: { scans: 50, days: 30 },
    enterprise: { scans: 999, days: 30 }, // Using 999 to represent unlimited
  };
  
  const selectedTier = pricingTiers[plan as keyof typeof pricingTiers];
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + selectedTier.days);
  
  const subscription: SubscriptionInfo = {
    active: true,
    plan: plan,
    scansUsed: 0,
    scansLimit: selectedTier.scans,
    expirationDate: expirationDate
  };
  
  localStorage.setItem('subscription', JSON.stringify(subscription));
  return subscription;
};

// Get the current subscription from localStorage
export const getSubscription = (): SubscriptionInfo | null => {
  const subscription = localStorage.getItem('subscription');
  if (!subscription) {
    return null;
  }
  
  const parsedSubscription = JSON.parse(subscription);
  parsedSubscription.expirationDate = new Date(parsedSubscription.expirationDate);
  
  // Check if subscription is expired
  if (parsedSubscription.expirationDate < new Date()) {
    parsedSubscription.active = false;
  }
  
  return parsedSubscription;
};

// Check if user has an active subscription
export const hasActiveSubscription = (): boolean => {
  const subscription = getSubscription();
  return !!subscription && subscription.active;
};

// Check if user has scans remaining
export const hasScansRemaining = (): boolean => {
  const subscription = getSubscription();
  return !!subscription && subscription.active && subscription.scansUsed < subscription.scansLimit;
};

// Record a scan usage
export const recordScanUsage = (): void => {
  const subscription = getSubscription();
  if (subscription && subscription.active) {
    subscription.scansUsed += 1;
    localStorage.setItem('subscription', JSON.stringify(subscription));
  }
};

/**
 * Process a one-time payment
 */
export const processOneTimePayment = async (
  paymentMethodId: string,
  amount: number
): Promise<PaymentResult> => {
  // This is a mock implementation. In a real app, you would call your backend.
  try {
    // Free tier doesn't need payment processing
    if (amount === 0) {
      return {
        success: true,
        paymentId: 'free_' + Math.random().toString(36).substring(2, 15)
      };
    }
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful payment ~90% of the time
    if (Math.random() > 0.1) {
      return {
        success: true,
        paymentId: 'pi_' + Math.random().toString(36).substring(2, 15)
      };
    } else {
      return {
        success: false,
        error: 'Payment declined. Please try a different payment method.'
      };
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while processing your payment.'
    };
  }
};

/**
 * Create a subscription
 */
export const createSubscription = async (
  paymentMethodId: string,
  priceId: string
): Promise<PaymentResult> => {
  // This is a mock implementation. In a real app, you would call your backend.
  try {
    // Free tier doesn't need subscription processing
    if (priceId === 'price_free') {
      const paymentId = 'free_sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the free subscription
      saveSubscription('free', paymentId);
      
      return {
        success: true,
        paymentId: paymentId
      };
    }
    
    // Extract plan name from priceId (e.g., price_basic -> basic)
    const planName = priceId.split('_')[1];
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful subscription creation ~90% of the time
    if (Math.random() > 0.1) {
      const paymentId = 'sub_' + Math.random().toString(36).substring(2, 15);
      
      // Save the subscription
      saveSubscription(planName, paymentId);
      
      return {
        success: true,
        paymentId: paymentId
      };
    } else {
      return {
        success: false,
        error: 'Unable to create subscription. Please try again.'
      };
    }
  } catch (error) {
    console.error('Subscription creation error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred while creating your subscription.'
    };
  }
};

/**
 * Fetch customer payment methods (for returning customers)
 */
export const fetchPaymentMethods = async (): Promise<any[]> => {
  // Mock implementation - would fetch from your backend in a real app
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return empty array for new customers or mock data for testing
  return [];
};
