
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import SimulationWrapper from './SimulationWrapper';
import RiskAnalysis from '@/components/RiskAnalysis';

interface SimulationProps {
  report: ComplianceReport;
}

const Simulation: React.FC<SimulationProps> = ({ report }) => {
  return (
    <SimulationWrapper report={report}>
      {(simulationReport) => (
        <RiskAnalysis 
          risks={simulationReport.risks} 
          documentName={report.documentName} 
          isSimulation={true} 
        />
      )}
    </SimulationWrapper>
  );
};

export default Simulation;
