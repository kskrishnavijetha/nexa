
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "welcome" | "payment-confirmation";
  email: string;
  name?: string;
  planDetails?: {
    plan: string;
    billingCycle: string;
    amount: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, planDetails }: EmailRequest = await req.json();
    let emailResponse;

    console.log(`Processing ${type} email for ${email}`);

    // Create welcome email
    if (type === "welcome") {
      emailResponse = await resend.emails.send({
        from: "Nexabloom <onboarding@resend.dev>",
        to: [email],
        subject: "Welcome to Nexabloom!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Welcome to Nexabloom!</h1>
            <p>Hello${name ? ` ${name}` : ""},</p>
            <p>Thank you for signing up with Nexabloom! We're excited to have you on board.</p>
            <p>To get started with our compliance automation platform, please select a subscription plan that suits your needs.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Nexabloom Team</p>
          </div>
        `,
      });
    } 
    // Create payment confirmation email
    else if (type === "payment-confirmation" && planDetails) {
      emailResponse = await resend.emails.send({
        from: "Nexabloom <billing@resend.dev>",
        to: [email],
        subject: "Your Nexabloom Subscription is Active!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Subscription Confirmed!</h1>
            <p>Hello${name ? ` ${name}` : ""},</p>
            <p>Thank you for subscribing to Nexabloom's ${planDetails.plan} plan!</p>
            <p>Your subscription details:</p>
            <ul>
              <li><strong>Plan:</strong> ${planDetails.plan}</li>
              <li><strong>Billing Cycle:</strong> ${planDetails.billingCycle}</li>
              <li><strong>Amount:</strong> $${(planDetails.amount/100).toFixed(2)}</li>
            </ul>
            <p>You now have full access to all features included in your plan. You can access your dashboard to start using Nexabloom's compliance tools right away.</p>
            <p>If you have any questions about your subscription, please contact our support team.</p>
            <p>Best regards,<br>The Nexabloom Team</p>
          </div>
        `,
      });
    } else {
      throw new Error("Invalid email type or missing required data");
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
