/**
 * Service for making API calls
 */

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Upload a file to the server
 */
export const uploadFile = async (file: File): Promise<ApiResponse<{ id: string }>> => {
  // For now, we'll simulate an API call with a timeout
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Simulate API latency (shorter for better UX)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock successful response (would be a real API call in production)
    return {
      data: { id: 'doc_' + Math.random().toString(36).substr(2, 9) },
      status: 200
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      error: 'Failed to upload the file. Please try again.',
      status: 500
    };
  }
};

/**
 * Risk severity levels
 */
export type RiskSeverity = 'high' | 'medium' | 'low';

/**
 * Risk item structure
 */
export interface RiskItem {
  description: string;
  severity: RiskSeverity;
  regulation: 'GDPR' | 'HIPAA' | 'SOC2';
  section?: string;
}

/**
 * Compliance report structure
 */
export interface ComplianceReport {
  documentId: string;
  documentName: string;
  overallScore: number;
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
  pciDssScore?: number;
  risks: RiskItem[];
  summary: string;
  timestamp: string;
  suggestions?: string[];
}

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
    const risks: RiskItem[] = [];
    
    // Add GDPR risks if score is below threshold
    if (gdprScore < 90) {
      risks.push({
        description: 'Personal data storage duration not specified',
        severity: 'medium',
        regulation: 'GDPR',
        section: 'Article 5'
      });
    }
    
    if (gdprScore < 75) {
      risks.push({
        description: 'No clear process for data subject access requests',
        severity: 'high',
        regulation: 'GDPR',
        section: 'Article 15'
      });
    }
    
    // Add HIPAA risks if score is below threshold
    if (hipaaScore < 85) {
      risks.push({
        description: 'Insufficient details on physical safeguards',
        severity: 'medium',
        regulation: 'HIPAA',
        section: '164.310'
      });
    }
    
    if (hipaaScore < 70) {
      risks.push({
        description: 'Missing data encryption requirements',
        severity: 'high',
        regulation: 'HIPAA',
        section: '164.312(a)(2)(iv)'
      });
    }
    
    // Add SOC2 risks if score is below threshold
    if (soc2Score < 80) {
      risks.push({
        description: 'Access control policy needs enhancement',
        severity: 'low',
        regulation: 'SOC2',
        section: 'CC6.1'
      });
    }
    
    // Add PCI-DSS related risks
    if (pciDssScore < 85) {
      risks.push({
        description: 'Insufficient network segmentation for cardholder data environment',
        severity: 'high',
        regulation: 'GDPR',
        section: 'PCI-DSS Requirement 1.3'
      });
    }
    
    if (pciDssScore < 75) {
      risks.push({
        description: 'Weak encryption standards for stored cardholder data',
        severity: 'high',
        regulation: 'HIPAA',
        section: 'PCI-DSS Requirement 3.4'
      });
    }
    
    if (pciDssScore < 90) {
      risks.push({
        description: 'Inadequate access control measures',
        severity: 'medium',
        regulation: 'SOC2',
        section: 'PCI-DSS Requirement 7.1'
      });
    }
    
    // Generate suggestions based on risks
    const suggestions = [
      'Implement a data retention policy that clearly specifies storage durations for all personal data',
      'Establish a formal process for handling data subject access requests with defined timelines',
      'Enhance physical safeguards documentation to include detailed security measures',
      'Implement strong encryption for all sensitive data using industry-standard algorithms',
      'Update access control policies to follow the principle of least privilege',
      'Implement network segmentation to isolate cardholder data environment',
      'Conduct regular vulnerability scanning and penetration testing',
      'Document and implement a formal incident response plan'
    ];
    
    // Create a relevant summary based on scores and risks
    let summary = '';
    
    if (overallScore > 85) {
      summary = 'This document demonstrates a strong compliance posture overall, with only minor issues to address.';
    } else if (overallScore > 70) {
      summary = 'This document has several compliance areas that need improvement. The most critical issues relate to ' + 
        (gdprScore < 75 ? 'GDPR data subject rights' : '') + 
        (hipaaScore < 70 ? (gdprScore < 75 ? ' and ' : '') + 'HIPAA data encryption requirements' : '') +
        (pciDssScore < 75 ? (gdprScore < 75 || hipaaScore < 70 ? ' and ' : '') + 'PCI-DSS cardholder data protection' : '') + 
        '.';
    } else {
      summary = 'This document has significant compliance gaps that require immediate attention across multiple regulatory frameworks.';
    }
    
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

/**
 * Generate a downloadable compliance report PDF
 * Instead of returning a file path, this now returns the PDF content as a Blob
 */
export const generateReportPDF = async (report: ComplianceReport): Promise<ApiResponse<Blob>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real application, this would generate a proper PDF with formatting
    // For our demo, we'll create a simple text-based PDF simulation
    
    // Create the report content as a string
    const reportContent = `
COMPLIANCE ANALYSIS REPORT
==========================
Document: ${report.documentName}
Generated: ${new Date(report.timestamp).toLocaleString()}

COMPLIANCE SCORES
----------------
Overall Compliance: ${report.overallScore}%
GDPR Compliance: ${report.gdprScore}%
HIPAA Compliance: ${report.hipaaScore}%
SOC 2 Compliance: ${report.soc2Score}%
PCI-DSS Compliance: ${report.pciDssScore}%

SUMMARY
-------
${report.summary}

IMPROVEMENT SUGGESTIONS
----------------------
${report.suggestions?.join('\n\n') || 'No suggestions provided.'}

COMPLIANCE ISSUES
---------------
${report.risks.map(risk => 
  `[${risk.severity.toUpperCase()}] ${risk.description}
   Regulation: ${risk.regulation} ${risk.section ? `- ${risk.section}` : ''}`
).join('\n\n')}
`;

    // Create a Blob from the content
    // In a real application, you would use a PDF generation library
    const blob = new Blob([reportContent], { type: 'application/pdf' });
    
    return {
      data: blob,
      status: 200
    };
  } catch (error) {
    console.error('Report generation error:', error);
    return {
      error: 'Failed to generate the PDF report. Please try again.',
      status: 500
    };
  }
};
