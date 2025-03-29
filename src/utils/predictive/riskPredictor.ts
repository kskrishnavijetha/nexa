
import { ComplianceReport, RiskItem, Industry } from '../types';
import { RiskPrediction } from './types';

// Simple ML model that predicts risks based on historical data
export const predictRisks = (
  reports: ComplianceReport[], 
  industry?: Industry
): RiskPrediction[] => {
  // In a real implementation, this would use actual ML algorithms
  // For now, we'll use a simplified approach based on frequency analysis
  
  // Extract all risks from historical reports and convert to RiskItem
  const allRisks: RiskItem[] = reports.flatMap(report => 
    report.risks.map(risk => ({
      id: risk.id || `risk-${Math.random().toString(36).substring(2, 9)}`,
      title: risk.title,
      name: risk.title, // Adding name from title to satisfy RiskItem
      description: risk.description,
      severity: risk.severity,
      regulation: risk.regulation,
      likelihood: 0.5, // Default likelihood since it's not in ComplianceRisk
      section: risk.section,
      mitigation: risk.mitigation
    }))
  );
  
  // Count occurrences of each risk by description
  const riskCounts: Record<string, { count: number, items: RiskItem[] }> = {};
  
  allRisks.forEach(risk => {
    const key = `${risk.description}-${risk.regulation}`;
    if (!riskCounts[key]) {
      riskCounts[key] = { count: 0, items: [] };
    }
    riskCounts[key].count += 1;
    riskCounts[key].items.push(risk);
  });
  
  // Convert to predictions sorted by frequency
  return Object.entries(riskCounts)
    .map(([key, { count, items }]) => {
      const risk = items[0]; // Use the first occurrence for details
      const totalReports = reports.length;
      const probability = (count / totalReports) * 100;
      
      // Determine trend based on recent reports
      const recentReports = reports.slice(0, Math.min(3, reports.length));
      const recentOccurrences = recentReports.filter(report => 
        report.risks.some(r => r.description === risk.description && r.regulation === risk.regulation)
      ).length;
      
      let trend: 'increasing' | 'stable' | 'decreasing';
      if (recentOccurrences > (recentReports.length / 2)) {
        trend = 'increasing';
      } else if (recentOccurrences === 0) {
        trend = 'decreasing';
      } else {
        trend = 'stable';
      }
      
      return {
        riskType: risk.description,
        probability: Math.min(Math.round(probability), 100),
        regulation: risk.regulation,
        severity: risk.severity,
        trend
      };
    })
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 8); // Return top 8 risks
};
