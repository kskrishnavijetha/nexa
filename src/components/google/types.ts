
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

export type GoogleService = 'drive' | 'gmail' | 'docs';

export interface GoogleServicesScannerProps {
  industry?: Industry;
  region?: Region;
  language?: SupportedLanguage;
  file?: File | null;
  persistedConnectedServices?: GoogleService[];
  onServicesUpdate?: (services: GoogleService[]) => void;
}

export interface ScanViolation {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  service: string;
  location: string;
}

export interface ScanResults {
  violations: ScanViolation[];
}

export interface UploadedFileInfo {
  name: string;
  type: string;
  size: number;
}
