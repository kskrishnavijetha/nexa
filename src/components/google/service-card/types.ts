
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
