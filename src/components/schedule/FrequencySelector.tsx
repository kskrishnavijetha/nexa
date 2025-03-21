
import React from 'react';
import {
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
import { UseFormReturn } from 'react-hook-form';
import { ScheduleFormValues, getFrequencyDescription } from './ScheduleFormSchema';

interface FrequencySelectorProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ form }) => {
  return (
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
  );
};

export default FrequencySelector;
