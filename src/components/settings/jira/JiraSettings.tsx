
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  const { logout, cloudId, isAuthenticated } = useJiraAuth();
  const { toast } = useToast();
  const [scanFrequency, setScanFrequency] = useState<string>('daily');
  const [autoSync, setAutoSync] = useState<boolean>(true);
  const [complianceKeywords, setComplianceKeywords] = useState<string>('SOC 2, HIPAA, PCI DSS, GDPR, encryption, access control');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [autoSyncSettings, setAutoSyncSettings] = useState({
    syncIssueStatus: true,
    syncComments: true,
    syncAttachments: false
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const storedFrequency = localStorage.getItem('jira_scan_frequency');
    const storedAutoSync = localStorage.getItem('jira_auto_sync');
    const storedKeywords = localStorage.getItem('jira_compliance_keywords');
    
    if (storedFrequency) setScanFrequency(storedFrequency);
    if (storedAutoSync) setAutoSync(storedAutoSync === 'true');
    if (storedKeywords) setComplianceKeywords(storedKeywords);
    
    // Load auto sync detailed settings
    const storedAutoSyncSettings = localStorage.getItem('jira_auto_sync_settings');
    if (storedAutoSyncSettings) {
      try {
        setAutoSyncSettings(JSON.parse(storedAutoSyncSettings));
      } catch (e) {
        console.error('Failed to parse auto sync settings:', e);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      // Save settings to localStorage for persistence
      localStorage.setItem('jira_scan_frequency', scanFrequency);
      localStorage.setItem('jira_auto_sync', autoSync.toString());
      localStorage.setItem('jira_compliance_keywords', complianceKeywords);
      localStorage.setItem('jira_auto_sync_settings', JSON.stringify(autoSyncSettings));
      
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

  const handleAutoSyncChange = (value: boolean) => {
    setAutoSync(value);
    // If auto sync is turned off, disable all detailed settings
    if (!value) {
      setAutoSyncSettings({
        syncIssueStatus: false,
        syncComments: false,
        syncAttachments: false
      });
    } else {
      // If turning on, enable default settings
      setAutoSyncSettings({
        syncIssueStatus: true,
        syncComments: true,
        syncAttachments: false
      });
    }
  };

  // If not authenticated, don't render settings
  if (!isAuthenticated) {
    return null;
  }

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

            <div className="space-y-4">
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
                  onCheckedChange={handleAutoSyncChange}
                />
              </div>
              
              {autoSync && (
                <div className="ml-6 space-y-3 border-l-2 border-muted pl-4 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="syncIssueStatus" className="text-sm">Sync issue status</Label>
                    </div>
                    <Switch
                      id="syncIssueStatus"
                      checked={autoSyncSettings.syncIssueStatus}
                      onCheckedChange={(checked) => 
                        setAutoSyncSettings(prev => ({...prev, syncIssueStatus: checked}))}
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="syncComments" className="text-sm">Sync comments</Label>
                    </div>
                    <Switch
                      id="syncComments"
                      checked={autoSyncSettings.syncComments}
                      onCheckedChange={(checked) => 
                        setAutoSyncSettings(prev => ({...prev, syncComments: checked}))}
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="syncAttachments" className="text-sm">Sync attachments</Label>
                    </div>
                    <Switch
                      id="syncAttachments"
                      checked={autoSyncSettings.syncAttachments}
                      onCheckedChange={(checked) => 
                        setAutoSyncSettings(prev => ({...prev, syncAttachments: checked}))}
                      size="sm"
                    />
                  </div>
                </div>
              )}
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
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <span className="font-medium mr-2">Status:</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center">
              <span className="font-medium mr-2">Workspace:</span>
              {cloudId ? (
                <span className="text-sm">{cloudId}</span>
              ) : (
                <span className="text-sm text-muted-foreground">Not connected</span>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="font-medium mr-2">Connected since:</span>
              <span className="text-sm">
                {localStorage.getItem('jira_connected_date') || new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
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
