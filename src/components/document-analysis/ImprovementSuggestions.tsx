
import React from 'react';
import { ComplianceReport, Suggestion } from '@/utils/types';

interface ImprovementSuggestionsProps {
  report: ComplianceReport;
}

const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({ report }) => {
  if (!report.suggestions || report.suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Improvement Suggestions</h3>
      <ul className="space-y-2">
        {report.suggestions.map((suggestion, index) => (
          <li key={index} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            {suggestion.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImprovementSuggestions;
