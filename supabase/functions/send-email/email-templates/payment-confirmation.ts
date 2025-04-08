
/**
 * Payment confirmation email template
 */
export interface PlanDetails {
  plan: string;
  billingCycle: string;
  amount: number;
}

export const createPaymentConfirmationEmail = (email: string, name: string | undefined, planDetails: PlanDetails) => {
  return {
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
  };
};
