import { RiskItem, Region, REGION_REGULATIONS } from './types';

// Industry-specific risk templates
const INDUSTRY_RISKS: Record<string, RiskItem[]> = {
  'HIPAA': [
    {
      description: 'Inadequate PHI access controls',
      severity: 'high',
      regulation: 'HIPAA',
      section: '164.312(a)'
    },
    {
      description: 'Missing BAA agreements with vendors',
      severity: 'medium',
      regulation: 'HIPAA',
      section: '164.308(b)'
    }
  ],
  'GDPR': [
    {
      description: 'No clear consent mechanism for data processing',
      severity: 'high',
      regulation: 'GDPR',
      section: 'Article 7'
    },
    {
      description: 'Inadequate data breach notification procedures',
      severity: 'medium',
      regulation: 'GDPR',
      section: 'Article 33'
    }
  ],
  'PCI-DSS': [
    {
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high',
      regulation: 'PCI-DSS',
      section: 'Requirement 1.3'
    },
    {
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high',
      regulation: 'PCI-DSS',
      section: 'Requirement 3.4'
    }
  ],
  'SOC 2': [
    {
      description: 'Inadequate access control measures',
      severity: 'medium',
      regulation: 'SOC 2',
      section: 'CC6.1'
    },
    {
      description: 'No formal risk assessment process',
      severity: 'medium',
      regulation: 'SOC 2',
      section: 'CC3.1'
    }
  ],
  'ISO/IEC 27001': [
    {
      description: 'Missing information security policy documentation',
      severity: 'medium',
      regulation: 'ISO/IEC 27001',
      section: 'A.5.1'
    }
  ],
  'FERPA': [
    {
      description: 'Unauthorized disclosure of student records',
      severity: 'high',
      regulation: 'FERPA',
      section: '§ 99.30'
    }
  ],
  'FISMA': [
    {
      description: 'Inadequate security assessment procedures',
      severity: 'medium',
      regulation: 'FISMA',
      section: 'CA-2'
    }
  ],
  'FDA': [
    {
      description: 'Missing documentation for quality control procedures',
      severity: 'high',
      regulation: 'FDA',
      section: '21 CFR Part 820'
    }
  ],
  'ISO 14001': [
    {
      description: 'No formal environmental management system established',
      severity: 'medium',
      regulation: 'ISO 14001',
      section: '4.1'
    }
  ]
};

