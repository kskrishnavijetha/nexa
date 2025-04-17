
import { jsPDF } from 'jspdf';

// Define the VerificationMetadata type directly in this file since it's not exported from hashVerification
export interface VerificationMetadata {
  hash?: string;
  shortHash?: string;
  timestamp?: string;
  verificationMethod?: string;
  eventCount?: number;
}

/**
 * Add footer with page numbers and verification information to all pages
 */
export const addFooter = async (
  pdf: jsPDF, 
  verificationMetadata?: VerificationMetadata
): Promise<void> => {
  // Get total page count - fixed to use internal.pages.length
  const totalPages = pdf.internal.pages.length - 1; // Subtract 1 as jsPDF page array is 1-indexed
  
  // Add footer to each page
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    
    // Add page numbers at the bottom
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Page ${i} of ${totalPages}`, 
      pdf.internal.pageSize.width / 2, 
      pdf.internal.pageSize.height - 10, 
      { align: 'center' }
    );
    
    // Add verification information if available
    if (verificationMetadata) {
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      const verificationText = `Verification Hash: ${verificationMetadata.shortHash || ''}`;
      pdf.text(
        verificationText,
        pdf.internal.pageSize.width - 15, 
        pdf.internal.pageSize.height - 7, 
        { align: 'right' }
      );
    }
    
    // Add timestamp
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    const timestamp = `Generated: ${new Date().toISOString().split('T')[0]}`;
    pdf.text(
      timestamp,
      15, 
      pdf.internal.pageSize.height - 7, 
      { align: 'left' }
    );
  }
};
