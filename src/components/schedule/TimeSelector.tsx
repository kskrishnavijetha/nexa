
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

interface TimeSelectorProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ form }) => {
  return (
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
  );
};

export default TimeSelector;