// Region-specific risk templates
const REGION_RISKS: Record<Region, RiskItem[]> = {
  'North America': [
    {
      description: 'Missing privacy notice required by CCPA',
      severity: 'high',
      regulation: 'CCPA',
      section: '1798.100'
    },
    {
      description: 'No documented data subject request process',
      severity: 'medium',
      regulation: 'CCPA',
      section: '1798.130'
    }
  ],
  'European Union': [
    {
      description: 'Inadequate data processing agreements with processors',
      severity: 'high',
      regulation: 'GDPR',
      section: 'Article 28'
    },
    {
      description: 'Missing Data Protection Impact Assessment',
      severity: 'medium',
      regulation: 'GDPR',
      section: 'Article 35'
    }
  ],
  'Asia Pacific': [
    {
      description: 'No designated data protection officer',
      severity: 'medium',
      regulation: 'PDPA',
      section: 'Section 11'
    },
    {
      description: 'Inadequate cross-border transfer safeguards',
      severity: 'high',
      regulation: 'PIPL',
      section: 'Article 38'
    }
  ],
  'United Kingdom': [
    {
      description: 'Missing legitimate interest assessment',
      severity: 'medium',
      regulation: 'UK GDPR',
      section: 'Article 6(1)(f)'
    },
    {
      description: 'Inadequate cookie consent mechanism',
      severity: 'high',
      regulation: 'PECR',
      section: 'Regulation 6'
    }
  ],
  'Latin America': [
    {
      description: 'Missing data subject rights procedure',
      severity: 'high',
      regulation: 'LGPD',
      section: 'Article 18'
    },
    {
      description: 'No documented legal basis for processing',
      severity: 'medium',
      regulation: 'LGPD',
      section: 'Article 7'
    }
  ],
  'Middle East': [
    {
      description: 'Inadequate consent mechanisms for personal data',
      severity: 'medium',
      regulation: 'PDPL',
      section: 'Article 4'
    },
    {
      description: 'No data breach notification procedure',
      severity: 'high',
      regulation: 'DPL',
      section: 'Section 41'
    }
  ],
  'Africa': [
    {
      description: 'Missing documentation for data processing activities',
      severity: 'medium',
      regulation: 'POPIA',
      section: 'Section 17'
    },
    {
      description: 'Inadequate security safeguards',
      severity: 'high',
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
): RiskItem[] {
  const risks: RiskItem[] = [];
  
  // Add GDPR risks if applicable
  if ((regulations.includes('GDPR') || regulations.length === 0) && gdprScore < 90) {
    risks.push({
      description: 'Personal data storage duration not specified',
      severity: 'medium',
      regulation: 'GDPR',
      section: 'Article 5'
    });
  }
  
  if ((regulations.includes('GDPR') || regulations.length === 0) && gdprScore < 75) {
    risks.push({
      description: 'No clear process for data subject access requests',
      severity: 'high',
      regulation: 'GDPR',
      section: 'Article 15'
    });
  }
  
  // Add HIPAA risks if applicable
  if ((regulations.includes('HIPAA') || regulations.length === 0) && hipaaScore < 85) {
    risks.push({
      description: 'Insufficient details on physical safeguards',
      severity: 'medium',
      regulation: 'HIPAA',
      section: '164.310'
    });
  }
  
  if ((regulations.includes('HIPAA') || regulations.length === 0) && hipaaScore < 70) {
    risks.push({
      description: 'Missing data encryption requirements',
      severity: 'high',
      regulation: 'HIPAA',
      section: '164.312(a)(2)(iv)'
    });
  }
  
  // Add SOC2 risks if applicable
  if ((regulations.includes('SOC 2') || regulations.length === 0) && soc2Score < 80) {
    risks.push({
      description: 'Access control policy needs enhancement',
      severity: 'low',
      regulation: 'SOC 2',
      section: 'CC6.1'
    });
  }
  
  // Add PCI-DSS related risks if applicable
  if ((regulations.includes('PCI-DSS') || regulations.length === 0) && pciDssScore < 85) {
    risks.push({
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high',
      regulation: 'PCI-DSS',
      section: 'Requirement 1.3'
    });
  }
  
  if ((regulations.includes('PCI-DSS') || regulations.length === 0) && pciDssScore < 75) {
    risks.push({
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high',
      regulation: 'PCI-DSS',
      section: 'Requirement 3.4'
    });
  }
  
  // Add region-specific risks if applicable
  if (region) {
    // Add a subset of region-specific risks
    const regionRisks = REGION_RISKS[region];
    const randomRiskCount = Math.min(3, Math.floor(Math.random() * regionRisks.length) + 1);
    
    // Shuffle array to get random risks
    const shuffled = [...regionRisks].sort(() => 0.5 - Math.random());
    
    // Take the first n items
    risks.push(...shuffled.slice(0, randomRiskCount));
    
    // Add additional risks based on regional regulations
    const regionalRegulations = REGION_REGULATIONS[region];
    Object.keys(regionalRegulations).forEach(regKey => {
      // Only add if not already covered and with 40% probability
      if (!risks.some(r => r.regulation === regKey) && Math.random() < 0.4) {
        risks.push({
          description: `Potential compliance gap with ${regionalRegulations[regKey]}`,
          severity: Math.random() < 0.3 ? 'high' : 'medium',
          regulation: regKey
        });
      }
    });
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
