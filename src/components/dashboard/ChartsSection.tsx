
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RecentScans from '@/components/dashboard/RecentScans';
import ComplianceScore from '@/components/dashboard/ComplianceScore';

const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
          <CardDescription>
            Your latest document compliance scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentScans />
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Compliance Score</CardTitle>
          <CardDescription>
            Your compliance score over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ComplianceScore />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
