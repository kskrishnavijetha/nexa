
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ScheduleFormValues } from './ScheduleFormSchema';
import { AlertCircle } from 'lucide-react';

interface EmailNotificationInputProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const EmailNotificationInput: React.FC<EmailNotificationInputProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notification Email</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="email"
                placeholder="your@email.com"
                {...field}
                disabled={!form.watch("enabled")}
                className="pr-10"
              />
              {form.formState.errors.email && (
                <AlertCircle className="h-4 w-4 text-destructive absolute right-3 top-1/2 transform -translate-y-1/2" />
              )}
            </div>
          </FormControl>
          <FormDescription>
            We'll send compliance reports to this email address
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailNotificationInput;
