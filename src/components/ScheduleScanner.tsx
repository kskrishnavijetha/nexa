
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
import { AlertCircle } from 'lucide-react';

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
  const [testEmailSent, setTestEmailSent] = useState(false);

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
  });

  const onSubmit = async (data: ScheduleFormValues) => {
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
      
      // Send a test email to verify the email address
      await sendTestEmail(data.email, data.frequency, data.documentName);
      
      setTestEmailSent(true);
      
      toast.success(`Automated scans scheduled ${data.frequency}`, {
        description: `We'll send reports to ${data.email}`,
      });
    } catch (error) {
      toast.error("Failed to schedule automated scan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendTestEmail = async (email: string, frequency: string, documentName: string) => {
    // In a real app, this would call an API to send a test email
    console.log(`Sending test email to ${email}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return success
    return true;
  };

  const handleSendTestEmail = async () => {
    const email = form.getValues('email');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    try {
      toast.info("Sending test email...");
      await sendTestEmail(
        email,
        form.getValues('frequency'),
        form.getValues('documentName')
      );
      toast.success("Test email sent successfully", {
        description: `Check your inbox at ${email}`,
      });
    } catch (error) {
      toast.error("Failed to send test email");
      console.error(error);
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
          
          <div className="space-y-2">
            <EmailNotificationInput form={form} />
            
            {form.watch("enabled") && form.watch("email") && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleSendTestEmail}
                className="w-full sm:w-auto mt-2"
              >
                Send Test Email
              </Button>
            )}
          </div>

          {testEmailSent && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Email Configuration Verified</p>
                <p className="mt-1">You'll receive scan reports according to your selected schedule.</p>
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !form.watch("enabled")}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Automated Scans'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            You'll receive scan reports at the specified frequency
          </p>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleScanner;
