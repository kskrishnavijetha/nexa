
import { ComplianceRisk } from '../types';

/**
 * Generate GDPR-specific risks based on the compliance score
 */
export function generateGdprRisks(gdprScore: number): ComplianceRisk[] {
  const risks: ComplianceRisk[] = [];
  
  if (gdprScore < 90) {
    risks.push({
      id: 'gdpr-risk-1',
      title: 'Data Retention Risk',
      description: 'Personal data storage duration not specified',
      severity: 'medium',
      mitigation: 'Define clear data retention policies',
      regulation: 'GDPR',
      section: 'Article 5'
    });
  }
  
  if (gdprScore < 75) {
    risks.push({
      id: 'gdpr-risk-2',
      title: 'Access Request Risk',
      description: 'No clear process for data subject access requests',
      severity: 'high',
      mitigation: 'Implement data subject access request procedures',
      regulation: 'GDPR',
      section: 'Article 15'
    });
  }
  
  return risks;
}

/**
 * Generate HIPAA-specific risks based on the compliance score
 */
export function generateHipaaRisks(hipaaScore: number): ComplianceRisk[] {
  const risks: ComplianceRisk[] = [];
  
  if (hipaaScore < 85) {
    risks.push({
      id: 'hipaa-risk-1',
      title: 'Physical Safeguards Risk',
      description: 'Insufficient details on physical safeguards',
      severity: 'medium',
      mitigation: 'Document and implement physical security controls',
      regulation: 'HIPAA',
      section: '164.310'
    });
  }
  
  if (hipaaScore < 70) {
    risks.push({
      id: 'hipaa-risk-2',
      title: 'Encryption Risk',
      description: 'Missing data encryption requirements',
      severity: 'high',
      mitigation: 'Implement encryption for data at rest and in transit',
      regulation: 'HIPAA',
      section: '164.312(a)(2)(iv)'
    });
  }
  
  return risks;
}

/**
 * Generate SOC2-specific risks based on the compliance score
 */
export function generateSoc2Risks(soc2Score: number): ComplianceRisk[] {
  const risks: ComplianceRisk[] = [];
  
  if (soc2Score < 80) {
    risks.push({
      id: 'soc2-risk-1',
      title: 'Access Control Risk',
      description: 'Access control policy needs enhancement',
      severity: 'low',
      mitigation: 'Strengthen access control policies',
      regulation: 'SOC 2',
      section: 'CC6.1'
    });
  }
  
  return risks;
}

/**
 * Generate PCI-DSS-specific risks based on the compliance score
 */
export function generatePciDssRisks(pciDssScore: number): ComplianceRisk[] {
  const risks: ComplianceRisk[] = [];
  
  if (pciDssScore < 85) {
    risks.push({
      id: 'pci-dss-risk-1',
      title: 'Network Segmentation Risk',
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high',
      mitigation: 'Implement network segmentation controls',
      regulation: 'PCI-DSS',
      section: 'Requirement 1.3'
    });
  }
  
  if (pciDssScore < 75) {
    risks.push({
      id: 'pci-dss-risk-2',
      title: 'Encryption Standard Risk',
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high',
      mitigation: 'Implement strong encryption standards',
      regulation: 'PCI-DSS',
      section: 'Requirement 3.4'
    });
  }
  
  return risks;
}
