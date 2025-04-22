
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJiraForm } from '@/hooks/useJiraForm';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check } from 'lucide-react';

interface ProjectSettingsProps {
  projectKey?: string;
  issueType?: string;
  onProjectChange?: (key: string) => void;
  onIssueTypeChange?: (type: string) => void;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({
  projectKey,
  issueType,
  onProjectChange,
  onIssueTypeChange,
}) => {
  const { projects, issueTypes } = useJiraForm();

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="project-select">Jira Project</Label>
            <Select
              value={projectKey}
              onValueChange={onProjectChange}
            >
              <SelectTrigger id="project-select">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <SelectItem key={index} value={project.key}>
                      {project.name} ({project.key})
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-3 text-muted-foreground">
                    No projects available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-type-select">Issue Type</Label>
            <Select
              value={issueType}
              onValueChange={onIssueTypeChange}
              disabled={!projectKey}
            >
              <SelectTrigger id="issue-type-select">
                <SelectValue placeholder="Select an issue type" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.length > 0 ? (
                  issueTypes.map((type, index) => (
                    <SelectItem key={index} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-3 text-muted-foreground">
                    No issue types available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span>Connection Status</span>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
