
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { ComplianceReport } from '@/utils/types';
import { getUserHistoricalReports } from '@/utils/historyService';

const AuditReports: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      // Use getUserHistoricalReports instead of getHistoricalReports
      const userReports = getUserHistoricalReports(user.id);
      setReports(userReports);
    }
  }, [user]);
  
  const handleViewReport = (documentId: string) => {
    navigate(`/extended-audit-report/${documentId}`);
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Audit Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.documentId} 
                  className="p-4 border rounded-md flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{report.documentName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(report.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewReport(report.documentId)}
                  >
                    View Report
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No audit reports available</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/document-analysis')}
              >
                Analyze Document
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReports;
