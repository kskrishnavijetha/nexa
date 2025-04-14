
import React from 'react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

interface ComplianceRecommendationsTabProps {
  report: ComplianceReport;
  onClose: () => void;
  language: SupportedLanguage;
}

const ComplianceRecommendationsTab: React.FC<ComplianceRecommendationsTabProps> = ({ 
  report, 
  onClose,
  language = 'en'
}) => {
  return (
    <div className="p-6 pt-4">
      <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
      
      {report.recommendations && report.recommendations.length > 0 ? (
        <div className="space-y-4 mb-6">
          {report.recommendations.map((recommendation, index) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <p>{recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-blue-800">No specific recommendations available.</p>
        </div>
      )}
      
      <div className="flex justify-end mt-8">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ComplianceRecommendationsTab;
