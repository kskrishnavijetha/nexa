
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GoogleScannerStatus: React.FC = () => {
  return (
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
  );
};

export default GoogleScannerStatus;
