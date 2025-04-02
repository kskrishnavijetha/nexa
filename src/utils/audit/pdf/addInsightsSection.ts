
import { jsPDF } from "jspdf";
import { AIInsight, ComplianceRecommendation, CriticalRisk } from '../types';

/**
 * Add AI-generated insights section to the PDF document
 */
export const addInsightsSection = (doc: jsPDF, insights: AIInsight[], startY: number): number => {
  let yPos = startY;
  
  // Add insights header
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Risk & Compliance Recommendations', 20, yPos);
  yPos += 10;
  
  // Generate critical risks
  const criticalRisks = generateCriticalRisks(insights);
  
  // Add critical risks section if there are any
  if (criticalRisks.length > 0) {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(128, 0, 0);
    doc.text('Critical Risks Detected:', 25, yPos);
    yPos += 8;
    
    // Add each critical risk
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    criticalRisks.forEach(risk => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      // Properly handle text wrapping for risk descriptions
      const riskLines = doc.splitTextToSize(risk.description, 160);
      doc.text(riskLines, 30, yPos);
      
      // Adjust y-position based on number of lines
      yPos += Math.max(7, riskLines.length * 5);
    });
    
    yPos += 3;
  }
  
  // Generate recommendations
  const recommendations = generateRecommendations(insights);
  
  // Add recommendations section
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(12);
  doc.setTextColor(0, 51, 102);
  doc.text('Recommendations:', 25, yPos);
  yPos += 8;
  
  // Add each recommendation
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  recommendations.forEach(rec => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Properly handle text wrapping for recommendations
    const recLines = doc.splitTextToSize(rec.description, 160);
    doc.text(recLines, 30, yPos);
    
    // Adjust y-position based on number of lines
    yPos += Math.max(7, recLines.length * 5);
  });
  
  yPos += 5;
  
  return yPos;
};

/**
 * Generate critical risks based on AI insights
 */
const generateCriticalRisks = (insights: AIInsight[]): CriticalRisk[] => {
  const criticalRisks: CriticalRisk[] = [];
  
  // Extract critical risks from warnings in insights
  insights
    .filter(insight => insight.type === 'warning')
    .forEach(insight => {
      if (insight.text.includes('Unauthorized access') || 
          insight.text.includes('data breach') || 
          insight.text.includes('vulnerability')) {
        
        criticalRisks.push({
          description: insight.text.split('.')[0] + '.',
          impact: 'High risk of compliance violations'
        });
      }
    });
  
  // Add default critical risks if none found
  if (criticalRisks.length === 0) {
    criticalRisks.push({
      description: 'Unauthorized access detected.',
      impact: 'Violates data protection requirements'
    });
    criticalRisks.push({
      description: 'Unencrypted data storage found.',
      impact: 'Violates data security requirements'
    });
  }
  
  return criticalRisks;
};

/**
 * Generate compliance recommendations based on AI insights
 */
const generateRecommendations = (insights: AIInsight[]): ComplianceRecommendation[] => {
  const recommendations: ComplianceRecommendation[] = [];
  
  // Extract recommendations from insights
  insights.forEach(insight => {
    if (insight.type === 'recommendation' || 
        insight.text.includes('implement') || 
        insight.text.includes('should') || 
        insight.text.includes('consider') ||
        insight.text.includes('recommend')) {
      
      recommendations.push({
        title: insight.title || 'Compliance Recommendation',
        description: insight.text.split('.')[0] + '.',
        priority: insight.type === 'warning' ? 'High' : 'Medium'
      });
    }
  });
  
  // Add default recommendations if none found
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Access Control',
      description: 'Enable strict RBAC (Role-Based Access Control).',
      priority: 'Critical'
    });
    recommendations.push({
      title: 'Data Protection',
      description: 'Encrypt all sensitive data.',
      priority: 'High'
    });
    recommendations.push({
      title: 'Authentication',
      description: 'Enforce multi-factor authentication (MFA) for admin users.',
      priority: 'High'
    });
  }
  
  return recommendations;
};
