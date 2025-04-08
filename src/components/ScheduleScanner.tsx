
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleFormSchema, ScheduleFormValues } from './schedule/ScheduleFormSchema';
import ScheduleToggle from './schedule/ScheduleToggle';
import FrequencySelector from './schedule/FrequencySelector';
import TimeSelector from './schedule/TimeSelector';
import DocumentNameInput from './schedule/DocumentNameInput';
import EmailNotificationInput from './schedule/EmailNotificationInput';
import { useAuth } from '@/contexts/AuthContext';
import { loadSchedule } from '@/utils/schedule/scheduleStorage';
import { checkScheduledTasks } from '@/utils/schedule/scheduleChecker';
import { useScheduleForm } from '@/hooks/useScheduleForm';

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
  
  const { isSubmitting, onSubmit } = useScheduleForm({
    documentId,
    industry,
    userEmail: user?.email,
    form
  });
  
  useEffect(() => {
    const intervalId = setInterval(checkScheduledTasks, 60000);
    checkScheduledTasks();
    
    return () => clearInterval(intervalId);
  }, []);

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
