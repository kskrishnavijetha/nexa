
import { Industry, Region } from '@/utils/types';
import { SupportedLanguage } from '@/utils/language';

// Define type for cloud service
export type GoogleService = 'drive' | 'gmail' | 'docs' | 'sharepoint' | 'outlook' | 'teams';

// Define the structure for scan violations
export interface ScanViolation {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  service: string;
  location: string;
}

// Define the structure for scan results
export interface ScanResults {
  violations: ScanViolation[];
}

export interface GoogleServicesScannerProps {
  industry?: Industry;
  region?: Region;
  language: SupportedLanguage;
  file?: File | null;
}
