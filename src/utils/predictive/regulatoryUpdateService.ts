
import { Industry, INDUSTRY_REGULATIONS } from '../types';
import { RegulatoryUpdate } from './types';

// Simulated database of regulatory updates
// In a real application, this would come from an API
const MOCK_REGULATORY_UPDATES: RegulatoryUpdate[] = [
  {
    id: '1',
    title: 'GDPR Amendment on Data Transfer',
    description: 'New requirements for international data transfers under GDPR Article 28, requiring additional safeguards for data transferred outside the EU.',
    regulation: 'GDPR',
    industry: 'Technology & IT',
    publishDate: '2023-06-15T00:00:00Z',
    effectiveDate: '2023-09-01T00:00:00Z',
    severity: 'important',
    source: 'European Data Protection Board',
    sourceUrl: 'https://edpb.europa.eu'
  },
  {
    id: '2',
    title: 'HIPAA Safe Harbor Law Implementation',
    description: 'New safe harbor provisions reducing penalties for organizations that implement recognized cybersecurity practices prior to experiencing a data breach.',
    regulation: 'HIPAA',
    industry: 'Healthcare',
    publishDate: '2023-05-10T00:00:00Z',
    effectiveDate: '2023-08-01T00:00:00Z',
    severity: 'important',
    source: 'HHS Office for Civil Rights',
    sourceUrl: 'https://www.hhs.gov/ocr'
  },
  {
    id: '3',
    title: 'PCI-DSS 4.0 Transition Requirements',
    description: 'The deadline for transitioning to PCI-DSS 4.0 is approaching. New requirements for multi-factor authentication and encryption are being introduced.',
    regulation: 'PCI-DSS',
    industry: 'E-commerce & Payments',
    publishDate: '2023-07-22T00:00:00Z',
    effectiveDate: '2024-03-31T00:00:00Z',
    severity: 'critical',
    source: 'PCI Security Standards Council',
    sourceUrl: 'https://www.pcisecuritystandards.org'
  },
  {
    id: '4',
    title: 'SOC 2 Updated Guidelines for AI Systems',
    description: 'AICPA has released new guidelines for evaluating AI systems in SOC 2 reports, focusing on transparency, bias prevention, and data governance.',
    regulation: 'SOC 2',
    industry: 'Technology & IT',
    publishDate: '2023-04-05T00:00:00Z',
    effectiveDate: '2023-10-15T00:00:00Z',
    severity: 'informational',
    source: 'AICPA',
    sourceUrl: 'https://www.aicpa.org'
  },
  {
    id: '5',
    title: 'Financial Services Regulatory Update on KYC',
    description: 'New Know Your Customer (KYC) requirements mandate enhanced due diligence for high-value transactions and politically exposed persons.',
    regulation: 'AML/KYC',
    industry: 'Financial Services',
    publishDate: '2023-08-01T00:00:00Z',
    effectiveDate: '2024-01-15T00:00:00Z',
    severity: 'important',
    source: 'Financial Action Task Force',
    sourceUrl: 'https://www.fatf-gafi.org'
  },
  {
    id: '6',
    title: 'FDA Updates on Medical Device Security',
    description: 'New FDA guidelines require enhanced security measures for connected medical devices, including regular vulnerability assessments and secure update mechanisms.',
    regulation: 'FDA Regulations',
    industry: 'Healthcare',
    publishDate: '2023-07-05T00:00:00Z',
    effectiveDate: '2024-02-01T00:00:00Z',
    severity: 'critical',
    source: 'FDA',
    sourceUrl: 'https://www.fda.gov'
  },
  {
    id: '7',
    title: 'California Privacy Rights Act (CPRA) Enforcement Begins',
    description: 'Enforcement of CPRA has officially begun, expanding consumer rights and introducing new requirements for businesses handling personal data.',
    regulation: 'CCPA/CPRA',
    industry: 'Technology & IT',
    publishDate: '2023-06-20T00:00:00Z',
    effectiveDate: '2023-07-01T00:00:00Z',
    severity: 'critical',
    source: 'California Privacy Protection Agency',
    sourceUrl: 'https://cppa.ca.gov'
  },
  {
    id: '8',
    title: 'ISO/IEC 27001:2022 Transition Period Update',
    description: 'Organizations certified under ISO/IEC 27001:2013 are reminded to transition to ISO/IEC 27001:2022 before the deadline.',
    regulation: 'ISO/IEC 27001',
    industry: 'Technology & IT',
    publishDate: '2023-05-25T00:00:00Z',
    effectiveDate: '2024-10-31T00:00:00Z',
    severity: 'informational',
    source: 'International Organization for Standardization',
    sourceUrl: 'https://www.iso.org'
  }
];

/**
 * Fetches regulatory updates relevant to a specific industry
 */
export const fetchRegulatoryUpdates = async (
  industry?: Industry, 
  limit: number = 5
): Promise<RegulatoryUpdate[]> => {
  // In a real implementation, this would fetch from an API
  // For now, we'll filter our mock data
  
  // Add a small artificial delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let updates = [...MOCK_REGULATORY_UPDATES];
  
  // Filter by industry if specified
  if (industry) {
    // Get relevant regulations for this industry
    const relevantRegulations = INDUSTRY_REGULATIONS[industry] || [];
    
    // Filter updates by industry or relevant regulations
    updates = updates.filter(update => 
      update.industry === industry || 
      relevantRegulations.includes(update.regulation)
    );
  }
  
  // Sort by publish date (newest first)
  updates.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
  
  // Limit the number of results
  return updates.slice(0, limit);
};

/**
 * Checks if a regulatory update is relevant to a compliance report
 */
export const isUpdateRelevantToReport = (
  update: RegulatoryUpdate,
  report: { industry?: Industry; regulations?: string[] }
): boolean => {
  // Check if the update matches the report's industry
  if (report.industry && update.industry === report.industry) {
    return true;
  }
  
  // Check if the update's regulation is in the report's regulations
  if (report.regulations && report.regulations.includes(update.regulation)) {
    return true;
  }
  
  return false;
};
