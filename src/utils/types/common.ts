
export interface AIInsight {
  text: string;
  type: 'info' | 'warning' | 'success' | 'observation' | 'recommendation';
  title?: string;
  actionRequired?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number; // Added for status
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

export type Region = 'US' | 'EU' | 'APAC' | 'UK' | 'Global' | 'North America' | 'European Union' | 'Asia Pacific' | 'United Kingdom' | 'Latin America' | 'Middle East' | 'Africa';

// Update to include 'critical' as a valid severity
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

// Updated Constants for industry and region regulations with additional frameworks
export const INDUSTRY_REGULATIONS: Record<string, string[]> = {
  'Finance & Banking': ['GDPR', 'SOC 2', 'PCI-DSS', 'GLBA', 'FINRA', 'MAS TRM Guidelines', 'EMIR/MiFID II', 'ISO 27017', 'ISO 27018', 'NIST CSF'],
  'Healthcare': ['HIPAA', 'GDPR', 'HITECH', 'GDPR (Health Records)', 'ISO 27799', 'NHS DSP Toolkit'],
  'Retail & Consumer': ['GDPR', 'PCI-DSS', 'CCPA', 'ISO 27001', 'NIST CSF', 'CSA CCM'],
  'E-Commerce': ['GDPR', 'PCI-DSS', 'CCPA', 'ISO 27017', 'ISO 27018', 'CSA CCM'],
  'Cloud & SaaS': ['GDPR', 'SOC 2', 'ISO/IEC 27001', 'ISO 27017', 'ISO 27018', 'CSA CCM', 'NIST CSF'],
  'Government & Defense': ['FISMA', 'FedRAMP', 'CMMC', 'NIST 800-53', 'NIST CSF', 'CIS Controls'],
  'Energy & Utilities': ['NERC', 'GDPR', 'CCPA', 'NIST CSF', 'CIS Controls', 'ISO 27001'],
  'Telecom': ['GDPR', 'CPNI', 'CCPA', 'ISO 27001', 'NIST CSF', 'ePrivacy Directive'],
  'Manufacturing & Supply Chain': ['ISO 9001', 'GDPR', 'CCPA', 'NIST CSF', 'CIS Controls', 'ISO 27001'],
  'Education': ['FERPA', 'GDPR', 'COPPA', 'ISO 27001', 'NIST CSF', 'CIS Controls'],
  'Automotive': ['ISO 26262', 'GDPR', 'CCPA', 'NIST CSF', 'CIS Controls', 'ISO 27001'],
  'Pharmaceutical & Biotech': ['FDA CFR Part 11', 'HIPAA', 'GDPR', 'ISO 27799', 'NIST CSF', 'CIS Controls'],
  'Global': ['GDPR', 'ISO/IEC 27001', 'SOC 2', 'NIST CSF', 'CIS Controls', 'CSA CCM', 'LGPD', 'PIPEDA', 'PDPA', 'UK-GDPR']
};

// Fix duplicated property names in REGION_REGULATIONS
export const REGION_REGULATIONS: Record<string, Record<string, string>> = {
  'US': {
    'CCPA': 'California Consumer Privacy Act',
    'HIPAA': 'Health Insurance Portability and Accountability Act',
    'SOX': 'Sarbanes-Oxley Act',
    'GLBA': 'Gramm-Leach-Bliley Act',
    'FISMA': 'Federal Information Security Modernization Act',
    'NIST 800-53': 'NIST Special Publication 800-53',
    'FedRAMP': 'Federal Risk and Authorization Management Program'
  },
  'EU': {
    'GDPR': 'General Data Protection Regulation',
    'ePrivacy': 'ePrivacy Directive',
    'NIS2': 'Network and Information Security Directive',
    'GDPR (Health Records)': 'GDPR provisions for health data'
  },
  'UK': {
    'UK GDPR': 'UK General Data Protection Regulation',
    'DPA': 'Data Protection Act 2018',
    'PECR': 'Privacy and Electronic Communications Regulations',
    'NHS DSP Toolkit': 'NHS Data Security and Protection Toolkit'
  },
  'APAC': {
    'PDPA': 'Personal Data Protection Act (Singapore)',
    'PIPL': 'Personal Information Protection Law (China)',
    'APP': 'Australian Privacy Principles',
    'APRA CPS 234': 'Australian Prudential Regulation Authority CPS 234'
  },
  'Global': {
    'ISO/IEC 27001': 'Information Security Management',
    'ISO/IEC 27701': 'Privacy Information Management',
    'SOC 2': 'Service Organization Control 2',
    'ISO 27017': 'Cloud Security',
    'ISO 27018': 'Cloud Privacy',
    'CSA CCM': 'Cloud Security Alliance Cloud Controls Matrix',
    'CIS Controls': 'Center for Internet Security Controls',
    'NIST CSF': 'NIST Cybersecurity Framework'
  },
  'North America': {
    'CCPA_NA': 'California Consumer Privacy Act',
    'HIPAA_NA': 'Health Insurance Portability and Accountability Act',
    'PIPEDA': 'Personal Information Protection and Electronic Documents Act',
    'LGPD': 'Lei Geral de Proteção de Dados',
    'NIST 800-53': 'NIST Special Publication 800-53'
  },
  'European Union': {
    'GDPR_EU': 'General Data Protection Regulation',
    'ePrivacy_EU': 'ePrivacy Directive',
    'NIS2_EU': 'Network and Information Security Directive',
    'GDPR (Health Records)': 'GDPR provisions for health data',
    'ePrivacy Directive': 'EU Privacy and Electronic Communications Directive'
  },
  'Asia Pacific': {
    'PDPA_AP': 'Personal Data Protection Act (Singapore)',
    'PIPL_AP': 'Personal Information Protection Law (China)',
    'APP_AP': 'Australian Privacy Principles',
    'APRA CPS 234': 'Australian Prudential Regulation Authority CPS 234',
    'MAS TRM Guidelines': 'Monetary Authority of Singapore Technology Risk Management Guidelines'
  },
  'United Kingdom': {
    'UK_GDPR': 'UK General Data Protection Regulation',
    'DPA_UK': 'Data Protection Act 2018',
    'PECR_UK': 'Privacy and Electronic Communications Regulations',
    'NHS DSP Toolkit': 'NHS Data Security and Protection Toolkit'
  },
  'Latin America': {
    'LGPD': 'Lei Geral de Proteção de Dados (Brazil)',
    'PDPL_CL': 'Personal Data Protection Law (Chile)',
    'LPDP': 'Ley de Protección de Datos Personales (Mexico)'
  },
  'Middle East': {
    'PDPL_BH': 'Personal Data Protection Law (Bahrain)',
    'DPL_DIFC': 'Data Protection Law (DIFC)',
    'PDPL_QA': 'Personal Data Protection Law (Qatar)'
  },
  'Africa': {
    'POPIA': 'Protection of Personal Information Act (South Africa)',
    'NDPR': 'Nigeria Data Protection Regulation',
    'PDPA_KE': 'Personal Data Protection Act (Kenya)'
  }
};
