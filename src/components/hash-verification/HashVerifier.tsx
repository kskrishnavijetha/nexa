
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

  // Get the comparison hash based on the selected method
  const getComparisonHash = () => {
    if (compareMethod === 'paste') {
      return pastedHash;
    } else {
      const selectedDoc = recentDocuments.find(doc => doc.id === selectedDocumentId);
      return selectedDoc?.hash || '';
    }
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
              onDownloadReport={() => {}} // This is now handled internally in the component
              showAuditTrail={verificationResult === 'match'}
              file={file}
              computedHash={computedHash}
              comparisonHash={getComparisonHash()}
            />
          )}
          
          <SecurityNotice />
        </>
      )}
    </div>
  );
};

export default HashVerifier;
