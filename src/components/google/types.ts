
import { GoogleService } from "@/utils/google/types";
import { Industry, Region } from "@/utils/types";
import { SupportedLanguage } from "@/utils/language";

export interface GoogleServicesScannerProps {
  industry: Industry | undefined;
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

export { GoogleService };

export type Industry = "healthcare" | "finance" | "technology" | "retail" | "manufacturing" | "legal" | "insurance" | "government" | "education" | "energy" | "automotive" | "telecom" | "pharma";

export interface ScanResults {
  complianceScore: number;
  riskLevel: "low" | "medium" | "high";
  findings: Finding[];
  recommendations: string[];
  timestamp: Date;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location?: string;
  regulation?: string;
  remediationSteps?: string[];
}

export interface ScanControlsProps {
  connectedServices: GoogleService[];
  isScanning: boolean;
  industry: Industry | undefined;
  language: SupportedLanguage;
  region: Region | undefined;
  file: File | null;
  onScan: (services: GoogleService[], industry: Industry | undefined, language?: SupportedLanguage, region?: Region | undefined) => void;
  onScanComplete?: (itemsScanned: number, violationsFound: number) => void;
  isCompactView?: boolean;
}
