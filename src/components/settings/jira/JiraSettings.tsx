
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useJiraAuth } from '@/hooks/useJiraAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const JiraSettings = () => {
  const { logout } = useJiraAuth();
  const { toast } = useToast();
  const [scanFrequency, setScanFrequency] = useState<string>('daily');
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [complianceKeywords, setComplianceKeywords] = useState<string>('SOC 2, HIPAA, PCI DSS, GDPR, encryption, access control');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      // Save settings to localStorage for persistence
      localStorage.setItem('jira_scan_frequency', scanFrequency);
      localStorage.setItem('jira_auto_sync', autoSync.toString());
      localStorage.setItem('jira_compliance_keywords', complianceKeywords);
      
      toast({
        title: 'Settings saved',
        description: 'Your Jira integration settings have been updated.',
      });
    }, 1000);
  };

  const handleDisconnect = () => {
    setShowDisconnectDialog(true);
  };

  const confirmDisconnect = () => {
    logout();
    setShowDisconnectDialog(false);
    
    toast({
      title: 'Disconnected from Jira',
      description: 'You have been successfully disconnected from Jira.',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>Configure how NexaBloom interacts with your Jira workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="scanFrequency">Scan Frequency</Label>
              <select
                id="scanFrequency"
                value={scanFrequency}
                onChange={(e) => setScanFrequency(e.target.value)}
                className="w-full p-2 border border-input rounded-md mt-1"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual only</option>
              </select>
              <p className="text-sm text-muted-foreground mt-1">
                How often NexaBloom should scan Jira for compliance-related issues
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoSync" className="block">Automatic Synchronization</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically sync issue status changes between systems
                </p>
              </div>
              <Switch
                id="autoSync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>

            <div>
              <Label htmlFor="complianceKeywords">Compliance Keywords</Label>
              <textarea
                id="complianceKeywords"
                value={complianceKeywords}
                onChange={(e) => setComplianceKeywords(e.target.value)}
                className="w-full p-2 border border-input rounded-md mt-1 min-h-[100px]"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Comma-separated keywords to identify compliance-related issues
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connection</CardTitle>
          <CardDescription>Manage your Jira connection</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Connected to Jira Cloud. 
            <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              Active
            </span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Instance: {localStorage.getItem('jira_cloud_id') || 'Unknown'}
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="destructive" onClick={handleDisconnect}>
            Disconnect from Jira
          </Button>
        </CardFooter>
      </Card>
      
      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to disconnect from Jira?</AlertDialogTitle>
            <AlertDialogDescription>
              All integration settings will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDisconnect}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JiraSettings;
