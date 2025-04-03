
import { GoogleServiceConnection } from "@/utils/google/types";
import { Industry as IndustryType, Region, RiskSeverity } from "@/utils/types";

// Re-export GoogleService type from our utility function
export type GoogleService = 'gmail' | 'drive' | 'docs';

// Scanner component props
export interface GoogleServicesScannerProps {
  industry: IndustryType | undefined;
  region: Region | undefined;
  language: SupportedLanguage;
  file: File | null;
  persistedConnectedServices?: GoogleService[];
  onServicesUpdate?: (services: GoogleService[]) => void;
  isCompactView?: boolean;
}

export interface ScannerProps {
  connectedServices: GoogleService[];
  isScanning: boolean;
  onConnect: (service: GoogleService) => void;
  onDisconnect: (service: GoogleService) => void;
  onScan: () => void;
  isCompactView?: boolean;
}

// Re-export Industry type to avoid conflicts
export type Industry = 'healthcare' | 'finance' | 'technology' | 'retail' | 'manufacturing' | 'legal' | 'insurance' | 'government' | 'education' | 'energy' | 'automotive' | 'telecom' | 'pharma';

// Scan results types
export interface ScanResults {
  violations: ScanViolation[];
  industry?: IndustryType;
}

export interface ScanViolation {
  title: string;
  description: string;
  severity: RiskSeverity;
  service: string;
  location?: string;
  industry?: IndustryType;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  location?: string;
  regulation?: string;
  remediationSteps?: string[];
}

export interface ScanControlsProps {
  connectedServices: GoogleService[];
  isScanning: boolean;
  industry: IndustryType | undefined;
  language: SupportedLanguage;
  region: Region | undefined;
  file: File | null;
  onScan: (services: GoogleService[], industry: IndustryType | undefined, language?: SupportedLanguage, region?: Region | undefined) => void;
  onScanComplete?: (itemsScanned: number, violationsFound: number) => void;
  isCompactView?: boolean;
}

// Adding SupportedLanguage so we don't need to import it everywhere
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh';
