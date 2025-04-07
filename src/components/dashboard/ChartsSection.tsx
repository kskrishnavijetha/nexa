
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import RecentScans from '@/components/dashboard/RecentScans';
import ComplianceScore from '@/components/dashboard/ComplianceScore';

const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-1">
        <CardContent className="pt-6">
          <RecentScans />
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardContent className="pt-6 h-[350px]">
          <ComplianceScore />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
