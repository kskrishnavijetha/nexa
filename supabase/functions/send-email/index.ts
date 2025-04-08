
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { EmailRequest, corsHeaders } from "./types.ts";
import { createWelcomeEmail } from "./email-templates/welcome-email.ts";
import { createPaymentConfirmationEmail } from "./email-templates/payment-confirmation.ts";
import { createComplianceReportEmail } from "./email-templates/compliance-report.ts";
import { createScanNotificationEmail } from "./email-templates/scan-notification.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, planDetails, reportDetails, scanDetails }: EmailRequest = await req.json();
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
        
      default:
        throw new Error("Invalid email type");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
