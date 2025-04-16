
import { supabase } from '@/integrations/supabase/client';

interface FeedbackData {
  name?: string;
  email?: string;
  message: string;
}

export const sendFeedbackEmail = async (data: FeedbackData): Promise<boolean> => {
  try {
    console.log("Sending feedback email with data:", data);
    
    const { error } = await supabase.functions.invoke("send-email", {
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
    
    console.log("Feedback email sent successfully");
    return true;
  } catch (err) {
    console.error("Exception sending feedback email:", err);
    throw err;
  }
};
