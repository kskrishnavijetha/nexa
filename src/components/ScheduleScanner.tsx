
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  enabled: z.boolean().default(true),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in HH:MM format",
  }),
  documentName: z.string().min(1, "Document name is required"),
  email: z.string().email("Please enter a valid email address"),
});

type ScanScheduleFormValues = z.infer<typeof formSchema>;

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

  const defaultValues: Partial<ScanScheduleFormValues> = {
    frequency: 'weekly',
    enabled: true,
    time: '09:00',
    documentName: documentName,
    email: '',
  };

  const form = useForm<ScanScheduleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ScanScheduleFormValues) => {
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
    } catch (error) {
      toast.error("Failed to schedule automated scan");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFrequencyDescription = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Scans will run every day at the specified time';
      case 'weekly':
        return 'Scans will run every week on the same day at the specified time';
      case 'monthly':
        return 'Scans will run on the same day each month at the specified time';
      default:
        return '';
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">Schedule Automated Scans</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Enable Automated Scans</FormLabel>
                  <FormDescription>
                    Receive AI-powered risk reports based on your schedule
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scan Frequency</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!form.watch("enabled")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {getFrequencyDescription(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scan Time</FormLabel>
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={!form.watch("enabled")}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Scans will run at this time in your local timezone
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="documentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!form.watch("enabled")} />
                </FormControl>
                <FormDescription>
                  Name that will appear in your compliance reports
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    {...field}
                    disabled={!form.watch("enabled")}
                  />
                </FormControl>
                <FormDescription>
                  We'll send compliance reports to this email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !form.watch("enabled")}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Automated Scans'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleScanner;
