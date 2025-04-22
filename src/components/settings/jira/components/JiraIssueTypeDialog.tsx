
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

const issueTypeSchema = z.object({
  name: z.string().min(1, 'Issue type name is required'),
  description: z.string().optional(),
});

interface JiraIssueTypeDialogProps {
  form: UseFormReturn<z.infer<typeof issueTypeSchema>>;
  onSubmit: (data: z.infer<typeof issueTypeSchema>) => Promise<void>;
}

const JiraIssueTypeDialog: React.FC<JiraIssueTypeDialogProps> = ({ form, onSubmit }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Issue Type</DialogTitle>
        <DialogDescription>
          Add a new Jira issue type for tracking.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Type Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Issues that need to be fixed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="submit">Add Issue Type</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export { issueTypeSchema };
export default JiraIssueTypeDialog;
