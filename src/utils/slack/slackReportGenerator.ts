
import { jsPDF } from 'jspdf';
import { SlackScanResults, SlackViolation } from './types';
import { formatDistance } from 'date-fns';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';
import { addFooter } from '@/utils/audit/pdf';
import { generateVerificationMetadata } from '@/utils/audit/hashVerification';

/**
 * Generate a PDF report for a Slack scan
 */
export const generateSlackReportPDF = async (results: SlackScanResults): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
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
      pdf.text('Slack Compliance Scan Report', 20, 20);
      
      // Add horizontal line
      pdf.setDrawColor(0, 51, 102);
      pdf.setLineWidth(0.5);
      pdf.line(20, 25, 190, 25);
      
      // Add scan details
      let yPos = 40;
      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('Scan Information', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Scan ID: ${results.scanId}`, 20, yPos);
      yPos += 8;
      
      pdf.text(`Scan Time: ${new Date(results.timestamp).toLocaleString()}`, 20, yPos);
      yPos += 8;
      
      pdf.text(`Messages Scanned: ${results.scannedMessages}`, 20, yPos);
      yPos += 8;
      
      pdf.text(`Files Scanned: ${results.scannedFiles}`, 20, yPos);
      yPos += 8;
      
      pdf.text(`Violations Found: ${results.violations.length}`, 20, yPos);
      yPos += 8;
      
      if (results.status === 'completed') {
        pdf.setTextColor(0, 128, 0);
        pdf.text('Status: Completed', 20, yPos);
      } else {
        pdf.setTextColor(255, 0, 0);
        pdf.text('Status: Failed', 20, yPos);
      }
      yPos += 15;
      
      // Add violations section if any
      if (results.violations.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Detected Violations', 20, yPos);
        yPos += 10;
        
        // Create table header
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPos, 170, 8, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Severity', 22, yPos + 5);
        pdf.text('Rule', 50, yPos + 5);
        pdf.text('Channel', 100, yPos + 5);
        pdf.text('User', 140, yPos + 5);
        
        yPos += 8;
        
        // Add violations
        pdf.setFontSize(9);
        
        const maxViolationsPerPage = 20; // Limit to avoid memory issues
        const violationsToProcess = results.violations.slice(0, maxViolationsPerPage);
        
        violationsToProcess.forEach((violation, index) => {
          // Check if we need a new page
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
            
            // Add table header on new page
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPos, 170, 8, 'F');
            
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Severity', 22, yPos + 5);
            pdf.text('Rule', 50, yPos + 5);
            pdf.text('Channel', 100, yPos + 5);
            pdf.text('User', 140, yPos + 5);
            
            yPos += 8;
          }
          
          // Add row
          if (index % 2 === 0) {
            pdf.setFillColor(252, 252, 252);
            pdf.rect(20, yPos, 170, 7, 'F');
          }
          
          // Set color based on severity
          if (violation.severity === 'high') {
            pdf.setTextColor(200, 0, 0);
          } else if (violation.severity === 'medium') {
            pdf.setTextColor(200, 100, 0);
          } else {
            pdf.setTextColor(0, 0, 0);
          }
          
          pdf.text(violation.severity, 22, yPos + 5);
          pdf.setTextColor(0, 0, 0);
          
          // Truncate text if too long
          const truncateText = (text: string, maxLength: number) => {
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
          };
          
          pdf.text(truncateText(violation.rule, 40), 50, yPos + 5);
          pdf.text(truncateText(violation.channel, 30), 100, yPos + 5);
          pdf.text(truncateText(violation.user, 20), 140, yPos + 5);
          
          yPos += 7;
        });
        
        if (results.violations.length > maxViolationsPerPage) {
          yPos += 5;
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `Showing ${maxViolationsPerPage} of ${results.violations.length} violations. Export to CSV for full list.`, 
            20, yPos
          );
          yPos += 10;
        }
      } else {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 128, 0);
        pdf.text('No violations detected.', 20, yPos);
        yPos += 15;
      }
      
      // Add recommendation section
      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('Recommendations', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      
      const recommendations = [
        'Regularly scan Slack communications to ensure compliance with policies.',
        'Review detected violations and take appropriate action.',
        'Update your compliance policies if recurring patterns are detected.',
        'Conduct training for team members on proper communication practices.'
      ];
      
      recommendations.forEach(recommendation => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.text(`• ${recommendation}`, 20, yPos);
        yPos += 7;
      });
      
      // Generate verification metadata for the footer
      const mockAuditEvent = {
        id: `slack-audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Slack compliance scan',
        documentName: `Slack Scan ${new Date(results.timestamp).toLocaleString()}`,
        user: 'System',
        status: 'completed' as const,
        comments: []
      };
      
      const verificationMetadata = await generateVerificationMetadata([mockAuditEvent]);
      
      // Add footer with verification info
      addFooter(pdf, verificationMetadata);
      
      const pdfBlob = pdf.output('blob');
      resolve(pdfBlob);
    } catch (error) {
      console.error('Error generating Slack report PDF:', error);
      reject(error);
    }
  });
};

/**
 * Generate a PDF audit trail for a Slack scan
 */
