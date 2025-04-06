
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import ActionItems from '@/components/dashboard/ActionItems';

interface DashboardTabContentProps {
  activeTab: string;
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ activeTab }) => {
  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // In a real app, we would perform the actual action here
  };

  if (activeTab === 'compliance') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Details</CardTitle>
          <CardDescription>
            Detailed breakdown of your compliance status across regulations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">GDPR Compliance</h3>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span>Score: 85%</span>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction('view-gdpr')}>
                View Details
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">HIPAA Compliance</h3>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span>Score: 72%</span>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction('view-hipaa')}>
                View Details
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">SOC2 Compliance</h3>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '91%' }}></div>
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span>Score: 91%</span>
              <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => handleAction('view-soc2')}>
                View Details
              </Button>
            </div>
          </div>
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
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-md border border-red-100">
              <h3 className="text-red-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                High Severity Risks
              </h3>
              <ul className="mt-2 space-y-2">
                <li className="text-sm">Missing data retention policy</li>
                <li className="text-sm">Insecure data transfer protocols</li>
                <li className="text-sm">No data breach notification procedure</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
              <h3 className="text-amber-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Medium Severity Risks
              </h3>
              <ul className="mt-2 space-y-2">
                <li className="text-sm">Incomplete consent forms</li>
                <li className="text-sm">Outdated privacy policy language</li>
                <li className="text-sm">Limited access controls for sensitive data</li>
                <li className="text-sm">Lack of regular security assessments</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <h3 className="text-green-700 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Low Severity Risks
              </h3>
              <ul className="mt-2 space-y-2">
                <li className="text-sm">Minor documentation inconsistencies</li>
                <li className="text-sm">Non-critical cookie usage notices</li>
                <li className="text-sm">Recommended policy improvements</li>
              </ul>
            </div>
          </div>
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
            <Button size="sm" className="flex items-center gap-1" onClick={() => handleAction('view-all-actions')}>
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
