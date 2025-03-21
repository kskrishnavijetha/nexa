
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
  );
};

export default EmailNotificationInput;
