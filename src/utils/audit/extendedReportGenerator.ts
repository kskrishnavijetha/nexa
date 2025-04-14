
import { jsPDF } from 'jspdf';
import { AuditEvent } from '@/components/audit/types';
import { ComplianceReport } from '@/utils/types';
import { ExtendedReport, ReportConfig, ComplianceMatrixItem, RemediationItem } from '@/components/audit/extended-report/types';
import { generateAuditHash } from './hashVerification';
import { addFooter } from './pdf/addFooter';
import { addCoverPage } from './pdf/extendedReport/addCoverPage';
import { addExecutiveSummaryPage } from './pdf/extendedReport/addExecutiveSummaryPage';
import { addComplianceMatrixPage } from './pdf/extendedReport/addComplianceMatrixPage';
import { addAuditTimelinePage } from './pdf/extendedReport/addAuditTimelinePage';
import { addRemediationPage } from './pdf/extendedReport/addRemediationPage';
import { addSignatureAndVerificationPage } from './pdf/extendedReport/addSignatureAndVerificationPage';
import { addAppendixPage } from './pdf/extendedReport/addAppendixPage';
import { mapToIndustryType } from './industryUtils';

/**
 * Generate an extended audit-ready report with detailed compliance information
 */
export const generateExtendedReport = async (
  baseReport: ComplianceReport,
  auditEvents: AuditEvent[],
  config: ReportConfig
): Promise<ExtendedReport> => {
  // Generate compliance matrix from report risks
  const complianceMatrix: ComplianceMatrixItem[] = generateComplianceMatrix(baseReport, config.complianceTypes);
  
  // Generate remediation suggestions
  const remediations: RemediationItem[] = generateRemediations(baseReport);
  
  // Generate report hash for document integrity verification
  // Convert the document ID into a proper AuditEvent for the hash
  const documentIdEvent: AuditEvent = {
    id: baseReport.documentId,
    timestamp: new Date().toISOString(),
    action: 'report_generation',
    documentName: baseReport.documentName,
    user: 'system'
  };
  
  const documentHash = await generateAuditHash([...auditEvents, documentIdEvent]);
  
  // Create PDF document
  const pdf = await generatePDF(baseReport, auditEvents, complianceMatrix, remediations, config, documentHash);
  
  // Return the complete report object
  return {
    config,
    baseReport,
    auditEvents,
    complianceMatrix,
    remediations,
    documentHash,
    pdfBlob: pdf
  };
};

/**
 * Generate compliance matrix items from the report risks
 */
function generateComplianceMatrix(report: ComplianceReport, complianceTypes: string[]): ComplianceMatrixItem[] {
  if (!report.risks || report.risks.length === 0) {
    return [];
  }

  return report.risks.map(risk => {
    // Map risk severity to matrix severity
    let severity: 'Critical' | 'High' | 'Medium' | 'Low';
    switch (risk.severity) {
      case 'critical':
        severity = 'Critical';
        break;
      case 'high':
        severity = 'High';
        break;
      case 'medium':
        severity = 'Medium';
        break;
      default:
        severity = 'Low';
    }
    
    // Determine compliance status based on severity
    let status: 'Pass' | 'Warning' | 'Failed' | 'N/A';
    switch (severity) {
      case 'Critical':
      case 'High':
        status = 'Failed';
        break;
      case 'Medium':
        status = 'Warning';
        break;
      case 'Low':
        status = 'Pass';
        break;
      default:
        status = 'N/A';
    }
    
    // Get regulation mapping from risk or generate default
    const regulation = risk.regulation || 
      (complianceTypes.includes('GDPR') ? 'GDPR Art. 5' :
       complianceTypes.includes('HIPAA') ? 'HIPAA §164.306' :
       complianceTypes.includes('SOC 2') ? 'SOC 2 CC6.1' : 'General Compliance');
    
    // Determine category based on risk title or description
    let category = 'General Compliance';
    if (risk.title?.toLowerCase().includes('data') || risk.description?.toLowerCase().includes('data')) {
      category = 'Data Privacy';
    } else if (risk.title?.toLowerCase().includes('access') || risk.description?.toLowerCase().includes('access')) {
      category = 'Access Control';
    } else if (risk.title?.toLowerCase().includes('encrypt') || risk.description?.toLowerCase().includes('encrypt')) {
      category = 'Encryption';
    } else if (risk.title?.toLowerCase().includes('log') || risk.description?.toLowerCase().includes('log')) {
      category = 'Logging & Monitoring';
    }
    
    return {
      category,
      regulation: risk.section ? `${regulation} (${risk.section})` : regulation,
      status,
      severity,
      details: risk.description
    };
  });
}

