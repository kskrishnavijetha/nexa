
import { Industry, Region } from './basic';
import { ComplianceRisk } from './risk';

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
