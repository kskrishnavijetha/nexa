
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
import { Button } from "@/components/ui/button";

export const projectSchema = z.object({
  key: z.string().min(1, "Project key is required").max(10, "Key must be 10 characters or less").toUpperCase(),
  name: z.string().min(1, "Project name is required"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface JiraProjectDialogProps {
  form: ReturnType<typeof useForm<ProjectFormValues>>;
  onSubmit: (values: ProjectFormValues) => void;
}

const JiraProjectDialog: React.FC<JiraProjectDialogProps> = ({ form, onSubmit }) => {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add Jira Project</DialogTitle>
        <DialogDescription>
          Add a new project to monitor for compliance issues.
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
                  <Input placeholder="COMP" {...field} />
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
                  <Input placeholder="Compliance Project" {...field} />
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

export default JiraProjectDialog;
