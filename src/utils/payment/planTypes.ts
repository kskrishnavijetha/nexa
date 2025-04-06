
/**
 * Shared type definitions for subscription plans
 */

// Define the valid plan names
export type PlanName = 'free' | 'basic' | 'pro' | 'enterprise';

// Helper function to validate plan name
export const isValidPlanName = (plan: string): plan is PlanName => {
  return ['free', 'basic', 'pro', 'enterprise'].includes(plan);
};

