
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BrandingSettings from '@/components/settings/BrandingSettings';

const Settings: React.FC = () => {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding">
          <BrandingSettings />
        </TabsContent>
        
        <TabsContent value="account">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Account settings will be available soon</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Notification settings will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
