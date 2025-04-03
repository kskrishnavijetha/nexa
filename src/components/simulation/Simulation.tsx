
import React from 'react';
import { ComplianceReport } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Radar } from 'lucide-react';
import SimulationWrapper from './SimulationWrapper';

interface SimulationProps {
  report: ComplianceReport;
}

const Simulation: React.FC<SimulationProps> = ({ report }) => {
  if (!report) {
    console.error("Simulation component received undefined report");
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <Radar className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Scenario Simulation & Predictive Analytics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No report data available for simulation. Please complete a compliance scan first.
          </p>
        </CardContent>
      </Card>
    );
  }

  console.log("Simulation component received report:", report);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Radar className="h-5 w-5 text-primary mr-2" />
          <CardTitle>Scenario Simulation & Predictive Analytics</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Simulate potential changes in compliance policies to predict future risks and assess the impact of regulatory changes.
        </p>
        
        <SimulationWrapper report={report} />
      </CardContent>
    </Card>
  );
};

export default Simulation;
