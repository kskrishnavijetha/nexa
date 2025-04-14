
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import ReportGenerator from '@/components/audit/extended-report/ReportGenerator';
import { toast } from 'sonner';
import { ComplianceReport, Industry } from '@/utils/types';
import { useAuth } from '@/contexts/AuthContext';

const ExtendedAuditReport: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!documentId) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">No Document Selected</h2>
              <p className="mb-4">Please select a document from your history to generate an extended audit report.</p>
              <button 
                className="btn bg-primary text-white px-4 py-2 rounded"
                onClick={() => navigate('/history')}
              >
                Go to History
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ReportGenerator documentId={documentId} />
    </div>
  );
};

export default ExtendedAuditReport;
