
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Download, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HashComparisonResultProps {
  result: 'match' | 'mismatch';
  onDownloadReport: () => void;
  showAuditTrail: boolean;
}

const HashComparisonResult: React.FC<HashComparisonResultProps> = ({ 
  result, 
  onDownloadReport,
  showAuditTrail
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className={`border-l-4 ${
      result === 'match' 
        ? 'border-l-green-500 bg-green-50' 
        : 'border-l-red-500 bg-red-50'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center">
          {result === 'match' ? (
            <CheckCircle2 className="h-12 w-12 text-green-500 mr-4" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500 mr-4" />
          )}
          
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {result === 'match' 
                ? 'Document Verified' 
                : 'Verification Failed'
              }
            </h2>
            <p className={`text-sm ${
              result === 'match' 
                ? 'text-green-700' 
                : 'text-red-700'
            }`}>
              {result === 'match'
                ? '✅ Document is verified and has not been tampered with.'
                : '⚠️ Hash mismatch. This document may have been modified.'
              }
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center"
            onClick={onDownloadReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Verification Report
          </Button>
          
          {showAuditTrail && (
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center"
              onClick={() => navigate('/audit-reports')}
            >
              <History className="h-4 w-4 mr-2" />
              View Audit Trail
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HashComparisonResult;
