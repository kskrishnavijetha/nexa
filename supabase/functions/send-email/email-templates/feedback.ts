
import { FeedbackDetails } from "../types.ts";

export const createFeedbackEmail = (
  email: string,
  name: string,
  feedbackDetails: FeedbackDetails
) => {
  return {
    from: "NexaBloom <onboarding@resend.dev>",
    to: email, // This should be "contact@nexabloom.xyz" from the invoking function
    subject: "New Feedback from NexaBloom User",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 5px;">
        <h1 style="color: #3b82f6; margin-bottom: 20px;">New Feedback Received</h1>
        
        <div style="margin-bottom: 20px;">
          <p><strong>From:</strong> ${feedbackDetails.userName}</p>
          <p><strong>Email:</strong> ${feedbackDetails.userEmail}</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Feedback Message:</h3>
          <p style="white-space: pre-line;">${feedbackDetails.message}</p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This feedback was submitted through the NexaBloom website.</p>
      </div>
    `,
  };
};
