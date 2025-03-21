
import React from 'react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import { FileText, Calendar } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ScheduleScanner from './ScheduleScanner';
import ReportHeader from './report/ReportHeader';
import ComplianceDetailsTab from './report/ComplianceDetailsTab';
import PredictiveAnalytics from './predictive/PredictiveAnalytics';

interface ComplianceReportProps {
  report: ComplianceReportType;
  onClose: () => void;
}

const ComplianceReport: React.FC<ComplianceReportProps> = ({ report, onClose }) => {
  return (
    <div className="animate-fade-up bg-background rounded-xl border shadow-soft overflow-hidden max-w-3xl w-full mx-auto">
      <ReportHeader report={report} />
      
      <Tabs defaultValue="report" className="w-full">
        <div className="px-6 pt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="report">
              <FileText className="w-4 h-4 mr-2" />
              Report Details
            </TabsTrigger>
            <TabsTrigger value="predictive">
              <FileText className="w-4 h-4 mr-2" />
              AI Predictions
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Scans
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="report">
          <ComplianceDetailsTab report={report} onClose={onClose} />
        </TabsContent>
        
        <TabsContent value="predictive" className="p-6 pt-4">
          <PredictiveAnalytics report={report} />
        </TabsContent>
        
        <TabsContent value="schedule" className="p-6 pt-4">
          <ScheduleScanner 
            documentId={report.documentId} 
            documentName={report.documentName}
            industry={report.industry}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceReport;
