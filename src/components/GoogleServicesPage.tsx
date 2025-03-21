
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleServicesScanner from './google/GoogleServicesScanner';
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';
import IndustrySelector from './document-uploader/IndustrySelector';
import RegionSelector from './document-uploader/RegionSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { CloudLightning, History, Settings } from 'lucide-react';
import AuditTrail from './audit/AuditTrail';
import ScheduleScanner from './ScheduleScanner';

const GoogleServicesPage: React.FC = () => {
  const [industry, setIndustry] = useState<Industry | undefined>(undefined);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [activeTab, setActiveTab] = useState('scanner');

  const handleIndustryChange = (newIndustry: Industry) => {
    setIndustry(newIndustry);
  };

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
  };

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Google Services Compliance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Configure Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <IndustrySelector 
                industry={industry} 
                onChange={handleIndustryChange} 
              />
              
              <RegionSelector 
                region={region} 
                onChange={handleRegionChange} 
              />
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium mb-1">
                  Report Language
                </label>
                <Select value={language} onValueChange={val => handleLanguageChange(val as SupportedLanguage)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Scanner Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium">Services Connected</p>
                <p className="text-2xl font-bold mt-1">0/3</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium">Last Scan</p>
                <p className="text-sm font-medium mt-1">Not yet scanned</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium">Items Scanned</p>
                <p className="text-2xl font-bold mt-1">0</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <p className="text-sm font-medium">Violations Found</p>
                <p className="text-2xl font-bold mt-1 text-green-500">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <CloudLightning className="h-4 w-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scanner" className="mt-6">
          <GoogleServicesScanner 
            industry={industry}
            language={language}
            region={region}
          />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <AuditTrail documentName="Google Services Scanner" />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScheduleScanner 
              documentId="google-service-scanner"
              documentName="Google Services Scanner"
              industry={industry}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scan Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Scan Depth
                    </label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select scan depth" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shallow">Shallow (Fast)</SelectItem>
                        <SelectItem value="medium">Medium (Recommended)</SelectItem>
                        <SelectItem value="deep">Deep (Thorough)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Item Retention
                    </label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Notification Settings
                    </label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All issues</SelectItem>
                        <SelectItem value="high">High severity only</SelectItem>
                        <SelectItem value="none">No notifications</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleServicesPage;
