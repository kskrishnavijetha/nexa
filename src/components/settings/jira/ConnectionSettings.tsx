import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface ConnectionSettingsProps {
  form: any;
  isConnected: boolean;
  testingConnection: boolean;
  testConnection: () => Promise<void>;
  disconnectJira: () => void;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({
  form,
  isConnected,
  testingConnection,
  testConnection,
  disconnectJira
}) => {
  const handleDemoModeToggle = (checked: boolean) => {
    if (checked) {
      form.setValue('domain', 'demo.atlassian.net');
      form.setValue('email', 'demo@example.com');
      form.setValue('apiToken', 'demo-token');
    } else {
      form.setValue('domain', '');
      form.setValue('email', '');
      form.setValue('apiToken', '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="demo-mode"
          onCheckedChange={handleDemoModeToggle}
          disabled={isConnected}
        />
        <FormLabel htmlFor="demo-mode">Use Demo Mode</FormLabel>
      </div>

      <FormField
        control={form.control}
        name="domain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jira Domain</FormLabel>
            <FormControl>
              <Input 
                placeholder="your-domain.atlassian.net" 
                {...field} 
                disabled={isConnected}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                placeholder="user@example.com"
                {...field}
                type="email"
                disabled={isConnected}
              />
            </FormControl>
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
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                {...field}
                type="password"
                disabled={isConnected}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex justify-end space-x-2">
        {isConnected ? (
          <Button type="button" variant="outline" onClick={disconnectJira}>
            Disconnect
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={testConnection}
            disabled={testingConnection}
          >
            {testingConnection ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              'Test Connection'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConnectionSettings;
