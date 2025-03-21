export type Industry = 
  | 'finance' 
  | 'healthcare' 
  | 'technology' 
  | 'retail' 
  | 'education'
  | 'government'
  | 'legal'
  | 'manufacturing'
  | 'insurance' 
  | 'telecom'
  | 'energy'
  | 'other';

export type Region = 
  | 'us' 
  | 'eu' 
  | 'uk' 
  | 'asia' 
  | 'australia'
  | 'canada'
  | 'global'
  | 'other';

// Generic API response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

// Compliance report types
export interface ComplianceRisk {
  id: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  regulation: string;
  section?: string;
  remediation?: string;
}

export interface ComplianceReport {
  id: string;
  documentId: string;
  documentName: string;
  scanDate: string;
  risks: ComplianceRisk[];
  industry?: Industry;
  region?: Region;
}
