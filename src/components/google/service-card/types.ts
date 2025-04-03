
import { LucideIcon } from "lucide-react";
import { GoogleService } from "../types";
import { ButtonProps } from "@/components/ui/button";

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
  isCompactView?: boolean;
}

export interface ActionButtonsProps {
  isConnected: boolean;
  isConnecting: boolean;
  isUploading?: boolean;
  isScanned?: boolean;
  fileUploaded?: string;
  handleConnect: () => void;
  handleUpload?: () => void;
  handleDownload?: () => void;
  actionButtonText: string;
  connectVariant?: ButtonProps["variant"];
  uploadVariant?: ButtonProps["variant"];
  downloadVariant?: ButtonProps["variant"];
  isCompactView?: boolean;
}

export interface UploadProps {
  serviceId: string;
  onUploadComplete: (fileName: string) => void;
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
  onSubmit: (formData: any) => void;
  serviceId: string;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
}

export interface GoogleDocsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  dialogTitle: string;
  dialogDescription: string;
  submitButtonText: string;
}

export interface HelperTexts {
  actionButtonText: string;
  uploadDialogTitle: string;
  uploadDialogDescription: string;
  submitButtonText: string;
}

export interface ServiceHelperTexts {
  actionButtonText: string;
  uploadDialogTitle: string;
  uploadDialogDescription: string;
  submitButtonText: string;
}
