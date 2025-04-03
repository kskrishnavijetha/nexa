
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { GoogleService } from '../types';

export interface ServiceCardProps {
  serviceId: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export interface ActionButtonsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isUploading: boolean;
  isScanned: boolean;
  fileUploaded?: string;
  handleConnect: () => void;
  handleUpload: () => void;
  handleDownload: () => void;
  actionButtonText: {
    connect: string;
    upload: string;
    download: string;
  };
  connectVariant: 'default' | 'outline' | 'secondary';
  uploadVariant: 'default' | 'outline' | 'secondary';
  downloadVariant: 'default' | 'outline' | 'secondary';
}

export interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
}

export interface UploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  serviceId: string;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
}

export interface GoogleDocsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (documentId: string) => void;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
}

export interface RealTimeMonitorProps {
  isActive: boolean;
  lastUpdated?: string;
}

export interface ServiceCardHeaderProps {
  icon: LucideIcon;
  title: string;
  isConnected: boolean;
  isRealTimeActive: boolean;
  toggleRealTime: () => void;
}
