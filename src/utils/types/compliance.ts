
import { Industry, Region, RiskSeverity } from './common';

// Risk item definition
export interface RiskItem {
  id?: string;
  description: string;
  severity: RiskSeverity;
  regulation: string;
  section?: string;
  remediation?: string;
}

// Compliance risk types
export interface ComplianceRisk {
  id: string;
  severity: RiskSeverity;
  description: string;
  regulation: string;
  section?: string;
  remediation?: string;
}

// Compliance report types with all required fields
export interface ComplianceReport {
  id: string;
  documentId: string;
  documentName: string;
  scanDate?: string;
  timestamp: string;
  risks: ComplianceRisk[];
  industry?: Industry;
  region?: Region;
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  summary: string;
  suggestions?: string[];
  regulations?: string[];
  regionalRegulations?: Record<string, string>;
  industryScores?: Record<string, number>;
  regionScores?: Record<string, number>;
  language?: string;
}
