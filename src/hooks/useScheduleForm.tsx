
import { useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { ScheduleFormValues } from '@/components/schedule/ScheduleFormSchema';
import { saveSchedule } from '@/utils/schedule/scheduleStorage';
import { registerScheduleWorker } from '@/utils/schedule/scheduleWorker';
import { sendScheduledEmailNotification } from '@/utils/schedule/scheduleNotification';

interface UseScheduleFormProps {
  documentId: string;
  industry?: string;
  userEmail?: string;
  form: UseFormReturn<ScheduleFormValues>;
}

export const useScheduleForm = ({ 
  documentId, 
  industry, 
  userEmail,
  form 
}: UseScheduleFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (data: ScheduleFormValues) => {
    if (!data.enabled) {
      toast.info("Automated scans are disabled", {
        description: "Enable scans to schedule compliance checks",
      });
      
      const schedule = {
        ...data,
        documentId,
        industry,
        scheduledBy: userEmail || 'anonymous',
        createdAt: new Date().toISOString(),
      };
      
      saveSchedule(schedule);
      return;
    }
    
    if (!data.email) {
      form.setError("email", { 
        type: "manual", 
        message: "Email is required for notifications" 
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const schedule = {
        ...data,
        documentId,
        industry,
        scheduledBy: userEmail || 'anonymous',
        createdAt: new Date().toISOString(),
      };
      
      saveSchedule(schedule);
      
      registerScheduleWorker(schedule);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const emailSent = await sendScheduledEmailNotification(schedule);
      
      if (emailSent) {
        toast.success(`Automated scans scheduled ${data.frequency}`, {
          description: `We'll send reports to ${data.email}`,
        });
      } else {
        toast.error("Failed to send test notification");
      }
      
      form.reset(data);
    } catch (error) {
      toast.error("Failed to schedule automated scan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    onSubmit
  };
};
