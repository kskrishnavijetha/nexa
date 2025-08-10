
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Settings, RefreshCw, ExternalLink } from 'lucide-react';
import { workdayService } from '@/utils/workday/workdayService';
import { toast } from 'sonner';

const WorkdayConnection: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [tenantUrl, setTenantUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(workdayService.getConnectionStatus());

  useEffect(() => {
    setConnectionStatus(workdayService.getConnectionStatus());
  }, []);

  const handleConnect = async () => {
    if (!tenantUrl || !clientId || !clientSecret) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsConnecting(true);
    try {
      const success = await workdayService.authenticateWithOAuth2(tenantUrl, clientId, clientSecret);
      if (success) {
        setConnectionStatus(workdayService.getConnectionStatus());
        // Clear form
        setTenantUrl('');
        setClientId('');
        setClientSecret('');
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    workdayService.disconnect();
    setConnectionStatus(workdayService.getConnectionStatus());
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      await workdayService.refreshAccessToken();
      toast.success('Connection test successful');
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Workday Connection
            </CardTitle>
            <CardDescription>
              Connect to your Workday tenant to sync compliance data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus.connected ? (
              <Badge variant="default" className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                <XCircle className="h-3 w-3 mr-1" />
                Disconnected
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {connectionStatus.connected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-green-900">Connected to Workday</h4>
                <p className="text-sm text-green-700">Tenant: {connectionStatus.tenantUrl}</p>
                {connectionStatus.lastSync && (
                  <p className="text-xs text-green-600 mt-1">
                    Last sync: {new Date(connectionStatus.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">HCM Access</h5>
                <p className="text-xs text-muted-foreground">Employee data & HR policies</p>
                <Badge variant="outline" className="mt-1 text-xs">Active</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">Financial Management</h5>
                <p className="text-xs text-muted-foreground">Financial records & reports</p>
                <Badge variant="outline" className="mt-1 text-xs">Active</Badge>
              </div>
              <div className="p-3 border rounded-lg">
                <h5 className="font-medium text-sm">Analytics & Reporting</h5>
                <p className="text-xs text-muted-foreground">Audit logs & compliance data</p>
                <Badge variant="outline" className="mt-1 text-xs">Active</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenantUrl">Workday Tenant URL</Label>
              <Input
                id="tenantUrl"
                placeholder="https://mycompany.workday.com"
                value={tenantUrl}
                onChange={(e) => setTenantUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your Workday tenant URL (e.g., https://mycompany.workday.com)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                placeholder="Enter your Workday Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                placeholder="Enter your Workday Client Secret"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4 mr-2" />
                )}
                Connect to Workday
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                This will redirect you to Workday for secure OAuth2 authentication
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Setup Instructions</h5>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Log into your Workday tenant as an administrator</li>
                <li>2. Navigate to Applications → Register API Client</li>
                <li>3. Create a new API client with appropriate scopes</li>
                <li>4. Copy the Client ID and Client Secret here</li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkdayConnection;
