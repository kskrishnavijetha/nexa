
import { Industry, Region, RiskSeverity } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

export type GoogleService = 'drive' | 'gmail' | 'docs';

export interface GoogleServiceConnection {
  id: string;
  service: GoogleService;
  dateConnected: string;
  status: 'connected' | 'disconnected' | 'error';
  lastScanned?: string;
  itemsScanned?: number;
  issuesFound?: number;
}

export interface GoogleServiceStats {
  totalIssues: number;
  documentCount: number;
  lastScanDate?: string;
  serviceType: GoogleService;
}

export interface GoogleScanRequest {
  industry?: Industry;
  region?: Region;
  language?: SupportedLanguage;
  services: GoogleService[];
}

export interface GoogleServicesScannerProps {
  industry?: Industry;
  region?: Region;
  language?: SupportedLanguage;
  file?: File;
  persistedConnectedServices?: GoogleService[];
  onServicesUpdate?: (services: GoogleService[]) => void;
}

export interface ScanViolation {
  title: string;
  description: string;
  severity: RiskSeverity;
  service: string;
  location: string;
  industry?: Industry; // Add industry to scan violation
}

export interface ScanResults {
  violations: ScanViolation[];
  industry?: Industry; // Add industry to scan results
}

export interface ServiceHistoryItem {
  id: string;
  service: GoogleService;
  scanDate: string;
  issuesFound: number;
  itemsScanned: number;
  status: 'completed' | 'failed' | 'partial';
}