/**
 * Generate remediation suggestions based on report risks
 */
function generateRemediations(report: ComplianceReport): RemediationItem[] {
  if (!report.risks || report.risks.length === 0) {
    return [];
  }
  
  return report.risks.map(risk => {
    // Map risk severity to remediation priority
    let priority: 'Critical' | 'High' | 'Medium' | 'Low';
    switch (risk.severity) {
      case 'critical':
        priority = 'Critical';
        break;
      case 'high':
        priority = 'High';
        break;
      case 'medium':
        priority = 'Medium';
        break;
      default:
        priority = 'Low';
    }
    
    // Generate estimated fix time based on severity
    let timeToFix: string;
    switch (priority) {
      case 'Critical':
        timeToFix = 'Immediate (24-48 hours)';
        break;
      case 'High':
        timeToFix = '1 week';
        break;
      case 'Medium':
        timeToFix = '2-4 weeks';
        break;
      default:
        timeToFix = '1-3 months';
    }
    
    // Extract title from risk or generate from description
    const title = risk.title || (risk.description?.split('.')[0] + '.');
    
    // Create remediation guidance from risk description
    let description = risk.mitigation || 
      `Review and address the ${priority.toLowerCase()} severity issue related to ${risk.section || 'compliance requirements'}.`;
    
    if (risk.description && !description.includes(risk.description)) {
      description += ` Issue: ${risk.description}`;
    }
    
    return {
      title,
      description,
      priority,
      timeToFix,
      relatedRegulation: risk.regulation
    };
  });
}

/**
 * Generate the complete PDF document with all sections
 */
async function generatePDF(
  report: ComplianceReport,
  auditEvents: AuditEvent[],
  complianceMatrix: ComplianceMatrixItem[],
  remediations: RemediationItem[],
  config: ReportConfig,
  documentHash: string
): Promise<Blob> {
  return new Promise((resolve) => {
    // Use setTimeout to avoid UI blocking
    setTimeout(async () => {
      try {
        console.log('[extendedReportGenerator] Generating extended PDF report');
        
        // Create new PDF document with optimized settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        // Set document properties
        pdf.setProperties({
          title: `${config.reportTitle} - ${report.documentName}`,
          subject: 'Extended Audit-Ready Compliance Report',
          author: config.organizationName,
          keywords: `compliance,audit,${report.industry},${config.complianceTypes.join(',')}`
        });
        
        // Add cover page
        addCoverPage(pdf, config, report);
        
        // Add executive summary
        addExecutiveSummaryPage(pdf, report, config);
        
        // Add compliance matrix page
        addComplianceMatrixPage(pdf, complianceMatrix, config);
        
        // Add audit timeline
        addAuditTimelinePage(pdf, auditEvents);
        
        // Add remediation suggestions
        addRemediationPage(pdf, remediations);
        
        // Add signature and verification page
        addSignatureAndVerificationPage(pdf, documentHash, config);
        
        // Add appendix if enabled
        if (config.includeAppendix) {
          addAppendixPage(pdf, report, config);
        }
        
        // Add common footer to all pages with page numbers
        await addFooter(pdf);
        
        // Generate the PDF as a blob
        const pdfBlob = pdf.output('blob');
        console.log('[extendedReportGenerator] PDF generated successfully');
        resolve(pdfBlob);
      } catch (error) {
        console.error('[extendedReportGenerator] Error generating PDF:', error);
        // Return a minimal valid PDF in case of error
        const errorPdf = new jsPDF();
        errorPdf.text('Error generating report', 20, 20);
        resolve(errorPdf.output('blob'));
      }
    }, 10);
  });
}
