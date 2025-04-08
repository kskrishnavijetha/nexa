
/**
 * Utility functions for schedule notifications
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Send scheduled email notification
 * @param schedule Schedule configuration
 * @returns Promise resolving to boolean indicating success
 */
export const sendScheduledEmailNotification = async (schedule: any): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("send-email", {
      body: {
        type: "scan-notification",
        email: schedule.email,
        name: schedule.scheduledBy,
        scanDetails: {
          documentName: schedule.documentName,
          scanTime: new Date().toISOString(),
          scheduledBy: schedule.scheduledBy,
          itemsScanned: Math.floor(Math.random() * 50) + 10,
          violationsFound: Math.floor(Math.random() * 8),
          industry: schedule.industry,
          region: schedule.region
        }
      }
    });
    
    if (error) {
      console.error("Error sending notification email:", error);
      return false;
    }
    
    console.log("Notification email sent successfully:", data);
    return true;
  } catch (err) {
    console.error("Exception sending notification email:", err);
    return false;
  }
};
