
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import ActionItems from '@/components/dashboard/ActionItems';

interface DashboardTabContentProps {
  activeTab: string;
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ activeTab }) => {
  if (activeTab === 'compliance') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Details</CardTitle>
          <CardDescription>
            Detailed breakdown of your compliance status across regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Compliance details content will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'risks') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>
            Comprehensive view of identified risks and their severity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Risk assessment content will appear here.</p>
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'actions') {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Action Items</CardTitle>
              <CardDescription>
                Tasks that need your attention to improve compliance
              </CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ActionItems />
        </CardContent>
      </Card>
    );
  }

  // Default to overview tab content
  return null;
};

export default DashboardTabContent;
