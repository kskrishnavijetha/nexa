
import React from 'react';
import { ComplianceReport } from '@/utils/apiService';

interface ReportDetailsProps {
  report: ComplianceReport;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report }) => {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Summary</h3>
        <p className="text-slate-700">{report.summary}</p>
      </div>
      
      {report.suggestions && report.suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Improvement Suggestions</h3>
          <ul className="space-y-2">
            {report.suggestions.map((suggestion, index) => (
              <li key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Compliance Issues</h3>
        <div className="space-y-3">
          {report.risks.map((risk, index) => (
            <div 
              key={index} 
              className={`p-4 rounded border-l-4 ${
                risk.severity === 'high' ? 'border-red-500 bg-red-50' : 
                risk.severity === 'medium' ? 'border-amber-500 bg-amber-50' : 
                'border-blue-500 bg-blue-50'
              }`}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{risk.description}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  risk.severity === 'high' ? 'bg-red-100 text-red-800' : 
                  risk.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {risk.severity.toUpperCase()}
                </span>
              </div>
              <p className="text-sm mt-1">
                <span className="font-medium">{risk.regulation}</span>
                {risk.section && ` - ${risk.section}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReportDetails;
