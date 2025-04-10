
import React, { createContext, useContext } from 'react';
import { ComplianceReport } from '@/utils/apiService';

interface ReportContextType {
  report: ComplianceReport;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ report: ComplianceReport; children: React.ReactNode }> = ({ 
  report, 
  children 
}) => {
  return (
    <ReportContext.Provider value={{ report }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
};
