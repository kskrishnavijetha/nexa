
import { jsPDF } from 'jspdf';
import { CompanyDetails } from '@/components/audit/types';
import { getAuditEventsForDocument } from '@/components/audit/hooks/mockAuditData';
import { addCoverPage } from './pdf/extendedReport/addCoverPage';
import { addExecutiveSummaryPage } from './pdf/extendedReport/addExecutiveSummaryPage';
import { addComplianceMatrixPage } from './pdf/extendedReport/addComplianceMatrixPage';
import { addAuditTimelinePage } from './pdf/extendedReport/addAuditTimelinePage';
import { addRemediationPage } from './pdf/extendedReport/addRemediationPage';
import { addIntegrityPage } from './pdf/extendedReport/addIntegrityPage';
import { addAppendixPage } from './pdf/extendedReport/addAppendixPage';
import { addChartsPage } from './pdf/extendedReport/addChartsPage';
import { generateVerificationMetadata } from './hashVerification';
import { Industry } from '@/utils/types';

/**
 * Generate an extended audit-ready report as a PDF
 */
export const generateExtendedAuditReport = async (
  documentName: string,
  userId: string | null,
  companyDetails?: CompanyDetails,
  industry?: Industry
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        console.log(`[extendedReport] Generating extended report for ${documentName}`);
        
        // Get audit events for this document - ensure we await the result
        const auditEvents = await getAuditEventsForDocument(documentName);
        
        // Generate verification metadata for integrity
        const verificationMetadata = await generateVerificationMetadata(auditEvents);
        
        // Capture chart images if any charts exist in the document
        const chartImage = await captureChartImage();
        
        // Create PDF with optimized settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true
        });
        
        // Add cover page
        addCoverPage(pdf, {
          documentName,
          companyDetails,
          // Use industry from companyDetails first, then fall back to the parameter
          industry: companyDetails?.industry || industry,
          verificationMetadata,
          region: companyDetails?.region
        });
        
        // Add executive summary
        pdf.addPage();
        addExecutiveSummaryPage(pdf, {
          documentName,
          auditEvents,
          industry: companyDetails?.industry || industry,
          companyDetails
        });
        
        // Add charts page with visualizations (new)
        pdf.addPage();
        addChartsPage(pdf, {
          documentName,
          auditEvents,
          industry: companyDetails?.industry || industry,
          chartImage
        });
        
        // Add compliance matrix
        pdf.addPage();
        addComplianceMatrixPage(pdf, {
          documentName,
          auditEvents,
          companyDetails
        });
        
        // Add audit timeline
        pdf.addPage();
        addAuditTimelinePage(pdf, auditEvents, documentName);
        
        // Add remediation suggestions
        pdf.addPage();
        addRemediationPage(pdf, auditEvents, documentName);
        
        // Add integrity verification
        pdf.addPage();
        addIntegrityPage(pdf, {
          documentName,
          verificationMetadata
        });
        
        // Add appendix if needed
        pdf.addPage();
        addAppendixPage(pdf, {
          documentName,
          industry: companyDetails?.industry || industry,
          region: companyDetails?.region,
          companyDetails
        });
        
        // Generate the PDF as a blob and download
        const pdfBlob = pdf.output('blob');
        
        // Create download link
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `extended-audit-report-${documentName.replace(/\s+/g, '-')}.pdf`;
          
        // Trigger download
        document.body.appendChild(link);
        link.click();
          
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        resolve(pdfBlob);
      } catch (error) {
        console.error('[extendedReport] Error generating PDF:', error);
        reject(error);
      }
    }, 10);
  });
};

/**
 * Helper function to capture chart images from the DOM
 */
const captureChartImage = async (): Promise<string | undefined> => {
  // Look for chart containers in the document
  const chartContainers = [
    '.compliance-charts-container',
    '.risk-chart-container',
    '.audit-chart'
  ];
  
  for (const selector of chartContainers) {
    const container = document.querySelector(selector);
    if (container) {
      try {
        // Use html2canvas to capture the chart
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(container as HTMLElement, {
          scale: 2, // Higher resolution
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Failed to capture chart:', error);
      }
    }
  }
  
  return undefined;
};
