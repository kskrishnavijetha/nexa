
import React from 'react';
import BrandingSettings from '@/components/settings/BrandingSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JiraIntegration from '@/components/settings/jira/JiraIntegration';

const Settings: React.FC = () => {
  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding">
          <BrandingSettings />
        </TabsContent>
        
        <TabsContent value="integrations">
          <JiraIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
