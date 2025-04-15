
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

interface VerificationReportData {
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  computedHash: string;
  comparisonHash: string;
  verificationResult: 'match' | 'mismatch';
  verifiedBy: string;
}

/**
 * Generates a PDF verification report for document hash verification
 */
export const generateVerificationReport = async (
  data: VerificationReportData
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        console.log('[verificationReport] Generating verification report');
        
        // Create PDF document
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true
        });
        
        // Add title
        pdf.setFontSize(22);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Document Hash Verification Report', 20, 20);
        
        // Add horizontal line
        pdf.setDrawColor(0, 51, 102);
        pdf.setLineWidth(0.5);
        pdf.line(20, 25, 190, 25);
        
        // Add document information section
        pdf.setFontSize(16);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Document Information', 20, 40);
        
        // Set normal font for content
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        
        // Add document details
        let yPos = 50;
        pdf.text(`File name: ${data.fileName}`, 20, yPos);
        yPos += 7;
        pdf.text(`File size: ${data.fileSize}`, 20, yPos);
        yPos += 7;
        pdf.text(`File type: ${data.fileType}`, 20, yPos);
        yPos += 7;
        pdf.text(`Uploaded at: ${data.uploadedAt}`, 20, yPos);
        yPos += 15;
        
        // Add verification section
        pdf.setFontSize(16);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Verification Results', 20, yPos);
        yPos += 10;
        
        // Add computed hash
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Computed hash (SHA-256):`, 20, yPos);
        yPos += 7;
        pdf.setFont('courier', 'normal');
        pdf.text(`${data.computedHash}`, 25, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 10;
        
        // Add comparison hash
        pdf.text(`Comparison hash:`, 20, yPos);
        yPos += 7;
        pdf.setFont('courier', 'normal');
        pdf.text(`${data.comparisonHash}`, 25, yPos);
        pdf.setFont('helvetica', 'normal');
        yPos += 15;
        
        // Add verification result with appropriate color
        pdf.setFontSize(14);
        if (data.verificationResult === 'match') {
          pdf.setTextColor(0, 128, 0); // Green for match
          pdf.text('✓ VERIFICATION SUCCESSFUL', 20, yPos);
          yPos += 7;
          pdf.setFontSize(11);
          pdf.text('The document hash matches the comparison hash.', 20, yPos);
        } else {
          pdf.setTextColor(220, 0, 0); // Red for mismatch
          pdf.text('✗ VERIFICATION FAILED', 20, yPos);
          yPos += 7;
          pdf.setFontSize(11);
          pdf.text('The document hash does not match the comparison hash.', 20, yPos);
        }
        yPos += 15;
        
        // Add footer information
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Verified by: ${data.verifiedBy}`, 20, yPos);
        yPos += 7;
        pdf.text(`Report generated on: ${new Date().toLocaleString()}`, 20, yPos);
        yPos += 7;
        pdf.text('This report provides cryptographic evidence of document integrity.', 20, yPos);
        
        // Add page number at the bottom
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          pdf.setPage(i);
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`Page ${i} of ${pageCount}`, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
        }
        
        // Generate PDF blob
        const pdfBlob = pdf.output('blob');
        resolve(pdfBlob);
        
      } catch (error) {
        console.error('[verificationReport] Error generating report:', error);
        reject(error);
      }
    }, 10); // Small timeout to prevent UI blocking
  });
};

/**
 * Helper function to generate a standardized filename for the verification report
 */
export const getVerificationReportFileName = (fileName: string): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedName = fileName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `verification-report-${sanitizedName}-${formattedDate}.pdf`;
};

/**
 * Format file size in bytes to a human-readable format
 */
export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};
