
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
    
    // Prepare the request body with all required fields
    const requestBody = {
      type: "feedback",
      email: "contact@nexabloom.xyz", // This is the recipient email
      name: "NexaBloom Feedback System",
      feedbackDetails: {
        userName: data.name || "Anonymous User",
        userEmail: data.email || "Not provided",
        message: data.message.trim()
      }
    };
    
    console.log("Invoking send-email function with body:", requestBody);
    
    const { error, data: responseData } = await supabase.functions.invoke("send-email", {
      body: requestBody
    });
    
    if (error) {
      console.error("Error invoking send-email function:", error);
      return false;
    }
    
    // Check response for indicators of success
    if (responseData && responseData.error) {
      console.error("Resend API error:", responseData.error);
      return false;
    }
    
    // If there's no obvious error, we'll consider it a success for now
    // and let the UI show a fallback message if needed
    console.log("Feedback email sent successfully with response:", responseData);
    return true;
  } catch (err) {
    console.error("Exception sending feedback email:", err);
    return false;
  }
};
