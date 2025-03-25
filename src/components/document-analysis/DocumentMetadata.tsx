
import React from 'react';
import { Globe } from 'lucide-react';
import { ComplianceReport } from '@/utils/types';

interface DocumentMetadataProps {
  report: ComplianceReport;
}

const DocumentMetadata: React.FC<DocumentMetadataProps> = ({ report }) => {
  return (
    <div className="mb-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
      {report.industry && (
        <div className="bg-slate-100 p-3 rounded">
          <h3 className="font-medium text-slate-700">Industry: {report.industry}</h3>
          {report.regulations && report.regulations.length > 0 && (
            <p className="text-sm text-slate-600 mt-1">
              Applicable Regulations: {report.regulations.join(', ')}
            </p>
          )}
        </div>
      )}
      
      {report.region && (
        <div className="bg-blue-50 p-3 rounded">
          <h3 className="font-medium text-blue-700 flex items-center">
            <Globe className="h-4 w-4 mr-1" />
            Region: {report.region}
          </h3>
          {report.regionalRegulations && Object.keys(report.regionalRegulations).length > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              Regional Frameworks: {Object.entries(report.regionalRegulations)
                .map(([key, value]) => `${key} (${String(value)})`)
                .join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentMetadata;
