
import { ComplianceReport } from '../types';

// Mock data for historical scans - in a real implementation, this would come from an API or database
export const mockHistoricalScans: ComplianceReport[] = [
  // Historical scan data would be fetched from an API in a real implementation
  // This is just mock data for demonstration purposes
];

// Generate synthetic historical reports if needed
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
