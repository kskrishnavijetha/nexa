
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ComplianceFrameworkContextProps {
  selectedFrameworks: string[];
  setSelectedFrameworks: (frameworks: string[]) => void;
}

const ComplianceFrameworkContext = createContext<ComplianceFrameworkContextProps | undefined>(undefined);

export const ComplianceFrameworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with GDPR, SOC2, and HIPAA as default frameworks
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['GDPR', 'SOC2', 'HIPAA']);

  return (
    <ComplianceFrameworkContext.Provider value={{ selectedFrameworks, setSelectedFrameworks }}>
      {children}
    </ComplianceFrameworkContext.Provider>
  );
};

export const useComplianceFrameworks = (): ComplianceFrameworkContextProps => {
  const context = useContext(ComplianceFrameworkContext);
  if (context === undefined) {
    throw new Error('useComplianceFrameworks must be used within a ComplianceFrameworkProvider');
  }
  return context;
};
