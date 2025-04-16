
import { supabase } from '@/integrations/supabase/client';

interface FeedbackData {
  name?: string;
  email?: string;
  message: string;
}

export const sendFeedbackEmail = async (data: FeedbackData): Promise<boolean> => {
  try {
    console.log("Sending feedback email with data:", data);
    
    // Check if message is valid
    if (!data.message || data.message.trim() === '') {
      console.error("Cannot send feedback with empty message");
      return false;
    }
    
    const { error, data: responseData } = await supabase.functions.invoke("send-email", {
      body: {
        type: "feedback",
        email: "contact@nexabloom.xyz", // This is the recipient email
        name: "NexaBloom Feedback System",
        feedbackDetails: {
          userName: data.name || "Anonymous User",
          userEmail: data.email || "Not provided",
          message: data.message
        }
      }
    });
    
    if (error) {
      console.error("Error sending feedback email:", error);
      return false;
    }
    
    // Check if response has an error property (from Resend)
    if (responseData && responseData.error) {
      console.error("Resend API error:", responseData.error);
      return false;
    }
    
    console.log("Feedback email sent successfully with response:", responseData);
    return true;
  } catch (err) {
    console.error("Exception sending feedback email:", err);
    return false; // Changed from throw to return false for consistent error handling
  }
};
