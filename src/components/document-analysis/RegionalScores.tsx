
import React from 'react';
import { ComplianceReport, Industry, INDUSTRY_REGULATIONS, REGION_REGULATIONS } from '@/utils/types';

interface RegionalScoresProps {
  report: ComplianceReport;
}

const RegionalScores: React.FC<RegionalScoresProps> = ({ report }) => {
  if (!report.regionScores || Object.keys(report.regionScores).length === 0) {
    return null;
  }
  
  // Get industry-specific regulations
  const industryRegulations = report.industry ? 
    INDUSTRY_REGULATIONS[report.industry as Industry] || [] : 
    [];
  
  // Filter region scores to only show those relevant to the industry
  const filteredRegionScores: Record<string, number> = {};
  
  Object.entries(report.regionScores).forEach(([regulation, score]) => {
    // Include score if it's relevant to this industry or if we're showing all scores
    if (industryRegulations.includes(regulation) || report.industry === 'Global') {
      filteredRegionScores[regulation] = score;
    }
  });
  
  // If no relevant scores after filtering, don't show the section
  if (Object.keys(filteredRegionScores).length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Regional Compliance Scores</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(filteredRegionScores).map(([regulation, score]) => (
          <div key={regulation} className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-blue-700">{regulation}</p>
            <p className="text-2xl font-bold text-blue-900">{score}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalScores;
