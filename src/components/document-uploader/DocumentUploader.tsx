
import React, { useState } from 'react';
import { ComplianceReport, Industry, Region } from '@/utils/apiService';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import FileDropzone from './FileDropzone';
import IndustrySelector from './IndustrySelector';
import RegionSelector from './RegionSelector';
import UploadProgress from './UploadProgress';
import UploadActions from './UploadActions';

interface DocumentUploaderProps {
  onReportGenerated: (report: ComplianceReport) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onReportGenerated }) => {
  const {
    file,
    setFile,
    industry,
    setIndustry,
    isDragging,
    setIsDragging,
    isUploading,
    isProcessing,
    progress,
    handleUpload
  } = useDocumentUpload(onReportGenerated);
  
  const [region, setRegion] = useState<Region | undefined>();

  return (
    <div className="w-full max-w-md mx-auto">
      <FileDropzone
        file={file}
        setFile={setFile}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      
      <div className="flex flex-col items-center mt-4">
        <IndustrySelector
          industry={industry}
          setIndustry={setIndustry}
        />
        
        <RegionSelector
          region={region}
          setRegion={setRegion}
        />
        
        <UploadProgress
          isUploading={isUploading}
          isProcessing={isProcessing}
          progress={progress}
        />
        
        <div className="mt-6 flex gap-3 justify-center">
          <UploadActions
            file={file}
            industry={industry}
            region={region}
            isUploading={isUploading}
            isProcessing={isProcessing}
            onUpload={() => handleUpload(region)}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
