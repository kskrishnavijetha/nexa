
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceReport } from '@/utils/types';
import { mockScans } from '@/utils/historyMocks';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ComplianceScanTable from '@/components/dashboard/ComplianceScanTable';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';

const Dashboard: React.FC = () => {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const getWorstRiskLevel = (scan: ComplianceReport): string => {
    if (scan.risks.some(risk => risk.severity === 'high')) return 'high';
    if (scan.risks.some(risk => risk.severity === 'medium')) return 'medium';
    if (scan.risks.some(risk => risk.severity === 'low')) return 'low';
    return 'low';
  };

  const filteredScans = mockScans.filter(scan => {
    if (riskFilter === 'all') return true;
    const worstRiskLevel = getWorstRiskLevel(scan);
    return worstRiskLevel === riskFilter.toLowerCase();
  });

  const handlePreviewReport = (report: ComplianceReport) => {
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance Dashboard</h1>
      
      <DashboardHeader
        riskFilter={riskFilter}
        setRiskFilter={setRiskFilter}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance Scan Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ComplianceScanTable 
            scans={filteredScans} 
            onPreview={handlePreviewReport} 
          />
        </CardContent>
      </Card>

      <DocumentPreview 
        report={selectedReport}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
