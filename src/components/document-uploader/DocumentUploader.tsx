
import React, { useState } from 'react';
import { ComplianceReport, Region, Industry } from '@/utils/types';
import FileDropzone from './FileDropzone';
import IndustrySelector from './IndustrySelector';
import RegionSelector from './RegionSelector';
import UploadActions from './UploadActions';
import UploadProgress from './UploadProgress';
import { ComplianceFrameworkSelector } from '@/components/compliance-frameworks/ComplianceFrameworkSelector';
import { useComplianceFrameworks } from '@/contexts/ComplianceFrameworkContext';

interface DocumentUploaderProps {
  onReport: (report: ComplianceReport) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onReport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { selectedFrameworks, setSelectedFrameworks } = useComplianceFrameworks();

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !industry || !region) {
      return;
    }

    setIsUploading(true);
    setIsProcessing(false);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(true);
          return 100;
        }
        return newProgress;
      });
    }, 300);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate dummy report data
      const dummyReport: ComplianceReport = {
        id: `report-${Date.now()}`,
        documentName: file.name,
        uploadDate: new Date().toISOString(),
        industry,
        region,
        frameworks: selectedFrameworks,
        scores: {
          overall: Math.floor(Math.random() * 40) + 60,
          data: Math.floor(Math.random() * 40) + 60,
          privacy: Math.floor(Math.random() * 40) + 60,
          security: Math.floor(Math.random() * 40) + 60,
        },
        status: 'completed',
        userId: 'current-user',
      };
      
      // Pass the report to parent component
      onReport(dummyReport);
      
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <div className="bg-card rounded-lg border p-6 shadow-sm">
      <FileDropzone 
        onFileSelected={handleFileSelected} 
        selectedFile={file} 
        disabled={isUploading} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <IndustrySelector 
          industry={industry} 
          setIndustry={setIndustry} 
          disabled={isUploading}
        />
        
        <RegionSelector 
          region={region} 
          setRegion={setRegion} 
          disabled={isUploading} 
        />
      </div>
      
      <div className="mt-6">
        <ComplianceFrameworkSelector 
          selectedFrameworks={selectedFrameworks} 
          onFrameworksChange={setSelectedFrameworks}
          disabled={isUploading} 
        />
      </div>
      
      {isUploading ? (
        <UploadProgress 
          progress={uploadProgress} 
          isUploading={isUploading} 
          isProcessing={isProcessing} 
        />
      ) : (
        <UploadActions 
          onUpload={handleUpload} 
          isDisabled={!file || !industry || !region || selectedFrameworks.length === 0}
        />
      )}
    </div>
  );
};

export default DocumentUploader;
