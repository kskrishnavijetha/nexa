
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { JiraSettings } from './types';
import { AlertTriangle } from 'lucide-react';

interface IssueCreationRulesProps {
  form: UseFormReturn<JiraSettings>;
}

const IssueCreationRules: React.FC<IssueCreationRulesProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Issue Creation Rules</h3>
      
      <div className="space-y-3">
        <FormField
          control={form.control}
          name="createIssuesForHighRiskOnly"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">High-Risk Issues Only</FormLabel>
                <FormDescription>
                  Only create Jira issues for high severity compliance violations
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

        <FormField
          control={form.control}
          name="createIssuesForViolations"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Document Violations</FormLabel>
                <FormDescription>
                  Create issues for compliance violations in document analysis
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

        <FormField
          control={form.control}
          name="createIssuesForRisks"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Simulation Risks</FormLabel>
                <FormDescription>
                  Create issues for risks identified in scenario simulations
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

        <FormField
          control={form.control}
          name="createIssuesForAuditEntries"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Critical Audit Entries</FormLabel>
                <FormDescription>
                  Create issues for audit trail entries marked as critical
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
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-sm">Important Information</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Issues will be created automatically based on the settings above. Each issue will include the document name, framework violated, risk level, and suggested remediation steps. Make sure your Jira project is properly configured to handle these issues.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IssueCreationRules;
