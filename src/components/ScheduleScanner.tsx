import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleFormSchema, ScheduleFormValues } from './schedule/ScheduleFormSchema';
import ScheduleToggle from './schedule/ScheduleToggle';
import FrequencySelector from './schedule/FrequencySelector';
import TimeSelector from './schedule/TimeSelector';
import DocumentNameInput from './schedule/DocumentNameInput';
import EmailNotificationInput from './schedule/EmailNotificationInput';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ScheduleScannerProps {
  documentId: string;
  documentName: string;
  industry?: string;
}

const saveSchedule = (schedule: any) => {
  try {
    localStorage.setItem(`compliZen_schedule_${schedule.documentId}`, JSON.stringify(schedule));
    console.log('Schedule saved to local storage:', schedule);
  } catch (err) {
    console.error('Error saving schedule to localStorage:', err);
  }
};

const loadSchedule = (documentId: string) => {
  try {
    const savedSchedule = localStorage.getItem(`compliZen_schedule_${documentId}`);
    return savedSchedule ? JSON.parse(savedSchedule) : null;
  } catch (err) {
    console.error('Error loading schedule from localStorage:', err);
    return null;
  }
};

const sendScheduledEmailNotification = async (schedule: any) => {
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

const registerScheduleWorker = (schedule: any) => {
  const scheduleKey = `scheduleWorker_${schedule.documentId}`;
  
  const getNextRunTime = () => {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun < now) {
      switch (schedule.frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          nextRun.setDate(nextRun.getDate() + 7);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          break;
        default:
          nextRun.setDate(nextRun.getDate() + 1);
      }
    }
    
    return nextRun;
  };
  
  const nextRun = getNextRunTime();
  localStorage.setItem(`${scheduleKey}_nextRun`, nextRun.toISOString());
  
  window.addEventListener('load', () => {
    checkScheduledTasks();
  });
  
  console.log(`Schedule worker registered for ${schedule.documentName}, next run: ${nextRun}`);
};

const checkScheduledTasks = () => {
  const scheduleKeys = Object.keys(localStorage).filter(key => key.startsWith('compliZen_schedule_'));
  
  if (scheduleKeys.length === 0) return;
  
  console.log(`Found ${scheduleKeys.length} scheduled tasks to check`);
  
  scheduleKeys.forEach(key => {
    try {
      const schedule = JSON.parse(localStorage.getItem(key) || '{}');
      
      if (!schedule.enabled || !schedule.email) {
        return;
      }
      
      const scheduleKey = `scheduleWorker_${schedule.documentId}`;
      const nextRunStr = localStorage.getItem(`${scheduleKey}_nextRun`);
      
      if (!nextRunStr) {
        registerScheduleWorker(schedule);
        return;
      }
      
      const nextRun = new Date(nextRunStr);
      const now = new Date();
      
      if (nextRun <= now) {
        console.log(`Executing scheduled task for ${schedule.documentName}`);
        
        sendScheduledEmailNotification(schedule).then(success => {
          if (success) {
            const newNextRun = new Date(nextRun);
            switch (schedule.frequency) {
              case 'daily':
                newNextRun.setDate(newNextRun.getDate() + 1);
                break;
              case 'weekly':
                newNextRun.setDate(newNextRun.getDate() + 7);
                break;
              case 'monthly':
                newNextRun.setMonth(newNextRun.getMonth() + 1);
                break;
            }
            
            localStorage.setItem(`${scheduleKey}_nextRun`, newNextRun.toISOString());
            console.log(`Next run scheduled for ${schedule.documentName}: ${newNextRun}`);
          }
        });
      } else {
        console.log(`Task for ${schedule.documentName} will run at ${nextRun}`);
      }
    } catch (err) {
      console.error('Error checking scheduled task:', err);
    }
  });
};

const ScheduleScanner: React.FC<ScheduleScannerProps> = ({ 
  documentId, 
  documentName, 
  industry 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const savedSchedule = loadSchedule(documentId);

  const defaultValues: Partial<ScheduleFormValues> = savedSchedule || {
    frequency: 'weekly',
    enabled: true,
    time: '09:00',
    documentName: documentName,
    email: user?.email || '',
  };

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const watchEnabled = form.watch("enabled");
  const watchEmail = form.watch("email");
  
  useEffect(() => {
    const intervalId = setInterval(checkScheduledTasks, 60000);
    checkScheduledTasks();
    
    return () => clearInterval(intervalId);
  }, []);

  const onSubmit = async (data: ScheduleFormValues) => {
    if (!data.enabled) {
      toast.info("Automated scans are disabled", {
        description: "Enable scans to schedule compliance checks",
      });
      
      const schedule = {
        ...data,
        documentId,
        industry,
        scheduledBy: user?.email || 'anonymous',
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
        scheduledBy: user?.email || 'anonymous',
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

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Schedule Automated Scans</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ScheduleToggle form={form} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FrequencySelector form={form} />
            <TimeSelector form={form} />
          </div>
          
          <DocumentNameInput form={form} />
          <EmailNotificationInput form={form} />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || (watchEnabled && !watchEmail)}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Automated Scans'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleScanner;
