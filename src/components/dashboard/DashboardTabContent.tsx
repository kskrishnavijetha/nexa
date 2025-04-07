
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import ActionItems from '@/components/dashboard/ActionItems';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import { useSelectedReport } from './RecentScans';
import ComplianceDetailsTab from '@/components/report/ComplianceDetailsTab';
import RiskSummary from './RiskSummary';

interface DashboardTabContentProps {
  activeTab: string;
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const { selectedReport } = useSelectedReport();
  
  useEffect(() => {
    const loadReports = () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        setReports(userReports);
      }
    };
    
    loadReports();
  }, [user]);

  if (activeTab === 'compliance') {
    // Render real compliance details
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Details</CardTitle>
          <CardDescription>
            {selectedReport ? 
              `Detailed breakdown for ${selectedReport.documentName}` : 
              'Detailed breakdown of your compliance status across regulations'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <>
              {selectedReport ? (
                // Show specific compliance details using the ComplianceDetailsTab component
                <ComplianceDetailsTab 
                  report={selectedReport} 
                  onClose={() => {}} 
                  language="en"
                />
              ) : (
                // Show overall compliance scores
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">GDPR</h3>
                      <div className="text-2xl font-bold">
                        {Math.round(reports.reduce((sum, report) => sum + (report.gdprScore || 0), 0) / reports.length)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on {reports.length} document(s)
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">HIPAA</h3>
                      <div className="text-2xl font-bold">
                        {Math.round(reports.reduce((sum, report) => sum + (report.hipaaScore || 0), 0) / reports.length)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on {reports.length} document(s)
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-md">
                      <h3 className="font-medium mb-2">SOC2</h3>
                      <div className="text-2xl font-bold">
                        {Math.round(reports.reduce((sum, report) => sum + (report.soc2Score || 0), 0) / reports.length)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on {reports.length} document(s)
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Recent Compliance Changes</h3>
                    <ul className="space-y-2">
                      {reports.slice(0, 3).map((report) => (
                        <li key={report.documentId} className="text-sm">
                          {report.documentName} - {report.overallScore}% compliance score
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Perform document scans to see your compliance details.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'risks') {
    // Show risk summary for the selected document
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>
            {selectedReport ? 
              `Risk analysis for ${selectedReport.documentName}` : 
              'Comprehensive view of identified risks and their severity'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RiskSummary selectedReport={selectedReport} />
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
              <CardTitle>
                {selectedReport ? 
                  `Action Items for ${selectedReport.documentName}` : 
                  'Action Items'}
              </CardTitle>
              <CardDescription>
                {selectedReport ? 
                  `Tasks that need attention to improve compliance for this document` : 
                  'Tasks that need your attention to improve compliance'}
              </CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-1">
              <span>View All</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ActionItems selectedReport={selectedReport} />
        </CardContent>
      </Card>
    );
  }

  // Default to overview tab content
  return null;
};

export default DashboardTabContent;
