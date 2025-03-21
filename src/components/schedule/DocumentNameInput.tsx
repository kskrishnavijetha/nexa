
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

interface DocumentNameInputProps {
  form: UseFormReturn<ScheduleFormValues>;
}

const DocumentNameInput: React.FC<DocumentNameInputProps> = ({ form }) => {
  return (
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
  );
};

export default DocumentNameInput;
