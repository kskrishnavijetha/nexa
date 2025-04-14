
import React from 'react';
import { ExtendedReport } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Download } from 'lucide-react';
import { ComplianceMatrix } from './preview/ComplianceMatrix';
import { ExecutiveSummary } from './preview/ExecutiveSummary';
import { RemediationSuggestions } from './preview/RemediationSuggestions';
import { AuditTimeline } from './preview/AuditTimeline';

interface ReportPreviewProps {
  report: ExtendedReport;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report }) => {
  const [activeTab, setActiveTab] = React.useState('summary');

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex justify-between items-center pb-2 border-b">
        <div>
          <h3 className="font-semibold text-lg">Report Preview</h3>
          <p className="text-sm text-muted-foreground">
            Preview the sections of your extended audit report
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            Preview Full PDF
          </Button>
        </div>
      </div>
      
      {/* Report Cover Preview */}
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
          {report.config.logoUrl && (
            <img 
              src={report.config.logoUrl} 
              alt="Organization logo" 
              className="mb-4 max-h-20 object-contain" 
            />
          )}
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {report.config.organizationName}
          </h1>
          
          <h2 className="text-xl font-medium text-gray-700 mb-4">
            {report.config.reportTitle}
          </h2>
          
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {report.config.complianceTypes.map((type, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {type}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-gray-600">
            Version {report.config.reportVersion} • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Section Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="summary">Executive Summary</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Matrix</TabsTrigger>
          <TabsTrigger value="timeline">Audit Timeline</TabsTrigger>
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <ExecutiveSummary report={report} />
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-4">
          <ComplianceMatrix report={report} />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <AuditTimeline report={report} />
        </TabsContent>
        
        <TabsContent value="remediation" className="mt-4">
          <RemediationSuggestions report={report} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportPreview;
