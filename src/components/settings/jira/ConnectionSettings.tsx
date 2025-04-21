
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { CheckCircle, X } from 'lucide-react';
import { JiraSettings } from './types';
import { UseFormReturn } from 'react-hook-form';

interface ConnectionSettingsProps {
  form: UseFormReturn<JiraSettings>;
  isConnected: boolean;
  testingConnection: boolean;
  testConnection: () => void;
  disconnectJira: () => void;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  form,
  isConnected,
  testingConnection,
  testConnection,
  disconnectJira
}) => {
  const formValues = form.watch();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Connection Settings</h3>
      
      {isConnected ? (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium">Connected to Jira</p>
            <p className="text-sm text-muted-foreground">{formValues.domain}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            type="button"
            className="ml-auto" 
            onClick={disconnectJira}
          >
            <X className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jira Domain</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="your-company.atlassian.net" 
                      {...field} 
                      disabled={isConnected}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter your Jira domain without https://
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your-email@example.com" 
                      {...field} 
                      disabled={isConnected}
                    />
                  </FormControl>
                  <FormDescription>
                    The email address associated with your Jira account
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••••••••••" 
                      {...field} 
                      disabled={isConnected}
                    />
                  </FormControl>
                  <FormDescription>
                    Generate an API token from your Atlassian account settings
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button 
              onClick={testConnection}
              disabled={testingConnection || !formValues.domain || !formValues.email || !formValues.apiToken}
              type="button"
            >
              {testingConnection ? "Testing Connection..." : "Test Connection"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionSettings;
