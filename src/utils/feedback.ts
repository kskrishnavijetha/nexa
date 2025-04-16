
import { supabase } from '@/integrations/supabase/client';

interface FeedbackData {
  name?: string;
  email?: string;
  message: string;
}

export const sendFeedbackEmail = async (data: FeedbackData): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke("send-email", {
      body: {
        type: "feedback",
        email: "contact@nexabloom.xyz",
        name: data.name || "Anonymous User",
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
    
    return true;
  } catch (err) {
    console.error("Exception sending feedback email:", err);
    throw err;
  }
};
