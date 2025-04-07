
import React, { useState, createContext, useContext } from 'react';
import { ComplianceReport } from '@/utils/types';

// Create a context to manage the selected report
interface SelectedReportContextType {
  selectedReport: ComplianceReport | null;
  setSelectedReport: React.Dispatch<React.SetStateAction<ComplianceReport | null>>;
}

const SelectedReportContext = createContext<SelectedReportContextType>({
  selectedReport: null,
  setSelectedReport: () => {},
});

// Custom hook to use the selected report context
export const useSelectedReport = () => useContext(SelectedReportContext);

// Provider component
export const SelectedReportProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  
  return (
    <SelectedReportContext.Provider value={{ selectedReport, setSelectedReport }}>
      {children}
    </SelectedReportContext.Provider>
  );
};
