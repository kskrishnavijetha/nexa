
import { Industry as IndustryType, Region, RiskSeverity } from "@/utils/types";
import { SupportedLanguage as SupportedLanguageType } from "@/utils/language/types";

// Re-export GoogleService type from our utility function
export type GoogleService = 'gmail' | 'drive' | 'docs';

// Scanner component props
export interface GoogleServicesScannerProps {
  industry: IndustryType | undefined;
  region: Region | undefined;
  language: SupportedLanguageType;
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

// Industry type to be compatible with utility types
export type Industry = IndustryType;

// Export language type to be compatible with utility types
export type SupportedLanguage = SupportedLanguageType;

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
  language: SupportedLanguageType;
  region: Region | undefined;
  file: File | null;
  onScan: (services: GoogleService[], industry: IndustryType | undefined, language?: SupportedLanguageType, region?: Region | undefined) => void;
  onScanComplete?: (itemsScanned: number, violationsFound: number) => void;
  isCompactView?: boolean;
}
