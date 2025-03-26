
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ComplianceReport } from '@/utils/types';
import { FileText } from 'lucide-react';

interface DocumentPreviewProps {
  report: ComplianceReport | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ report, isOpen, onClose }) => {
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {report.documentName} - Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto mt-4 border rounded-md p-4 bg-slate-50">
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-2">Document Overview</h3>
              <p>{report.summary}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <h4 className="font-medium text-sm text-slate-500 mb-1">Overall Compliance</h4>
                <p className="text-2xl font-bold">{report.overallScore}%</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <h4 className="font-medium text-sm text-slate-500 mb-1">Industry</h4>
                <p className="text-lg">{report.industry || 'Not specified'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Compliance Issues</h3>
              <ul className="space-y-2">
                {report.risks.map((risk, idx) => (
                  <li key={idx} className={`p-3 rounded border-l-4 ${
                    risk.severity === 'high' ? 'border-red-500 bg-red-50' :
                    risk.severity === 'medium' ? 'border-orange-500 bg-orange-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <span className="font-semibold">{risk.regulation}: </span>
                    {risk.description}
                  </li>
                ))}
              </ul>
            </div>
            
            {report.suggestions && report.suggestions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Suggestions</h3>
                <ul className="space-y-2">
                  {report.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
