
import { jsPDF } from 'jspdf';
import { PredictiveAnalysis } from '@/utils/types';
import { addFooter } from '@/utils/audit/pdf/addFooter';
import { toast } from 'sonner';

/**
 * Generate a PDF report for a simulation analysis
 */
export const exportSimulationPDF = async (
  analysis: PredictiveAnalysis
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Use setTimeout to ensure UI doesn't freeze during PDF generation
    setTimeout(async () => {
      try {
        console.log('[simulationExport] Generating simulation PDF report');
        
        // Create PDF with optimized settings
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
          compress: true,
          putOnlyUsedFonts: true
        });
        
        // Set document properties
        pdf.setProperties({
          title: `Simulation Analysis - ${analysis.scenarioName}`,
          subject: 'Compliance Scenario Simulation Results',
          creator: 'Compliance Report Generator',
          keywords: 'compliance,simulation,scenario'
        });
        
        // Add title
        pdf.setFontSize(22);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Scenario Simulation Report', 20, 20);
        
        // Add horizontal line
        pdf.setDrawColor(0, 51, 102);
        pdf.setLineWidth(0.5);
        pdf.line(20, 25, 190, 25);
        
        // Add scenario details
        let yPos = 40;
        pdf.setFontSize(16);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Scenario Information', 20, yPos);
        
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        yPos += 10;
        pdf.text(`Scenario: ${analysis.scenarioName}`, 20, yPos);
        yPos += 7;
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPos);
        yPos += 7;
        
        if (analysis.scenarioDescription) {
          yPos += 5;
          pdf.setFontSize(11);
          pdf.text('Description:', 20, yPos);
          yPos += 7;
          
          // Handle description text wrapping
          const descriptionLines = pdf.splitTextToSize(analysis.scenarioDescription, 170);
          pdf.text(descriptionLines, 20, yPos);
          yPos += (descriptionLines.length * 6) + 10;
        }
        
        // Add score comparison section
        yPos += 5;
        pdf.setFontSize(16);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Compliance Score Comparison', 20, yPos);
        yPos += 10;
        
        // Create score comparison table
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        // Table header
        const scoreHeaders = ['Metric', 'Original Score', 'Predicted Score', 'Difference'];
        const columnWidths = [50, 40, 40, 40];
        let xPos = 20;
        
        // Draw table header
        pdf.setFillColor(240, 240, 240);
        pdf.rect(xPos, yPos, columnWidths.reduce((a, b) => a + b, 0), 8, 'F');
        pdf.setFont('helvetica', 'bold');
        
        for (let i = 0; i < scoreHeaders.length; i++) {
          pdf.text(scoreHeaders[i], xPos + 5, yPos + 5);
          xPos += columnWidths[i];
        }
        
        // Table content for each score type
        const scoreTypes = [
          { name: 'Overall', key: 'overall' },
          { name: 'GDPR', key: 'gdpr' },
          { name: 'HIPAA', key: 'hipaa' },
          { name: 'SOC 2', key: 'soc2' },
          { name: 'PCI-DSS', key: 'pciDss' }
        ];
        
        // Draw score rows
        pdf.setFont('helvetica', 'normal');
        yPos += 8;
        
        scoreTypes.forEach((type, index) => {
          xPos = 20;
          const original = analysis.originalScores?.[type.key as keyof typeof analysis.originalScores] || 0;
          const predicted = analysis.predictedScores?.[type.key as keyof typeof analysis.predictedScores] || 0;
          const diff = analysis.scoreDifferences?.[type.key as keyof typeof analysis.scoreDifferences] || 0;
          
          // Alternate row background
          if (index % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(xPos, yPos, columnWidths.reduce((a, b) => a + b, 0), 8, 'F');
          }
          
          // Metric name
          pdf.text(type.name, xPos + 5, yPos + 5);
          xPos += columnWidths[0];
          
          // Original score
          pdf.text(original.toString(), xPos + 5, yPos + 5);
          xPos += columnWidths[1];
          
          // Predicted score
          pdf.text(predicted.toString(), xPos + 5, yPos + 5);
          xPos += columnWidths[2];
          
          // Difference
          pdf.setTextColor(diff > 0 ? 0 : (diff < 0 ? 255 : 0), 0, 0);
          pdf.text((diff > 0 ? '+' : '') + diff.toString(), xPos + 5, yPos + 5);
          pdf.setTextColor(0, 0, 0);
          
          yPos += 8;
        });
        
        // Add risk trends section
        yPos += 15;
        pdf.setFontSize(16);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Risk Trend Analysis', 20, yPos);
        yPos += 10;
        
        // Create risk trends table
        if (analysis.riskTrends && analysis.riskTrends.length > 0) {
          // Table header
          const riskHeaders = ['Regulation', 'Trend', 'Impact', 'Description'];
          const riskColumnWidths = [30, 25, 25, 100];
          xPos = 20;
          
          // Draw table header
          pdf.setFillColor(240, 240, 240);
          pdf.rect(xPos, yPos, riskColumnWidths.reduce((a, b) => a + b, 0), 8, 'F');
          pdf.setFont('helvetica', 'bold');
          
          for (let i = 0; i < riskHeaders.length; i++) {
            pdf.text(riskHeaders[i], xPos + 5, yPos + 5);
            xPos += riskColumnWidths[i];
          }
          
          // Draw risk trend rows
          pdf.setFont('helvetica', 'normal');
          yPos += 8;
          
          // Limit to prevent overly long PDFs
          const maxRisks = Math.min(analysis.riskTrends.length, 10);
          
          for (let i = 0; i < maxRisks; i++) {
            const risk = analysis.riskTrends[i];
            xPos = 20;
            
            // Check if we need a new page
            if (yPos > 260) {
              pdf.addPage();
              yPos = 20;
            }
            
            // Alternate row background
            if (i % 2 === 0) {
              pdf.setFillColor(250, 250, 250);
              pdf.rect(xPos, yPos, riskColumnWidths.reduce((a, b) => a + b, 0), 16, 'F');
            }
            
            // Regulation
            pdf.text(risk.regulation, xPos + 5, yPos + 5);
            xPos += riskColumnWidths[0];
            
            // Trend
            const trendText = risk.trend.charAt(0).toUpperCase() + risk.trend.slice(1);
            pdf.text(trendText, xPos + 5, yPos + 5);
            xPos += riskColumnWidths[1];
            
            // Impact
            pdf.text(risk.impact.toUpperCase(), xPos + 5, yPos + 5);
            xPos += riskColumnWidths[2];
            
            // Description (with wrapping)
            const riskLines = pdf.splitTextToSize(risk.description, riskColumnWidths[3] - 10);
            pdf.text(riskLines, xPos + 5, yPos + 5);
            
            // Increase row height if needed for wrapped text
            const lineHeight = Math.max(16, riskLines.length * 6 + 4);
            yPos += lineHeight;
          }
        } else {
          pdf.setFontSize(11);
          pdf.text("No risk trends available for this simulation.", 20, yPos + 10);
          yPos += 20;
        }
        
        // Add recommendations section
        yPos += 15;
        
        // Check if we need a new page
        if (yPos > 240) {
          pdf.addPage();
          yPos = 20;
        }
        
        pdf.setFontSize(16);
        pdf.setTextColor(0, 51, 102);
        pdf.text('Recommendations', 20, yPos);
        yPos += 10;
        
        // Add recommendations as bullet points
        if (analysis.recommendations && analysis.recommendations.length > 0) {
          pdf.setFontSize(11);
          pdf.setTextColor(0, 0, 0);
          
          analysis.recommendations.forEach((recommendation, index) => {
            // Check if we need a new page
            if (yPos > 270) {
              pdf.addPage();
              yPos = 20;
            }
            
            const bulletedText = `• ${recommendation}`;
            const recommendationLines = pdf.splitTextToSize(bulletedText, 170);
            pdf.text(recommendationLines, 20, yPos);
            yPos += (recommendationLines.length * 6) + 5;
          });
        } else {
          pdf.setFontSize(11);
          pdf.text("No recommendations available for this simulation.", 20, yPos + 5);
          yPos += 15;
        }
        
        // Add disclaimer
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text("Note: This is a simulation result based on the scenario parameters and does not guarantee actual compliance outcomes.", 20, 280);
        
        // Add footer with page numbers to all pages
        await addFooter(pdf);
        
        // Generate the PDF as a blob
        const pdfBlob = pdf.output('blob');
        console.log('[simulationExport] PDF generated successfully');
        resolve(pdfBlob);
      } catch (error) {
        console.error('[simulationExport] Error generating PDF:', error);
        reject(error);
      }
    }, 10);
  });
};
