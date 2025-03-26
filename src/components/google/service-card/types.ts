
export interface ServiceCardProps {
  serviceId: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isConnected: boolean;
  isConnecting: boolean;
  isScanning: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export interface ServiceHelperTexts {
  actionButtonText: string;
  uploadDialogTitle: string;
  uploadDialogDescription: string;
  submitButtonText: string;
}

export type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';

export interface ActionButtonsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isUploading?: boolean;
  handleConnect: () => void;
  handleUpload?: () => void;
  actionButtonText: string;
  connectVariant?: ButtonVariant;
  uploadVariant?: ButtonVariant;
}
