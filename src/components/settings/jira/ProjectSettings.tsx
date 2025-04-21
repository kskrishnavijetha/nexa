
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { JiraSettings, JiraProject, JiraIssueType } from './types';

interface ProjectSettingsProps {
  form: UseFormReturn<JiraSettings>;
  isLoading: boolean;
  projects: JiraProject[];
  issueTypes: JiraIssueType[];
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  form,
  isLoading,
  projects,
  issueTypes
}) => {
  const formValues = form.watch();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Project Settings</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="projectKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jira Project</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.key}>
                      {project.name} ({project.key})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the Jira project where issues will be created
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="issueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={isLoading || !formValues.projectKey}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an issue type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of issue to create
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectSettings;
