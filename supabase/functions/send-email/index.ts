
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { EmailRequest, corsHeaders } from "./types.ts";
import { createWelcomeEmail } from "./email-templates/welcome-email.ts";
import { createPaymentConfirmationEmail } from "./email-templates/payment-confirmation.ts";
import { createComplianceReportEmail } from "./email-templates/compliance-report.ts";
import { createScanNotificationEmail } from "./email-templates/scan-notification.ts";
import { createFeedbackEmail } from "./email-templates/feedback.ts";

// Initialize Resend with the API key
const apiKey = Deno.env.get("RESEND_API_KEY");
if (!apiKey) {
  console.error("RESEND_API_KEY is not set in environment variables");
}

const resend = new Resend(apiKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log the API key status (without revealing the key)
    console.log("API key status:", apiKey ? "API key is set" : "API key is NOT set");
    
    const body = await req.json();
    console.log("Request body received:", JSON.stringify(body));
    
    const { type, email, name, planDetails, reportDetails, scanDetails, feedbackDetails }: EmailRequest = body;
    let emailResponse;

    console.log(`Processing ${type} email for ${email}`);

    // Create and send appropriate email based on type
    switch (type) {
      case "welcome":
        emailResponse = await resend.emails.send(createWelcomeEmail(email, name));
        break;
        
      case "payment-confirmation":
        if (!planDetails) {
          throw new Error("Missing plan details for payment confirmation email");
        }
        emailResponse = await resend.emails.send(
          createPaymentConfirmationEmail(email, name, planDetails)
        );
        break;
        
      case "compliance-report":
        if (!reportDetails) {
          throw new Error("Missing report details for compliance report email");
        }
        emailResponse = await resend.emails.send(
          createComplianceReportEmail(email, name, reportDetails)
        );
        break;
        
      case "scan-notification":
        if (!scanDetails) {
          throw new Error("Missing scan details for scan notification email");
        }
        emailResponse = await resend.emails.send(
          createScanNotificationEmail(email, name, scanDetails)
        );
        break;
        
      case "feedback":
        if (!feedbackDetails) {
          throw new Error("Missing feedback details for feedback email");
        }
        console.log("Sending feedback email to:", email, "with details:", JSON.stringify(feedbackDetails));
        
        try {
          // Sanitize inputs before sending
          const sanitizedFeedback = {
            ...feedbackDetails,
            message: feedbackDetails.message || "No message provided",
            userName: feedbackDetails.userName || "Anonymous User",
            userEmail: feedbackDetails.userEmail || "No email provided"
          };
          
          const emailTemplate = createFeedbackEmail(email, name, sanitizedFeedback);
          console.log("Email template prepared:", JSON.stringify(emailTemplate));
          
          emailResponse = await resend.emails.send(emailTemplate);
          console.log("Feedback email response:", JSON.stringify(emailResponse));
        } catch (emailError) {
          console.error("Error in sending email with Resend:", emailError);
          throw emailError;
        }
        break;
        
      default:
        throw new Error(`Invalid email type: ${type}`);
    }

    console.log("Email sent successfully:", JSON.stringify(emailResponse));

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    console.error("Error details:", error.message);
    if (error.response) {
      console.error("Error response:", JSON.stringify(error.response));
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.response || "No additional details"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