export const generateSlackAuditTrailPDF = async (results: SlackScanResults): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
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
      pdf.text('Slack Audit Trail', 20, 20);
      
      // Add horizontal line
      pdf.setDrawColor(0, 51, 102);
      pdf.setLineWidth(0.5);
      pdf.line(20, 25, 190, 25);
      
      // Add scan details
      let yPos = 40;
      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('Audit Information', 20, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Scan ID: ${results.scanId}`, 20, yPos);
      yPos += 8;
      
      pdf.text(`Scan Time: ${new Date(results.timestamp).toLocaleString()}`, 20, yPos);
      yPos += 8;
      
      pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
      yPos += 15;
      
      // Add audit events (violations)
      pdf.setFontSize(14);
      pdf.setTextColor(0, 51, 102);
      pdf.text('Audit Events', 20, yPos);
      yPos += 10;
      
      if (results.violations.length === 0) {
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text('No violations detected during this scan.', 20, yPos);
        yPos += 10;
      } else {
        // Create table header
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPos, 170, 8, 'F');
        
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Time', 22, yPos + 5);
        pdf.text('Event', 55, yPos + 5);
        pdf.text('User', 110, yPos + 5);
        pdf.text('Severity', 150, yPos + 5);
        
        yPos += 8;
        
        // Format date helper
        const formatDate = (dateStr: string): string => {
          const date = new Date(dateStr);
          return date.toLocaleString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        };
        
        // Sort violations by timestamp (newest first)
        const sortedViolations = [...results.violations].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        const maxEventsPerPage = 25; // Limit to avoid memory issues
        const eventsToProcess = sortedViolations.slice(0, maxEventsPerPage);
        
        eventsToProcess.forEach((violation, index) => {
          // Check if we need a new page
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
            
            // Add table header on new page
            pdf.setFillColor(240, 240, 240);
            pdf.rect(20, yPos, 170, 8, 'F');
            
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Time', 22, yPos + 5);
            pdf.text('Event', 55, yPos + 5);
            pdf.text('User', 110, yPos + 5);
            pdf.text('Severity', 150, yPos + 5);
            
            yPos += 8;
          }
          
          // Add row
          if (index % 2 === 0) {
            pdf.setFillColor(252, 252, 252);
            pdf.rect(20, yPos, 170, 7, 'F');
          }
          
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(formatDate(violation.timestamp), 22, yPos + 5);
          
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
          
          // Truncate text if too long
          const truncateText = (text: string, maxLength: number) => {
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
          };
          
          pdf.text(truncateText(violation.rule, 45), 55, yPos + 5);
          pdf.text(truncateText(violation.user, 30), 110, yPos + 5);
          
          // Set color based on severity
          if (violation.severity === 'high') {
            pdf.setTextColor(200, 0, 0);
          } else if (violation.severity === 'medium') {
            pdf.setTextColor(200, 100, 0);
          } else {
            pdf.setTextColor(0, 100, 0);
          }
          
          pdf.text(violation.severity, 150, yPos + 5);
          
          yPos += 7;
        });
        
        if (results.violations.length > maxEventsPerPage) {
          yPos += 5;
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `Showing ${maxEventsPerPage} of ${results.violations.length} audit events. Export to CSV for full list.`, 
            20, yPos
          );
        }
      }
      
      // Generate verification metadata for the footer
      const mockAuditEvent = {
        id: `slack-audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: 'Slack audit trail export',
        documentName: `Slack Audit ${new Date(results.timestamp).toLocaleString()}`,
        user: 'System',
        status: 'completed' as const,
        comments: []
      };
      
      const verificationMetadata = await generateVerificationMetadata([mockAuditEvent]);
      
      // Add footer with verification info
      addFooter(pdf, verificationMetadata);
      
      const pdfBlob = pdf.output('blob');
      resolve(pdfBlob);
    } catch (error) {
      console.error('Error generating Slack audit trail PDF:', error);
      reject(error);
    }
  });
};

/**
 * Generate standardized filenames for reports
 */
export const getSlackReportFileName = (results: SlackScanResults): string => {
  const date = new Date(results.timestamp);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `slack-report-${formattedDate}.pdf`;
};

export const getSlackAuditFileName = (results: SlackScanResults): string => {
  const date = new Date(results.timestamp);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return `slack-audit-${formattedDate}.pdf`;
};

/**
 * Add the scan to history storage
 */
export const addSlackScanToHistory = (results: SlackScanResults) => {
  try {
    const { addScanHistory } = useServiceHistoryStore.getState();
    
    // Extract date from timestamp
    const scanDate = new Date(results.timestamp);
    const formattedDate = scanDate.toISOString();
    
    // Create a friendly document name
    const documentName = `Slack Scan ${scanDate.toLocaleString()}`;
    
    addScanHistory({
      serviceId: results.scanId,
      serviceName: 'Slack Compliance Scan',
      scanDate: formattedDate,
      itemsScanned: results.scannedMessages,
      violationsFound: results.violations.length,
      documentName,
      fileName: getSlackReportFileName(results),
      documentId: results.scanId,
      industry: 'Technology',
      regulations: ['Data Privacy', 'Information Security'],
      timestamp: formattedDate, // This is now a valid field in the ScanHistoryItem interface
    });
    
    console.log('Slack scan added to history:', documentName);
  } catch (error) {
    console.error('Failed to add scan to history:', error);
  }
};
