
/**
 * Configuration for PayPal integration
 */

import { PayPalPlanIds } from './types';

// PayPal client ID - Replace with your actual PayPal client ID
export const PAYPAL_CLIENT_ID = 'AXKd2EHw7ySZihlaN06rqnABzzQdhD8ueu738V8iCtC93o8PwlZdjO7hwVITJgTsmjOq8dHJaC1vMMKT';

// PayPal plan IDs - Updated with actual plan IDs for monthly only
export const PAYPAL_PLAN_IDS: PayPalPlanIds = {
  basic: {
    monthly: 'P-0G576384KT1375804M7UPCYY'
  },
  pro: {
    monthly: 'P-0F289070AR785993EM7UO47Y'
  },
  enterprise: {
    monthly: 'P-76C19200WU898035NM7UO5YQ'
  }
};
