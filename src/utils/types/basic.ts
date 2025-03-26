
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

// Industry and region maps
export const INDUSTRIES: Record<Industry, string> = {
  'finance': 'Finance',
  'healthcare': 'Healthcare',
  'technology': 'Technology',
  'retail': 'Retail',
  'education': 'Education',
  'government': 'Government',
  'legal': 'Legal',
  'manufacturing': 'Manufacturing',
  'insurance': 'Insurance',
  'telecom': 'Telecom',
  'energy': 'Energy',
  'other': 'Other',
  'Healthcare': 'Healthcare',
  'Financial Services': 'Financial Services',
  'Technology & IT': 'Technology & IT',
  'Manufacturing & Industrial': 'Manufacturing & Industrial'
};

export const REGIONS: Record<Region, string> = {
  'us': 'United States',
  'eu': 'European Union',
  'uk': 'United Kingdom',
  'asia': 'Asia',
  'australia': 'Australia',
  'canada': 'Canada',
  'global': 'Global',
  'other': 'Other',
  'North America': 'North America',
  'European Union': 'European Union',
  'Asia Pacific': 'Asia Pacific',
  'United Kingdom': 'United Kingdom',
  'Latin America': 'Latin America',
  'Middle East': 'Middle East',
  'Africa': 'Africa'
};
