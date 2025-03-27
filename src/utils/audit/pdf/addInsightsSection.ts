
import { jsPDF } from "jspdf";
import { AIInsight } from '../types';

/**
 * Add AI insights section to the PDF document
 */
export const addInsightsSection = (doc: jsPDF, insights: AIInsight[], startY: number): number => {
  let yPos = startY;
  
  // Add AI Insights section heading
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('AI-Generated Insights', 20, yPos);
  yPos += 10;
  
  // Add insights
  doc.setFontSize(10);
  insights.forEach((insight) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Set color based on insight type
    if (insight.type === 'recommendation') {
      doc.setTextColor(0, 102, 0); // Green for recommendations
    } else if (insight.type === 'warning') {
      doc.setTextColor(153, 76, 0); // Orange for warnings
    } else {
      doc.setTextColor(0, 0, 0); // Black for regular observations
    }
    
    // Format and display insight with bullet point
    const insightLines = doc.splitTextToSize(`• ${insight.text}`, 160);
    doc.text(insightLines, 25, yPos);
    yPos += (insightLines.length * 5) + 5;
  });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  return yPos;
};
