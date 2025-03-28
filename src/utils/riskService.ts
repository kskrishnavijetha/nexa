
import { ComplianceRisk, RiskSeverity, Region, REGION_REGULATIONS } from './types';

// Industry-specific risk templates
const INDUSTRY_RISKS: Record<string, ComplianceRisk[]> = {
  'HIPAA': [
    {
      id: 'hipaa-1',
      title: 'PHI Access Control Risk',
      description: 'Inadequate PHI access controls',
      severity: 'high',
      mitigation: 'Implement role-based access controls and audit logs',
      regulation: 'HIPAA',
      section: '164.312(a)'
    },
    {
      id: 'hipaa-2',
      title: 'Vendor Agreement Risk',
      description: 'Missing BAA agreements with vendors',
      severity: 'medium',
      mitigation: 'Establish business associate agreements with all vendors',
      regulation: 'HIPAA',
      section: '164.308(b)'
    }
  ],
  'GDPR': [
    {
      id: 'gdpr-1',
      title: 'Consent Mechanism Risk',
      description: 'No clear consent mechanism for data processing',
      severity: 'high',
      mitigation: 'Implement explicit consent collection processes',
      regulation: 'GDPR',
      section: 'Article 7'
    },
    {
      id: 'gdpr-2',
      title: 'Breach Notification Risk',
      description: 'Inadequate data breach notification procedures',
      severity: 'medium',
      mitigation: 'Create comprehensive breach notification protocol',
      regulation: 'GDPR',
      section: 'Article 33'
    }
  ],
  'PCI-DSS': [
    {
      id: 'pci-dss-1',
      title: 'Network Segmentation Risk',
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high',
      mitigation: 'Implement proper network segmentation',
      regulation: 'PCI-DSS',
      section: 'Requirement 1.3'
    },
    {
      id: 'pci-dss-2',
      title: 'Data Encryption Risk',
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high',
      mitigation: 'Upgrade to strong encryption methods',
      regulation: 'PCI-DSS',
      section: 'Requirement 3.4'
    }
  ],
  'SOC 2': [
    {
      id: 'soc-2-1',
      title: 'Access Control Risk',
      description: 'Inadequate access control measures',
      severity: 'medium',
      mitigation: 'Implement proper access controls and user management',
      regulation: 'SOC 2',
      section: 'CC6.1'
    },
    {
      id: 'soc-2-2',
      title: 'Risk Assessment Gap',
      description: 'No formal risk assessment process',
      severity: 'medium',
      mitigation: 'Establish regular risk assessment procedures',
      regulation: 'SOC 2',
      section: 'CC3.1'
    }
  ],
  'ISO/IEC 27001': [
    {
      id: 'iso-iec-27001-1',
      title: 'Policy Documentation Risk',
      description: 'Missing information security policy documentation',
      severity: 'medium',
      mitigation: 'Create comprehensive information security policies',
      regulation: 'ISO/IEC 27001',
      section: 'A.5.1'
    }
  ],
  'FERPA': [
    {
      id: 'ferpa-1',
      title: 'Student Record Disclosure Risk',
      description: 'Unauthorized disclosure of student records',
      severity: 'high',
      mitigation: 'Implement proper access controls and consent procedures',
      regulation: 'FERPA',
      section: '§ 99.30'
    }
  ],
  'FISMA': [
    {
      id: 'fisma-1',
      title: 'Security Assessment Risk',
      description: 'Inadequate security assessment procedures',
      severity: 'medium',
      mitigation: 'Establish comprehensive security assessment program',
      regulation: 'FISMA',
      section: 'CA-2'
    }
  ],
  'FDA': [
    {
      id: 'fda-1',
      title: 'Quality Control Documentation Risk',
      description: 'Missing documentation for quality control procedures',
      severity: 'high',
      mitigation: 'Implement detailed quality control documentation',
      regulation: 'FDA',
      section: '21 CFR Part 820'
    }
  ],
  'ISO 14001': [
    {
      id: 'iso-14001-1',
      title: 'Environmental Management Risk',
      description: 'No formal environmental management system established',
      severity: 'medium',
      mitigation: 'Establish environmental management system',
      regulation: 'ISO 14001',
      section: '4.1'
    }
  ]
};

