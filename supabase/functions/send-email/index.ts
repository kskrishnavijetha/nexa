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
  type: "welcome" | "payment-confirmation" | "compliance-report" | "scan-notification";
  email: string;
  name?: string;
  planDetails?: {
    plan: string;
    billingCycle: string;
    amount: number;
  };
  reportDetails?: {
    documentName: string;
    complianceScore: number;
    risks: number;
    date: string;
    reportLink?: string;
    industry?: string;
    regulations?: string[];
  };
  scanDetails?: {
    documentName: string;
    scanTime: string;
    scheduledBy: string;
    itemsScanned: number;
    violationsFound: number;
    industry?: string;
    region?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, email, name, planDetails, reportDetails, scanDetails }: EmailRequest = await req.json();
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
    }
    // Send compliance report email
    else if (type === "compliance-report" && reportDetails) {
      // Generate color based on compliance score
      const scoreColor = 
        reportDetails.complianceScore >= 80 ? "#22c55e" : 
        reportDetails.complianceScore >= 60 ? "#f59e0b" : "#ef4444";
      
      // Get user's display name or use their email
      const displayName = name ? name.includes('@') ? name.split('@')[0] : name : '';
      
      emailResponse = await resend.emails.send({
        from: "Nexabloom <reports@resend.dev>",
        to: [email],
        subject: `Compliance Report: ${reportDetails.documentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Compliance Report</h1>
            <p>Hello${displayName ? ` ${displayName}` : ""},</p>
            <p>Your requested compliance report for <strong>${reportDetails.documentName}</strong> is ready.</p>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #0f172a;">Report Summary</h2>
              <p><strong>Document:</strong> ${reportDetails.documentName}</p>
              <p><strong>Date Generated:</strong> ${reportDetails.date}</p>
              ${reportDetails.industry ? `<p><strong>Industry:</strong> ${reportDetails.industry}</p>` : ''}
              <p><strong>Compliance Score:</strong> <span style="font-weight: bold; color: ${scoreColor};">${reportDetails.complianceScore}%</span></p>
              <p><strong>Risks Identified:</strong> ${reportDetails.risks}</p>
              ${reportDetails.regulations ? 
                `<p><strong>Applicable Regulations:</strong> ${reportDetails.regulations.join(', ')}</p>` : 
                ''}
            </div>
            
            <p>This report contains a detailed analysis of your document's compliance status and identified risks.</p>
            
            ${reportDetails.reportLink ? 
              `<p style="margin: 20px 0;"><a href="${reportDetails.reportLink}" style="background-color: #4F46E5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Full Report</a></p>` : 
              ''}
            
            <p>For any questions regarding this report or for assistance in improving your compliance score, please contact our support team.</p>
            <p>Best regards,<br>The Nexabloom Team</p>
          </div>
        `,
      });
    }
    // Send scan notification email
    else if (type === "scan-notification" && scanDetails) {
      // Generate severity color based on violations found
      const severityColor = 
        scanDetails.violationsFound === 0 ? "#22c55e" : 
        scanDetails.violationsFound <= 3 ? "#f59e0b" : "#ef4444";
      
      // Get user's display name or use their email
      const displayName = name ? name.includes('@') ? name.split('@')[0] : name : '';
      
      emailResponse = await resend.emails.send({
        from: "Nexabloom <scans@resend.dev>",
        to: [email],
        subject: `Automated Scan Completed: ${scanDetails.documentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #4F46E5;">Automated Scan Completed</h1>
            <p>Hello${displayName ? ` ${displayName}` : ""},</p>
            <p>Your scheduled automated scan for <strong>${scanDetails.documentName}</strong> has completed.</p>
            
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #0f172a;">Scan Summary</h2>
              <p><strong>Document:</strong> ${scanDetails.documentName}</p>
              <p><strong>Scan Time:</strong> ${scanDetails.scanTime}</p>
              <p><strong>Scheduled By:</strong> ${scanDetails.scheduledBy}</p>
              ${scanDetails.industry ? `<p><strong>Industry:</strong> ${scanDetails.industry}</p>` : ''}
              ${scanDetails.region ? `<p><strong>Region:</strong> ${scanDetails.region}</p>` : ''}
              <p><strong>Items Scanned:</strong> ${scanDetails.itemsScanned}</p>
              <p><strong>Violations Found:</strong> <span style="font-weight: bold; color: ${severityColor};">${scanDetails.violationsFound}</span></p>
            </div>
            
            <p>Login to your Nexabloom account to view the full scan results and take action on any compliance issues.</p>
            
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
