
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import SimulationWrapper from './SimulationWrapper';

interface SimulationProps {
  report: ComplianceReport;
}

const Simulation: React.FC<SimulationProps> = ({ report }) => {
  return (
    <div>
      <SimulationWrapper report={report} />
    </div>
  );
};

export default Simulation;
