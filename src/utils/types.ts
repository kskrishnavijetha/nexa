export interface AIInsight {
  text: string;
  type: 'info' | 'warning' | 'success' | 'observation' | 'recommendation';
  title?: string;
  actionRequired?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface AuditReportStatistics {
  totalEvents: number;
  userEvents: number;
  systemEvents: number;
  completed: number;
  inProgress: number;
  pending: number;
  // Add aliases for clearer property names in findings files
  completedTasks?: number;
  pendingTasks?: number;
}

export interface ComplianceFinding {
  category: string;
  status: 'Pass' | 'Failed' | 'Warning' | 'N/A';
  criticality: 'High' | 'Medium' | 'Low' | 'Critical';
  details: string;
}

export interface CriticalRisk {
  description: string;
  impact: string;
}

export interface ComplianceRecommendation {
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface ComplianceReport {
  documentId: string;
  documentName: string;
  scanDate?: string;  // Added as optional
  timestamp?: string; // Added as optional
  industry: Industry;
  organization?: string; // Added as optional
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  summary: string;
  risks: Array<{ 
    title: string; 
    description: string; 
    severity: RiskSeverity;
    section?: string;
    regulation?: string;
  }>;
  userId?: string;
  complianceStatus?: string; // Added as optional
  regulations?: string[]; // Added as optional
}

export type Industry = 
  'Finance & Banking' | 
  'Healthcare' | 
  'Retail & Consumer' | 
  'E-Commerce' | 
  'Cloud & SaaS' | 
  'Government & Defense' | 
  'Energy & Utilities' | 
  'Telecom' | 
  'Manufacturing & Supply Chain' | 
  'Education' | 
  'Automotive' | 
  'Pharmaceutical & Biotech' |
  'Global';

export type Region = 'US' | 'EU' | 'APAC';

export type RiskSeverity = 'high' | 'medium' | 'low';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
