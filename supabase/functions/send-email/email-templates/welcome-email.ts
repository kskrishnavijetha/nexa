
/**
 * Welcome email template
 */
export const createWelcomeEmail = (email: string, name?: string, isPro?: boolean, isLifetime?: boolean) => {
  const userType = isPro ? (isLifetime ? 'Lifetime' : 'Pro') : 'Free';
  const displayName = name || email.split('@')[0];
  
  let featuresList = '';
  if (isPro) {
    featuresList = `
      <ul style="padding-left: 20px;">
        <li>✅ Extended audit-ready reports</li>
        <li>✅ Risk simulations</li>
        <li>✅ Smart alerts & audit trails</li>
        ${isLifetime ? '<li>✅ Lifetime access</li>' : ''}
      </ul>
    `;
  }

  return {
    from: "Nexabloom <onboarding@resend.dev>",
    to: [email],
    subject: "Welcome to NexaBloom — Let's Make Compliance Effortless",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4F46E5;">Welcome to NexaBloom!</h1>
        <p>Hello ${displayName},</p>
        <p>Thanks for joining NexaBloom!</p>
        <p>You're now set to automate your compliance journey with instant document analysis, predictive audit simulations, and tamper-proof reports.</p>
        ${isPro ? `
        <div style="background-color: #f8f9fa; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Thanks for joining NexaBloom ${userType}!</h3>
          <p>You now have access to:</p>
          ${featuresList}
          <p>You're audit-ready — let's get to work.</p>
        </div>
        ` : `
        <div style="background-color: #f8f9fa; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Welcome to NexaBloom Free!</h3>
          <p>You can now start with:</p>
          <ul style="padding-left: 20px;">
            <li>✅ 5 document scans per month</li>
            <li>✅ Basic compliance analysis</li>
            <li>✅ GDPR framework coverage</li>
          </ul>
          <p>Ready to get started?</p>
        </div>
        `}
        <p style="margin: 25px 0;">
          <a href="https://nexabloom.xyz/document-analysis" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Your First Scan</a>
        </p>
        <p>NexaBloom is ready to help you analyze, simulate, and generate audit-ready compliance reports — all backed by AI and hash-verified for trust.</p>
        <p>Questions? We're always listening: <a href="mailto:contact@nexabloom.xyz">contact@nexabloom.xyz</a></p>
        <p>Best regards,<br>The Nexabloom Team</p>
      </div>
    `,
  };
};
