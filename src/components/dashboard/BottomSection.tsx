
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RiskSummary from '@/components/dashboard/RiskSummary';
import UpcomingDeadlines from '@/components/dashboard/UpcomingDeadlines';
import { Clock, ShieldAlert } from 'lucide-react';

const BottomSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-md">Risk Summary</CardTitle>
            <CardDescription>
              Breakdown of compliance risks by category
            </CardDescription>
          </div>
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <RiskSummary />
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-md">Upcoming Deadlines</CardTitle>
            <CardDescription>
              Action items due soon
            </CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <UpcomingDeadlines />
        </CardContent>
      </Card>
    </div>
  );
};

export default BottomSection;
