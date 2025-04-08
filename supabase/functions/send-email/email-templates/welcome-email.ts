
/**
 * Welcome email template
 */
export const createWelcomeEmail = (email: string, name?: string) => {
  return {
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
  };
};
