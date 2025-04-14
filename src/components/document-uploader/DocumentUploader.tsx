
import React, { useState } from 'react';
import { ComplianceReport, Industry, Region } from '@/utils/apiService';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import FileDropzone from './FileDropzone';
import IndustrySelector from './IndustrySelector';
import RegionSelector from './RegionSelector';
import UploadProgress from './UploadProgress';
import UploadActions from './UploadActions';
import ComplianceFrameworkSelector from '../compliance-frameworks/ComplianceFrameworkSelector';
import { useComplianceFrameworks } from '@/contexts/ComplianceFrameworkContext';

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
  const { selectedFrameworks, setSelectedFrameworks } = useComplianceFrameworks();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FileDropzone
        file={file}
        setFile={setFile}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
      />
      
      <div className="flex flex-col mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IndustrySelector
            industry={industry}
            setIndustry={setIndustry}
          />
          
          <RegionSelector
            region={region}
            setRegion={setRegion}
          />
        </div>
        
        <ComplianceFrameworkSelector 
          selectedFrameworks={selectedFrameworks}
          onFrameworksChange={setSelectedFrameworks}
          disabled={isUploading || isProcessing}
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
            frameworks={selectedFrameworks}
            isUploading={isUploading}
            isProcessing={isProcessing}
            onUpload={() => handleUpload(region, selectedFrameworks)}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
