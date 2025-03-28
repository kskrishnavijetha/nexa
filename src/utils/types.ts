export interface ComplianceReport {
  documentId: string;
  documentName: string;
  originalFileName?: string;  // Adding this to track the original file name
  userId?: string | null;
  timestamp: string;
  overallScore: number;
  industryScore: number;
  regionalScore: number;
  regulationScore: number;
  risks: Risk[];
  itemsScanned?: number;  // Adding this for consistency
  issues?: Issue[];       // Adding this for consistency
  industry: Industry;
  region?: Region;
  language?: SupportedLanguage;
  complianceStatus: 'compliant' | 'non-compliant' | 'partially-compliant';
  documentType?: string;
  pageCount?: number;
  fileSize?: number;
  author?: string;
  lastModified?: string;
  regulations: string[];
  summary?: string;
  recommendations?: string[];
  simulationResults?: SimulationResult[];
  vulnerabilities?: Vulnerability[];
}

export interface Risk {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  regulation: string;
  section?: string;
}

export interface Issue {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
}

export interface SimulationResult {
  regulation: string;
  originalScore: number;
  improvedScore: number;
  actionsTaken: string[];
}

export interface Vulnerability {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  remediation: string;
}

export type Industry =
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'technology'
  | 'retail'
  | 'government';

export type Region =
  | 'us'
  | 'eu'
  | 'uk'
  | 'ca'
  | 'au';
