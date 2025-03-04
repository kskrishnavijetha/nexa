
import { ApiResponse, ComplianceReport } from './types';

/**
 * Generate a downloadable compliance report PDF
 */
export const generateReportPDF = async (report: ComplianceReport): Promise<ApiResponse<Blob>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
