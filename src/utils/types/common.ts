
// Common/shared type definitions
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
  | 'other'
  | 'Healthcare'
  | 'Financial Services'
  | 'Technology & IT'
  | 'Manufacturing & Industrial';

export type Region = 
  | 'us' 
  | 'eu' 
  | 'uk' 
  | 'asia' 
  | 'australia'
  | 'canada'
  | 'global'
  | 'other'
  | 'North America'
  | 'European Union'
  | 'Asia Pacific'
  | 'United Kingdom'
  | 'Latin America'
  | 'Middle East'
  | 'Africa';

export type RiskSeverity = 'high' | 'medium' | 'low';

// Generic API response type
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}
