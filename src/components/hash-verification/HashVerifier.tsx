
import React from 'react';
import { toast } from 'sonner';
import { useHashVerification } from './hooks/useHashVerification';
import HashUploadSection from './HashUploadSection';
import HashCompareSection from './HashCompareSection';
import HashComparisonResult from './HashComparisonResult';
import SecurityNotice from './SecurityNotice';

const HashVerifier = () => {
  const {
    file,
    computedHash,
    compareMethod,
    pastedHash,
    setPastedHash,
    selectedDocumentId,
    setSelectedDocumentId,
    recentDocuments,
    isVerifying,
    verificationResult,
    isLoading,
    setCompareMethod,
    handleFileSelection,
    handleVerification
  } = useHashVerification();

  const handleDownloadReport = () => {
    // In a real implementation, this would generate and download a PDF report
    toast.info('Generating verification report...');
  };

  return (
    <div className="space-y-8">
      <HashUploadSection 
        file={file}
        computedHash={computedHash}
        onFileSelect={handleFileSelection}
      />

      {computedHash && (
        <>
          <HashCompareSection 
            compareMethod={compareMethod}
            setCompareMethod={setCompareMethod}
            pastedHash={pastedHash}
            setPastedHash={setPastedHash}
            selectedDocumentId={selectedDocumentId}
            setSelectedDocumentId={setSelectedDocumentId}
            recentDocuments={recentDocuments}
            isLoading={isLoading}
            computedHash={computedHash}
            isVerifying={isVerifying}
            onVerify={handleVerification}
          />

          {verificationResult && verificationResult !== 'pending' && (
            <HashComparisonResult 
              result={verificationResult} 
              onDownloadReport={handleDownloadReport}
              showAuditTrail={verificationResult === 'match'}
            />
          )}
          
          <SecurityNotice />
        </>
      )}
    </div>
  );
};

export default HashVerifier;
