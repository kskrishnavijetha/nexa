
import { useState, useEffect } from 'react';
import { GoogleServicesScannerProps } from '../../types';
import { GoogleService } from '../../types';
import { useServiceScanner } from '@/hooks/useServiceScanner';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { useGoogleServiceConnections } from '@/hooks/useGoogleServiceConnections';
import { SupportedLanguage } from '@/utils/language';

interface UseScannerStateProps extends Omit<GoogleServicesScannerProps, 'onServicesUpdate'> {
  uploadedFileName?: string;
  persistedConnectedServices: GoogleService[];
  onServicesUpdate?: (services: GoogleService[]) => void;
}

export const useScannerState = ({
  industry,
  region,
  language,
  file,
  uploadedFileName,
  persistedConnectedServices,
  onServicesUpdate
}: UseScannerStateProps) => {
  const [activeTab, setActiveTab] = useState('connect');
  const [fileName, setFileName] = useState<string | undefined>(uploadedFileName || file?.name);

  const {
    isConnectingDrive,
    isConnectingGmail,
    isConnectingDocs,
    connectedServices,
    setConnectedServices,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleDisconnect
  } = useGoogleServiceConnections();

  const { addScanHistory } = useServiceHistoryStore();

  const {
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    selectedIndustry,
    handleScan
  } = useServiceScanner();

  useEffect(() => {
    if (persistedConnectedServices.length > 0) {
      setConnectedServices(persistedConnectedServices);
    }
  }, [persistedConnectedServices, setConnectedServices]);

  useEffect(() => {
    if (onServicesUpdate) {
      onServicesUpdate(connectedServices);
    }
  }, [connectedServices, onServicesUpdate]);

  useEffect(() => {
    if (file?.name) {
      setFileName(file.name);
    }
  }, [file]);

  useEffect(() => {
    if (uploadedFileName) {
      setFileName(uploadedFileName);
    }
  }, [uploadedFileName]);

  useEffect(() => {
    const handleFileUploaded = (e: any) => {
      if (e.detail && e.detail.fileName) {
        setFileName(e.detail.fileName);
        console.log('File uploaded event detected:', e.detail.fileName);
      }
    };
    
    window.addEventListener('file-uploaded', handleFileUploaded);
    return () => {
      window.removeEventListener('file-uploaded', handleFileUploaded);
    };
  }, []);

  const handleStartScan = async (
    services: GoogleService[],
    selectedIndustry: typeof industry,
    selectedLanguage?: SupportedLanguage,
    selectedRegion = region
  ) => {
    await handleScan(services, selectedIndustry, selectedLanguage, selectedRegion);
    
    if (scanResults) {
      const documentName = fileName || 'Cloud Services Scan';
      
      addScanHistory({
        serviceId: services.join('-'),
        serviceName: services.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', '),
        scanDate: new Date().toISOString(),
        itemsScanned: itemsScanned,
        violationsFound: violationsFound,
        documentName: documentName,
        fileName: fileName || (file ? file.name : 'multiple services')
      });
      
      console.log('Scan completed and added to history:', documentName);
    }
  };

  return {
    activeTab,
    setActiveTab,
    fileName,
    isScanning,
    scanResults,
    lastScanTime,
    itemsScanned,
    violationsFound,
    selectedIndustry,
    handleStartScan,
    connectedServices,
    isConnectingDrive,
    isConnectingGmail,
    isConnectingDocs,
    handleConnectDrive,
    handleConnectGmail,
    handleConnectDocs,
    handleDisconnect
  };
};
