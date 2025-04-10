
import { jsPDF } from 'jspdf';
import { PredictiveAnalysis } from '@/utils/types';

interface ScoreType {
  name: string;
  key: string;
}

/**
 * Add score comparison table to the simulation PDF
 * @returns The updated Y position after adding the table
 */
export const addScoreComparisonTable = (
  pdf: jsPDF,
  analysis: PredictiveAnalysis,
  startYPos: number = 0
): number => {
  let yPos = startYPos + 5;
  
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
  const scoreTypes: ScoreType[] = [
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
  
  return yPos;
};