// Region-specific risk templates
const REGION_RISKS: Record<string, ComplianceRisk[]> = {
  'us': [
    {
      id: 'us-1',
      title: 'CCPA Privacy Notice Risk',
      description: 'Missing privacy notice required by CCPA',
      severity: 'high',
      mitigation: 'Create CCPA-compliant privacy notice',
      regulation: 'CCPA',
      section: '1798.100'
    },
    {
      id: 'us-2',
      title: 'Data Subject Request Risk',
      description: 'No documented data subject request process',
      severity: 'medium',
      mitigation: 'Implement data subject request handling procedures',
      regulation: 'CCPA',
      section: '1798.130'
    }
  ],
  'North America': [
    {
      id: 'na-1',
      title: 'CCPA Privacy Notice Risk',
      description: 'Missing privacy notice required by CCPA',
      severity: 'high',
      mitigation: 'Create CCPA-compliant privacy notice',
      regulation: 'CCPA',
      section: '1798.100'
    },
    {
      id: 'na-2',
      title: 'Data Subject Request Risk',
      description: 'No documented data subject request process',
      severity: 'medium',
      mitigation: 'Implement data subject request handling procedures',
      regulation: 'CCPA',
      section: '1798.130'
    }
  ],
  'European Union': [
    {
      id: 'eu-1',
      title: 'Processor Agreement Risk',
      description: 'Inadequate data processing agreements with processors',
      severity: 'high',
      mitigation: 'Update processor agreements to GDPR standards',
      regulation: 'GDPR',
      section: 'Article 28'
    },
    {
      id: 'eu-2',
      title: 'DPIA Risk',
      description: 'Missing Data Protection Impact Assessment',
      severity: 'medium',
      mitigation: 'Conduct Data Protection Impact Assessments',
      regulation: 'GDPR',
      section: 'Article 35'
    }
  ],
  'Asia Pacific': [
    {
      id: 'ap-1',
      title: 'DPO Designation Risk',
      description: 'No designated data protection officer',
      severity: 'medium',
      mitigation: 'Appoint a data protection officer',
      regulation: 'PDPA',
      section: 'Section 11'
    },
    {
      id: 'ap-2',
      title: 'Cross-Border Transfer Risk',
      description: 'Inadequate cross-border transfer safeguards',
      severity: 'high',
      mitigation: 'Implement cross-border data transfer protections',
      regulation: 'PIPL',
      section: 'Article 38'
    }
  ],
  'United Kingdom': [
    {
      id: 'uk-1',
      title: 'Legitimate Interest Assessment Risk',
      description: 'Missing legitimate interest assessment',
      severity: 'medium',
      mitigation: 'Conduct legitimate interest assessments',
      regulation: 'UK GDPR',
      section: 'Article 6(1)(f)'
    },
    {
      id: 'uk-2',
      title: 'Cookie Consent Risk',
      description: 'Inadequate cookie consent mechanism',
      severity: 'high',
      mitigation: 'Implement compliant cookie consent process',
      regulation: 'PECR',
      section: 'Regulation 6'
    }
  ],
  'Latin America': [
    {
      id: 'la-1',
      title: 'Data Subject Rights Risk',
      description: 'Missing data subject rights procedure',
      severity: 'high',
      mitigation: 'Implement data subject rights procedures',
      regulation: 'LGPD',
      section: 'Article 18'
    },
    {
      id: 'la-2',
      title: 'Legal Basis Documentation Risk',
      description: 'No documented legal basis for processing',
      severity: 'medium',
      mitigation: 'Document legal basis for all processing activities',
      regulation: 'LGPD',
      section: 'Article 7'
    }
  ],
  'Middle East': [
    {
      id: 'me-1',
      title: 'Consent Mechanism Risk',
      description: 'Inadequate consent mechanisms for personal data',
      severity: 'medium',
      mitigation: 'Implement proper consent collection mechanisms',
      regulation: 'PDPL',
      section: 'Article 4'
    },
    {
      id: 'me-2',
      title: 'Breach Notification Risk',
      description: 'No data breach notification procedure',
      severity: 'high',
      mitigation: 'Establish data breach notification protocol',
      regulation: 'DPL',
      section: 'Section 41'
    }
  ],
  'Africa': [
    {
      id: 'af-1',
      title: 'Processing Documentation Risk',
      description: 'Missing documentation for data processing activities',
      severity: 'medium',
      mitigation: 'Create documentation for all data processing activities',
      regulation: 'POPIA',
      section: 'Section 17'
    },
    {
      id: 'af-2',
      title: 'Security Safeguards Risk',
      description: 'Inadequate security safeguards',
      severity: 'high',
      mitigation: 'Implement appropriate security safeguards',
      regulation: 'POPIA',
      section: 'Section 19'
    }
  ]
};

/**
 * Generate compliance risks based on scores and relevant regulations
 */
