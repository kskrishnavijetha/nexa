
// Industry regulations mapping
export const INDUSTRY_REGULATIONS: Record<string, string[]> = {
  'finance': ['PCI-DSS', 'SOX'],
  'healthcare': ['HIPAA', 'HITECH'],
  'technology': ['GDPR', 'CCPA', 'SOC 2'],
  'retail': ['PCI-DSS', 'CCPA'],
  'education': ['FERPA', 'COPPA'],
  'government': ['FISMA', 'FedRAMP'],
  'legal': ['GDPR', 'CCPA', 'Ethics Rules'],
  'manufacturing': ['ISO 9001', 'FDA', 'OSHA'],
  'insurance': ['NAIC', 'GDPR'],
  'telecom': ['CPNI', 'GDPR'],
  'energy': ['NERC-CIP', 'ISO 14001'],
  'other': ['GDPR'],
  'Healthcare': ['HIPAA', 'HITECH'],
  'Financial Services': ['PCI-DSS', 'SOX'],
  'Technology & IT': ['GDPR', 'CCPA', 'SOC 2'],
  'Manufacturing & Industrial': ['ISO 9001', 'FDA', 'OSHA']
};

// Region regulations mapping
export const REGION_REGULATIONS: Record<string, Record<string, string>> = {
  'us': { 'CCPA': 'California Consumer Privacy Act', 'HIPAA': 'Health Insurance Portability and Accountability Act' },
  'eu': { 'GDPR': 'General Data Protection Regulation' },
  'uk': { 'UK GDPR': 'United Kingdom General Data Protection Regulation', 'DPA': 'Data Protection Act' },
  'asia': { 'PDPA': 'Personal Data Protection Act', 'PIPL': 'Personal Information Protection Law' },
  'australia': { 'Privacy Act': 'Privacy Act 1988', 'NDB': 'Notifiable Data Breaches scheme' },
  'canada': { 'PIPEDA': 'Personal Information Protection and Electronic Documents Act' },
  'global': { 'ISO27001': 'Information Security Management', 'SOC 2': 'Service Organization Control 2' },
  'other': { 'Local': 'Local Regulations' },
  'North America': { 'CCPA': 'California Consumer Privacy Act', 'HIPAA': 'Health Insurance Portability and Accountability Act' },
  'European Union': { 'GDPR': 'General Data Protection Regulation' },
  'Asia Pacific': { 'PDPA': 'Personal Data Protection Act', 'PIPL': 'Personal Information Protection Law' },
  'United Kingdom': { 'UK GDPR': 'United Kingdom General Data Protection Regulation', 'DPA': 'Data Protection Act' },
  'Latin America': { 'LGPD': 'Lei Geral de Proteção de Dados' },
  'Middle East': { 'PDPL': 'Personal Data Protection Law', 'DPL': 'Data Protection Law' },
  'Africa': { 'POPIA': 'Protection of Personal Information Act' }
};
