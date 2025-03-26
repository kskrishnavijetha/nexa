
// Simulation scenario type
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  regulationChanges: {
    regulation: string;
    changeType: 'stricter' | 'updated' | 'relaxed' | 'new';
    impactLevel: 'high' | 'medium' | 'low';
  }[];
  impact: {
    gdprScore: number;
    hipaaScore: number;
    soc2Score: number;
    pciDssScore?: number;
    overallScore: number;
  };
}
