
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { ScheduleFormValues } from './ScheduleFormSchema';

interface ScheduleToggleProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const ScheduleToggle: React.FC<ScheduleToggleProps> = ({ form }) => {
  return (
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
  );
};

export default ScheduleToggle;
