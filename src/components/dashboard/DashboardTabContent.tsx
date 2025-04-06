
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import ActionItems from '@/components/dashboard/ActionItems';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';

interface DashboardTabContentProps {
  activeTab: string;
}

const DashboardTabContent: React.FC<DashboardTabContentProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  
  useEffect(() => {
    const loadReports = () => {
      if (user?.uid) {
        const userReports = getUserHistoricalReports(user.uid);
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
            Detailed breakdown of your compliance status across regulations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
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
                  {reports.slice(0, 3).map((report, index) => (
                    <li key={report.documentId} className="text-sm">
                      {report.documentName} - {report.overallScore}% compliance score
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Perform document scans to see your compliance details.</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (activeTab === 'risks') {
    // Render real risks assessment
    return (
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>
            Comprehensive view of identified risks and their severity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.flatMap(report => 
                report.risks.slice(0, 5).map((risk, riskIndex) => (
                  <div 
                    key={`${report.documentId}-${riskIndex}`}
                    className="border p-3 rounded-md hover:bg-slate-50"
                  >
                    <div className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        risk.severity === 'high' ? 'bg-red-500' : 
                        risk.severity === 'medium' ? 'bg-amber-500' : 
                        'bg-green-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{risk.title}</h4>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">
                            {report.documentName}
                          </span>
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded ml-2">
                            {risk.regulation || 'General'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ).slice(0, 5)}
              
              {reports.flatMap(report => report.risks).length > 5 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                >
                  View All Risks
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Perform document scans to see your risk assessment.</p>
          )}
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
