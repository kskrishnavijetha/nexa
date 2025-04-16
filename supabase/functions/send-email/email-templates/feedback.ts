
import { FeedbackDetails } from "../types.ts";

export const createFeedbackEmail = (
  email: string,
  name: string,
  feedbackDetails: FeedbackDetails
) => {
  console.log(`Creating feedback email template to: ${email} with name: ${name}`);
  
  // Ensure we have defaults for all fields to prevent errors
  const userName = feedbackDetails.userName || "Anonymous User";
  const userEmail = feedbackDetails.userEmail || "No email provided";
  const message = feedbackDetails.message || "No message content";
  
  return {
    from: "NexaBloom <onboarding@resend.dev>",
    to: email, // This should be "contact@nexabloom.xyz" from the invoking function
    subject: "New Feedback from NexaBloom User",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Feedback</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 5px;">
          <h1 style="color: #3b82f6; margin-bottom: 20px;">New Feedback Received</h1>
          
          <div style="margin-bottom: 20px;">
            <p><strong>From:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">Feedback Message:</h3>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This feedback was submitted through the NexaBloom website.</p>
        </div>
      </body>
      </html>
    `,
    text: `
New Feedback Received

From: ${userName}
Email: ${userEmail}

Feedback Message:
${message}

This feedback was submitted through the NexaBloom website.
    `,
  };
};
