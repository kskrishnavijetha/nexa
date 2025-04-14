
import React from 'react';
import { Button } from '@/components/ui/button';
import { ComplianceReport } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

interface ComplianceRisksTabProps {
  report: ComplianceReport;
  onClose: () => void;
  language: SupportedLanguage;
}

const ComplianceRisksTab: React.FC<ComplianceRisksTabProps> = ({ 
  report, 
  onClose,
  language = 'en'
}) => {
  return (
    <div className="p-6 pt-4">
      <h2 className="text-2xl font-bold mb-4">Compliance Risks</h2>
      
      {report.risks.length > 0 ? (
        <div className="space-y-4 mb-6">
          {report.risks.map((risk, index) => (
            <div key={index} className="border p-4 rounded-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{risk.title}</h3>
                  <p className="text-muted-foreground">{risk.description}</p>
                  {risk.mitigation && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Mitigation:</h4>
                      <p className="text-sm">{risk.mitigation}</p>
                    </div>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  risk.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                  risk.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {risk.severity}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-green-50 p-4 rounded-md mb-6">
          <p className="text-green-800">No compliance risks detected.</p>
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

export default ComplianceRisksTab;
