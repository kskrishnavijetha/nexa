
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

const projectSchema = z.object({
  key: z.string().min(1, 'Project key is required'),
  name: z.string().min(1, 'Project name is required'),
});

interface JiraProjectDialogProps {
  form: UseFormReturn<z.infer<typeof projectSchema>>;
  onSubmit: (data: z.infer<typeof projectSchema>) => Promise<void>;
}

const JiraProjectDialog: React.FC<JiraProjectDialogProps> = ({ form, onSubmit }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Project</DialogTitle>
        <DialogDescription>
          Add a new Jira project to sync with NexaBloom.
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Key</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. PROJ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. My Project" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DialogFooter>
            <Button type="submit">Add Project</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export { projectSchema };
export default JiraProjectDialog;
