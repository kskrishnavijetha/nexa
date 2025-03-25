
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportedLanguage } from '@/utils/language';
import { FileText, Calendar } from 'lucide-react';
import { ComplianceReport as ComplianceReportType } from '@/utils/apiService';
import ReportDetailsTab from './tabs/ReportDetailsTab';
import PredictiveTab from './tabs/PredictiveTab';
import ScheduleTab from './tabs/ScheduleTab';
import LanguageSelector from '../common/LanguageSelector';

interface ReportTabsProps {
  report: ComplianceReportType;
  onClose: () => void;
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ 
  report, 
  onClose,
  language,
  setLanguage
}) => {
  return (
    <Tabs defaultValue="report" className="w-full">
      <div className="px-6 pt-6 flex justify-between items-center">
        <TabsList className="grid w-[calc(100%-60px)] grid-cols-3">
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
        
        <LanguageSelector 
          currentLanguage={language} 
          onLanguageChange={setLanguage}
          variant="subtle"
        />
      </div>
      
      <TabsContent value="report">
        <ReportDetailsTab report={report} onClose={onClose} language={language} />
      </TabsContent>
      
      <TabsContent value="predictive">
        <PredictiveTab report={report} />
      </TabsContent>
      
      <TabsContent value="schedule">
        <ScheduleTab report={report} />
      </TabsContent>
    </Tabs>
  );
};

export default ReportTabs;
