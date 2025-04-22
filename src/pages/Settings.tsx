
import React, { useState } from 'react';
import BrandingSettings from '@/components/settings/BrandingSettings';
import JiraSettings from '@/components/settings/JiraSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('branding');

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="branding" className="w-full">
          <BrandingSettings />
        </TabsContent>
        
        <TabsContent value="integrations" className="w-full space-y-6">
          <JiraSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
