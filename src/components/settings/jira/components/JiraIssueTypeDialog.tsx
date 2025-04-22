
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const issueTypeSchema = z.object({
  name: z.string().min(1, "Issue type name is required"),
  description: z.string().optional(),
});

type IssueTypeFormValues = z.infer<typeof issueTypeSchema>;

interface JiraIssueTypeDialogProps {
  form: ReturnType<typeof useForm<IssueTypeFormValues>>;
  onSubmit: (values: IssueTypeFormValues) => void;
}

const JiraIssueTypeDialog: React.FC<JiraIssueTypeDialogProps> = ({ form, onSubmit }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Issue Type</DialogTitle>
        <DialogDescription>
          Add a new issue type to categorize Jira issues.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Compliance Issue" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Issues related to regulatory compliance" 
                    {...field} 
                    value={field.value || ''}
                  />
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

export default JiraIssueTypeDialog;
