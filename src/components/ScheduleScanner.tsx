
import React, { useState } from 'react';
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

interface ScheduleScannerProps {
  documentId: string;
  documentName: string;
  industry?: string;
}

const ScheduleScanner: React.FC<ScheduleScannerProps> = ({ 
  documentId, 
  documentName, 
  industry 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: Partial<ScheduleFormValues> = {
    frequency: 'weekly',
    enabled: true,
    time: '09:00',
    documentName: documentName,
    email: '',
  };

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues,
    mode: 'onChange', // Add real-time validation
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    if (!data.enabled) {
      toast.info("Automated scans are disabled", {
        description: "Enable scans to schedule compliance checks",
      });
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
      // In a real app, this would call an API to schedule the scan
      console.log("Scheduling scan with data:", {
        ...data,
        documentId,
        industry,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Automated scans scheduled ${data.frequency}`, {
        description: `We'll send reports to ${data.email}`,
      });
      
      // Reset form after successful submission
      form.reset({
        ...data,
        enabled: true,
      });
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Automated Scans'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleScanner;
