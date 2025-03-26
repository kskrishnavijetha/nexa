
import { ComplianceReport } from '../types';

// Generate synthetic historical reports based on real data
export const generateSyntheticReports = (currentReport: ComplianceReport, count: number = 3): ComplianceReport[] => {
  return Array(count).fill(0).map((_, i) => {
    const randomFactor = 0.9 + (Math.random() * 0.2); // between 0.9 and 1.1
    const timestamp = new Date();
    timestamp.setMonth(timestamp.getMonth() - (i + 1));
    
    return {
      ...JSON.parse(JSON.stringify(currentReport)), // Deep copy
      documentId: `synthetic-${i}`,
      timestamp: timestamp.toISOString(),
      overallScore: Math.min(100, Math.max(0, Math.round(currentReport.overallScore * randomFactor))),
      gdprScore: Math.min(100, Math.max(0, Math.round(currentReport.gdprScore * randomFactor))),
      hipaaScore: Math.min(100, Math.max(0, Math.round(currentReport.hipaaScore * randomFactor))),
      soc2Score: Math.min(100, Math.max(0, Math.round(currentReport.soc2Score * randomFactor))),
      pciDssScore: currentReport.pciDssScore 
        ? Math.min(100, Math.max(0, Math.round(currentReport.pciDssScore * randomFactor)))
        : undefined
    };
  });
};

// Generate a new random report based on typical values
export const generateRandomReport = (): ComplianceReport => {
  return {
    id: `generated-${Date.now()}`,
    documentId: `generated-${Date.now()}`,
    documentName: `Auto Report ${new Date().toLocaleDateString()}`,
    timestamp: new Date().toISOString(),
    overallScore: 60 + Math.floor(Math.random() * 40),
    gdprScore: 60 + Math.floor(Math.random() * 40),
    hipaaScore: 60 + Math.floor(Math.random() * 40),
    soc2Score: 60 + Math.floor(Math.random() * 40),
    risks: [
      { 
        id: `risk-${Date.now()}-1`, 
        description: 'Automatically detected compliance issue', 
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low', 
        regulation: Math.random() > 0.6 ? 'GDPR' : Math.random() > 0.3 ? 'HIPAA' : 'SOC 2' 
      },
    ],
    summary: 'Automatically generated compliance report based on standard patterns',
  };
};
