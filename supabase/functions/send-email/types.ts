
/**
 * Types for email requests and templates
 */
import { PlanDetails } from './email-templates/payment-confirmation';
import { ReportDetails } from './email-templates/compliance-report';
import { ScanDetails } from './email-templates/scan-notification';

export interface FeedbackDetails {
  userName: string;
  userEmail: string;
  message: string;
}

export interface EmailRequest {
  type: "welcome" | "payment-confirmation" | "compliance-report" | "scan-notification" | "feedback";
  email: string;
  name?: string;
  planDetails?: PlanDetails;
  reportDetails?: ReportDetails;
  scanDetails?: ScanDetails;
  feedbackDetails?: FeedbackDetails;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};
