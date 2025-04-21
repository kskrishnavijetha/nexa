import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useForm, FormProvider } from 'react-hook-form';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { CheckCircle, AlertTriangle, X, Settings } from 'lucide-react';

interface JiraProject {
  id: string;
  key: string;
  name: string;
}

interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}

interface JiraSettings {
  connected: boolean;
  domain: string;
  email: string;
  apiToken: string;
  projectKey: string;
  issueType: string;
  createIssuesForHighRiskOnly: boolean;
  createIssuesForViolations: boolean;
  createIssuesForRisks: boolean;
  createIssuesForAuditEntries: boolean;
}

const JiraIntegration: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [issueTypes, setIssueTypes] = useState<JiraIssueType[]>([]);
  const [testingConnection, setTestingConnection] = useState(false);

  const defaultValues: JiraSettings = {
    connected: false,
    domain: '',
    email: '',
    apiToken: '',
    projectKey: '',
    issueType: '10001', // Default to "Task" type
    createIssuesForHighRiskOnly: true,
    createIssuesForViolations: true,
    createIssuesForRisks: true,
    createIssuesForAuditEntries: false
  };

  const form = useForm<JiraSettings>({
    defaultValues
  });

  const { setValue, watch } = form;
  const formValues = watch();

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('nexabloom_jira_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        Object.entries(settings).forEach(([key, value]) => {
          setValue(key as any, value);
        });
        setIsConnected(settings.connected || false);
      } catch (err) {
        console.error('Error loading Jira settings', err);
      }
    }
  }, [setValue]);

  // When connection status changes, fetch projects
  useEffect(() => {
    if (isConnected && formValues.domain && formValues.apiToken) {
      fetchProjects();
    }
  }, [isConnected, formValues.domain, formValues.apiToken]);

  // When project changes, fetch issue types
  useEffect(() => {
    if (isConnected && formValues.projectKey) {
      fetchIssueTypes();
    }
  }, [formValues.projectKey, isConnected]);

  const fetchProjects = async () => {
    setIsLoading(true);
    // In a real implementation, this would call a secure backend API
    // For now, we'll simulate a successful response
    
    // Simulated delay and response
    setTimeout(() => {
      const mockProjects = [
        { id: "10000", key: "NB", name: "NexaBloom" },
        { id: "10001", key: "COMP", name: "Compliance" },
        { id: "10002", key: "AUDIT", name: "Audits" }
      ];
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
  };

  const fetchIssueTypes = async () => {
    setIsLoading(true);
    // Simulated delay and response
    setTimeout(() => {
      const mockIssueTypes = [
        { id: "10001", name: "Task", description: "A task that needs to be done." },
        { id: "10002", name: "Bug", description: "A problem which impairs or prevents functionality." },
        { id: "10003", name: "Compliance Issue", description: "A compliance related issue requiring action." }
      ];
      setIssueTypes(mockIssueTypes);
      setIsLoading(false);
    }, 800);
  };

  const testConnection = async () => {
    setTestingConnection(true);
    // Validate required fields
    if (!formValues.domain || !formValues.email || !formValues.apiToken) {
      toast.error("Please fill in all required fields");
      setTestingConnection(false);
      return;
    }

    // In a real implementation, this would verify the connection with Jira
    setTimeout(() => {
      setIsConnected(true);
      setValue('connected', true);
      toast.success("Successfully connected to Jira!");
      setTestingConnection(false);
    }, 1500);
  };

  const disconnectJira = () => {
    setIsConnected(false);
    setValue('connected', false);
    setValue('projectKey', '');
    setValue('issueType', '');
    toast.info("Jira integration disconnected");
  };

  const onSubmit = (data: JiraSettings) => {
    setIsLoading(true);
    
    // Save settings to localStorage (in a real app, store in a secure backend)
    localStorage.setItem('nexabloom_jira_settings', JSON.stringify(data));
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Jira integration settings saved successfully");
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Jira Integration</CardTitle>
        </div>
        <CardDescription>
          Configure automatic creation of Jira issues for compliance violations, risks, and audit events
        </CardDescription>
      </CardHeader>
      
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-6">
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
                        <FormItem className="mt-4">
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
                        <FormItem className="mt-4">
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

            {isConnected && (
              <>
                <Separator />
                
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
                        <FormItem className="mt-4">
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
                
                <Separator />
                
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
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
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-3">
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
                </div>
                
                <Separator />
                
                <div className="space-y-4">
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
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t px-6 py-4">
            {isConnected && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            )}
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};

export default JiraIntegration;
