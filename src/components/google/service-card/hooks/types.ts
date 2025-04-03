
import { GoogleService } from '../../types';

export interface ServiceCardStateProps {
  serviceId: string;
  isConnected: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export interface UploadFormData {
  file?: File;
  emailContent?: string;
  docTitle?: string;
}

export interface ServiceCardState {
  lastUpdated: Date;
  isRealTimeActive: boolean;
  realtimeTimer: number | null;
  showAuthDialog: boolean;
  showUploadDialog: boolean;
  showGoogleDocsDialog: boolean;
  isUploading: boolean;
  hasScannedContent: boolean;
  uploadedFile: UploadedFileInfo | null;
}

export interface UploadedFileInfo {
  name: string;
  type: string;
  size: number;
}

export interface ServiceCardActions {
  toggleRealTime: () => void;
  handleConnect: () => void;
  handleAuth: () => void;
  handleUpload: () => void;
  handleUploadSubmit: (formData: any) => void;
  handleGoogleDocsSubmit: (formData: any) => void;
  handleDownload: () => void;
  setShowAuthDialog: (show: boolean) => void;
  setShowUploadDialog: (show: boolean) => void;
  setShowGoogleDocsDialog: (show: boolean) => void;
}

export type ServiceCardStateReturn = ServiceCardState & ServiceCardActions;
