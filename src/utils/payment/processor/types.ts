
/**
 * Type definitions for payment processor
 */

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}