export function generateRisks(
  gdprScore: number, 
  hipaaScore: number, 
  soc2Score: number, 
  pciDssScore: number, 
  regulations: string[] = [],
  region?: Region
): ComplianceRisk[] {
  let riskIdCounter = 1;
  const generateRiskId = () => `risk-${riskIdCounter++}`;
  
  const risks: ComplianceRisk[] = [];
  
  // Add GDPR risks if applicable
  if ((regulations.includes('GDPR') || regulations.length === 0) && gdprScore < 90) {
    risks.push({
      id: generateRiskId(),
      title: 'Data Retention Risk',
      description: 'Personal data storage duration not specified',
      severity: 'medium',
      mitigation: 'Define clear data retention policies',
      regulation: 'GDPR',
      section: 'Article 5'
    });
  }
  
  if ((regulations.includes('GDPR') || regulations.length === 0) && gdprScore < 75) {
    risks.push({
      id: generateRiskId(),
      title: 'Access Request Risk',
      description: 'No clear process for data subject access requests',
      severity: 'high',
      mitigation: 'Implement data subject access request procedures',
      regulation: 'GDPR',
      section: 'Article 15'
    });
  }
  
  // Add HIPAA risks if applicable
  if ((regulations.includes('HIPAA') || regulations.length === 0) && hipaaScore < 85) {
    risks.push({
      id: generateRiskId(),
      title: 'Physical Safeguards Risk',
      description: 'Insufficient details on physical safeguards',
      severity: 'medium',
      mitigation: 'Document and implement physical security controls',
      regulation: 'HIPAA',
      section: '164.310'
    });
  }
  
  if ((regulations.includes('HIPAA') || regulations.length === 0) && hipaaScore < 70) {
    risks.push({
      id: generateRiskId(),
      title: 'Encryption Risk',
      description: 'Missing data encryption requirements',
      severity: 'high',
      mitigation: 'Implement encryption for data at rest and in transit',
      regulation: 'HIPAA',
      section: '164.312(a)(2)(iv)'
    });
  }
  
  // Add SOC2 risks if applicable
  if ((regulations.includes('SOC 2') || regulations.length === 0) && soc2Score < 80) {
    risks.push({
      id: generateRiskId(),
      title: 'Access Control Risk',
      description: 'Access control policy needs enhancement',
      severity: 'low',
      mitigation: 'Strengthen access control policies',
      regulation: 'SOC 2',
      section: 'CC6.1'
    });
  }
  
  // Add PCI-DSS related risks if applicable
  if ((regulations.includes('PCI-DSS') || regulations.length === 0) && pciDssScore < 85) {
    risks.push({
      id: generateRiskId(),
      title: 'Network Segmentation Risk',
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high',
      mitigation: 'Implement network segmentation controls',
      regulation: 'PCI-DSS',
      section: 'Requirement 1.3'
    });
  }
  
  if ((regulations.includes('PCI-DSS') || regulations.length === 0) && pciDssScore < 75) {
    risks.push({
      id: generateRiskId(),
      title: 'Encryption Standard Risk',
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high',
      mitigation: 'Implement strong encryption standards',
      regulation: 'PCI-DSS',
      section: 'Requirement 3.4'
    });
  }
  
  // Add region-specific risks if applicable
  if (region) {
    // Add a subset of region-specific risks
    const regionRisks = REGION_RISKS[region];
    if (regionRisks) {
      const randomRiskCount = Math.min(3, Math.floor(Math.random() * regionRisks.length) + 1);
      
      // Shuffle array to get random risks
      const shuffled = [...regionRisks].sort(() => 0.5 - Math.random());
      
      // Take the first n items
      risks.push(...shuffled.slice(0, randomRiskCount));
    }
    
    // Add additional risks based on regional regulations
    const regionalRegulations = REGION_REGULATIONS[region];
    if (regionalRegulations) {
      Object.keys(regionalRegulations).forEach(regKey => {
        // Only add if not already covered and with 40% probability
        if (!risks.some(r => r.regulation === regKey) && Math.random() < 0.4) {
          risks.push({
            id: generateRiskId(),
            title: `${regKey} Compliance Risk`,
            description: `Potential compliance gap with ${regionalRegulations[regKey]}`,
            severity: Math.random() < 0.3 ? 'high' : 'medium',
            mitigation: `Conduct ${regKey} compliance assessment`,
            regulation: regKey
          });
        }
      });
    }
  }
  
  // Add industry-specific risks
  regulations.forEach(regulation => {
    if (INDUSTRY_RISKS[regulation]) {
      // Add a random subset of industry risks
      const industryRisks = INDUSTRY_RISKS[regulation];
      const randomRiskCount = Math.floor(Math.random() * industryRisks.length) + 1;
      
      // Shuffle array to get random risks
      const shuffled = [...industryRisks].sort(() => 0.5 - Math.random());
      
      // Take the first n items
      risks.push(...shuffled.slice(0, randomRiskCount));
    }
  });
  
  return risks;
}
