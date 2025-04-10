
import React from 'react';
import { GoogleServicesScannerProps } from './types';
import { useGoogleAuth } from '@/hooks/google/useGoogleAuth';
import GoogleScannerContent from './scanner/GoogleScannerContent';

const GoogleServicesScanner: React.FC<GoogleServicesScannerProps> = ({
  industry,
  region,
  language,
  file,
  persistedConnectedServices = [],
  onServicesUpdate,
  isCompactView = false
}) => {
  const { gApiInitialized, apiLoading, apiError, retryInitialization } = useGoogleAuth();
  const [uploadedFileName, setUploadedFileName] = React.useState<string | undefined>(file?.name);
  
  React.useEffect(() => {
    if (file?.name) {
      setUploadedFileName(file.name);
    }
  }, [file]);

  React.useEffect(() => {
    const handleFileUploaded = (e: any) => {
      if (e.detail && e.detail.fileName) {
        setUploadedFileName(e.detail.fileName);
        console.log('File uploaded event detected:', e.detail.fileName);
      }
    };
    
    window.addEventListener('file-uploaded', handleFileUploaded);
    return () => {
      window.removeEventListener('file-uploaded', handleFileUploaded);
    };
  }, []);

  return (
    <div className="space-y-6">
      <GoogleScannerContent
        industry={industry}
        region={region}
        language={language}
        file={file}
        persistedConnectedServices={persistedConnectedServices}
        onServicesUpdate={onServicesUpdate}
        isCompactView={isCompactView}
        uploadedFileName={uploadedFileName}
        isApiLoading={apiLoading}
        apiError={apiError}
        gApiInitialized={gApiInitialized}
        retryInitialization={retryInitialization}
      />
    </div>
  );
};

export default GoogleServicesScanner;
