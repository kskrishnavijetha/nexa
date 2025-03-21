
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScheduleScanner from '../ScheduleScanner';
import { Industry } from '@/utils/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';

interface GoogleScannerSettingsProps {
  industry: Industry | undefined;
}

const GoogleScannerSettings: React.FC<GoogleScannerSettingsProps> = ({ industry }) => {
  return (
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
  );
};

export default GoogleScannerSettings;
