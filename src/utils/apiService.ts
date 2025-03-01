
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
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
  risks: RiskItem[];
  summary: string;
  timestamp: string;
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
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock compliance report (would be a real API call in production)
    const mockReport: ComplianceReport = {
      documentId,
      documentName,
      overallScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      gdprScore: Math.floor(Math.random() * 40) + 60,
      hipaaScore: Math.floor(Math.random() * 40) + 60,
      soc2Score: Math.floor(Math.random() * 40) + 60,
      risks: [
        {
          description: 'Personal data storage duration not specified',
          severity: 'medium',
          regulation: 'GDPR',
          section: 'Article 5'
        },
        {
          description: 'No clear process for data subject access requests',
          severity: 'high',
          regulation: 'GDPR',
          section: 'Article 15'
        },
        {
          description: 'Insufficient details on physical safeguards',
          severity: 'medium',
          regulation: 'HIPAA',
          section: '164.310'
        },
        {
          description: 'Access control policy needs enhancement',
          severity: 'low',
          regulation: 'SOC2',
          section: 'CC6.1'
        },
        {
          description: 'Missing data encryption requirements',
          severity: 'high',
          regulation: 'HIPAA',
          section: '164.312(a)(2)(iv)'
        }
      ],
      summary: 'This document has several compliance areas that need improvement. The most critical issues relate to GDPR data subject rights and HIPAA data encryption requirements.',
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
 * Generate a downloadable compliance report
 */
export const generateReportPDF = async (report: ComplianceReport): Promise<ApiResponse<string>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, this would generate a PDF on the server
    // For now, we'll just return a success message with a mock URL
    
    return {
      data: `compliance-report-${report.documentId}.pdf`,
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
