import { ApiResponse, ComplianceReport } from './types';

/**
 * Request a compliance check for an uploaded document
 */
export const requestComplianceCheck = async (
  documentId: string,
  documentName: string
): Promise<ApiResponse<ComplianceReport>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate random scores but keep them somewhat consistent
    const gdprScore = Math.floor(Math.random() * 40) + 60;
    const hipaaScore = Math.floor(Math.random() * 40) + 60;
    const soc2Score = Math.floor(Math.random() * 40) + 60;
    const pciDssScore = Math.floor(Math.random() * 40) + 60;
    
    // Calculate overall score as an average
    const overallScore = Math.floor((gdprScore + hipaaScore + soc2Score + pciDssScore) / 4);
    
    // Define risks based on scores
    const risks = generateRisks(gdprScore, hipaaScore, soc2Score, pciDssScore);
    
    // Generate suggestions based on risks
    const suggestions = generateSuggestions();
    
    // Create a relevant summary based on scores
    const summary = generateSummary(overallScore, gdprScore, hipaaScore, pciDssScore);
    
    // Mock compliance report with real-time values
    const mockReport: ComplianceReport = {
      documentId,
      documentName,
      overallScore,
      gdprScore,
      hipaaScore,
      soc2Score,
      pciDssScore,
      risks,
      summary,
      suggestions,
      timestamp: new Date().toISOString()
    };
    
    return {
      data: mockReport,
      status: 200
    };
  } catch (error) {
    console.error('Compliance check error:', error);
    return {
      error: 'Failed to analyze the document. Please try again.',
      status: 500
    };
  }
};

function generateRisks(gdprScore: number, hipaaScore: number, soc2Score: number, pciDssScore: number) {
  const risks = [];
  
  // Add GDPR risks if score is below threshold
  if (gdprScore < 90) {
    risks.push({
      description: 'Personal data storage duration not specified',
      severity: 'medium' as const,
      regulation: 'GDPR',
      section: 'Article 5'
    });
  }
  
  if (gdprScore < 75) {
    risks.push({
      description: 'No clear process for data subject access requests',
      severity: 'high' as const,
      regulation: 'GDPR',
      section: 'Article 15'
    });
  }
  
  // Add HIPAA risks if score is below threshold
  if (hipaaScore < 85) {
    risks.push({
      description: 'Insufficient details on physical safeguards',
      severity: 'medium' as const,
      regulation: 'HIPAA',
      section: '164.310'
    });
  }
  
  if (hipaaScore < 70) {
    risks.push({
      description: 'Missing data encryption requirements',
      severity: 'high' as const,
      regulation: 'HIPAA',
      section: '164.312(a)(2)(iv)'
    });
  }
  
  // Add SOC2 risks if score is below threshold
  if (soc2Score < 80) {
    risks.push({
      description: 'Access control policy needs enhancement',
      severity: 'low' as const,
      regulation: 'SOC2',
      section: 'CC6.1'
    });
  }
  
  // Add PCI-DSS related risks
  if (pciDssScore < 85) {
    risks.push({
      description: 'Insufficient network segmentation for cardholder data environment',
      severity: 'high' as const,
      regulation: 'GDPR',
      section: 'PCI-DSS Requirement 1.3'
    });
  }
  
  if (pciDssScore < 75) {
    risks.push({
      description: 'Weak encryption standards for stored cardholder data',
      severity: 'high' as const,
      regulation: 'HIPAA',
      section: 'PCI-DSS Requirement 3.4'
    });
  }
  
  if (pciDssScore < 90) {
    risks.push({
      description: 'Inadequate access control measures',
      severity: 'medium' as const,
      regulation: 'SOC2',
      section: 'PCI-DSS Requirement 7.1'
    });
  }
  
  return risks;
}

function generateSuggestions() {
  return [
    'Implement a data retention policy that clearly specifies storage durations for all personal data',
    'Establish a formal process for handling data subject access requests with defined timelines',
    'Enhance physical safeguards documentation to include detailed security measures',
    'Implement strong encryption for all sensitive data using industry-standard algorithms',
    'Update access control policies to follow the principle of least privilege',
    'Implement network segmentation to isolate cardholder data environment',
    'Conduct regular vulnerability scanning and penetration testing',
    'Document and implement a formal incident response plan'
  ];
}

function generateSummary(overallScore: number, gdprScore: number, hipaaScore: number, pciDssScore: number) {
  if (overallScore > 85) {
    return 'This document demonstrates a strong compliance posture overall, with only minor issues to address.';
  } else if (overallScore > 70) {
    return 'This document has several compliance areas that need improvement. The most critical issues relate to ' + 
      (gdprScore < 75 ? 'GDPR data subject rights' : '') + 
      (hipaaScore < 70 ? (gdprScore < 75 ? ' and ' : '') + 'HIPAA data encryption requirements' : '') +
      (pciDssScore < 75 ? (gdprScore < 75 || hipaaScore < 70 ? ' and ' : '') + 'PCI-DSS cardholder data protection' : '') + 
      '.';
  } else {
    return 'This document has significant compliance gaps that require immediate attention across multiple regulatory frameworks.';
  }
}
