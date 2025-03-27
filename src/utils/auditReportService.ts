
import { AuditEvent } from '@/components/audit/types';
import jsPDF from 'jspdf';

/**
 * Generate AI-enhanced insights from audit events
 */
const generateAIInsights = (auditEvents: AuditEvent[]): string[] => {
  // In a real application, this would call an AI model API
  // For now, we'll generate insights based on patterns in the audit data
  
  const insights: string[] = [];
  
  // Analyze user activity patterns
  const userActions = new Map<string, number>();
  auditEvents.forEach(event => {
    if (event.user !== 'System') {
      const count = userActions.get(event.user) || 0;
      userActions.set(event.user, count + 1);
    }
  });
  
  // Find most active user
  let mostActiveUser = '';
  let mostActions = 0;
  userActions.forEach((count, user) => {
    if (count > mostActions) {
      mostActiveUser = user;
      mostActions = count;
    }
  });
  
  if (mostActiveUser) {
    insights.push(`${mostActiveUser} is the most active user with ${mostActions} actions recorded.`);
  }
  
  // Analyze task completion rates
  const totalTasks = auditEvents.filter(e => e.status).length;
  const completedTasks = auditEvents.filter(e => e.status === 'completed').length;
  
  if (totalTasks > 0) {
    const completionRate = (completedTasks / totalTasks * 100).toFixed(1);
    insights.push(`Task completion rate is ${completionRate}% (${completedTasks} out of ${totalTasks} tasks completed).`);
    
    if (parseFloat(completionRate) < 50) {
      insights.push(`Recommendation: Follow up on pending tasks to improve completion rate.`);
    }
  }
  
  // Analyze activity over time
  const activityByDay = new Map<string, number>();
  auditEvents.forEach(event => {
    const date = new Date(event.timestamp).toISOString().split('T')[0];
    const count = activityByDay.get(date) || 0;
    activityByDay.set(date, count + 1);
  });
  
  // Find most active day
  let mostActiveDay = '';
  let mostDayActions = 0;
  activityByDay.forEach((count, day) => {
    if (count > mostDayActions) {
      mostActiveDay = day;
      mostDayActions = count;
    }
  });
  
  if (mostActiveDay) {
    insights.push(`Highest activity was recorded on ${new Date(mostActiveDay).toLocaleDateString()} with ${mostDayActions} events.`);
  }
  
  // Add recommendations based on patterns
  if (auditEvents.length > 10) {
    insights.push(`This document has significant activity with ${auditEvents.length} tracked events, indicating high collaboration.`);
  }
  
  // Return at least some insights even if our analysis didn't find patterns
  if (insights.length === 0) {
    insights.push("Not enough audit data to generate meaningful insights.");
    insights.push("Continue tracking document activities to enable more detailed analysis in future reports.");
  }
  
  return insights;
};

/**
 * Generate a downloadable audit trail report PDF with AI insights
 */
export const generateAuditReport = async (
  documentName: string,
  auditEvents: AuditEvent[]
): Promise<Blob> => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set font size and styles
  doc.setFontSize(20);
  doc.setTextColor(0, 51, 102);
  
  // Add title and document header
  doc.text('Compliance Audit Trail Report', 20, 20);
  
  // Add document name and date
  doc.setFontSize(12);
  doc.text(`Document: ${documentName}`, 20, 30);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, 37);
  
  // Add horizontal line
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  // Generate AI insights
  const insights = generateAIInsights(auditEvents);
  
  // Add AI Insights section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('AI-Generated Insights', 20, 52);
  
  // Add insights
  let yPos = 62;
  doc.setFontSize(10);
  insights.forEach((insight, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Format and display insight with bullet point
    const insightLines = doc.splitTextToSize(`• ${insight}`, 160);
    doc.text(insightLines, 25, yPos);
    yPos += (insightLines.length * 5) + 5;
  });
  
  // Add horizontal line after insights
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Add report summary information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Audit Summary', 20, yPos);
  yPos += 10;
  
  // Calculate statistics
  const totalEvents = auditEvents.length;
  const systemEvents = auditEvents.filter(event => event.user === 'System').length;
  const userEvents = auditEvents.length - systemEvents;
  const completed = auditEvents.filter(event => event.status === 'completed').length;
  const inProgress = auditEvents.filter(event => event.status === 'in-progress').length;
  const pending = auditEvents.filter(event => event.status === 'pending').length;
  
  // Add summary details
  doc.setFontSize(10);
  doc.text(`Total Events: ${totalEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`System Events: ${systemEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`User Events: ${userEvents}`, 25, yPos);
  yPos += 7;
  doc.text(`Completed Tasks: ${completed}`, 25, yPos);
  yPos += 7;
  doc.text(`In-Progress Tasks: ${inProgress}`, 25, yPos);
  yPos += 7;
  doc.text(`Pending Tasks: ${pending}`, 25, yPos);
  yPos += 10;
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  // Event details heading
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Detailed Audit Events', 20, yPos);
  yPos += 10;
  
  // Sort events by timestamp in descending order (newest first)
  const sortedEvents = [...auditEvents].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Add each audit event
  sortedEvents.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    // Format timestamp
    const timestamp = new Date(event.timestamp).toLocaleString();
    
    // Set color based on event type 
    if (event.user === 'System') {
      doc.setTextColor(0, 102, 204); // Blue for system events
    } else {
      doc.setTextColor(0, 153, 51); // Green for user events
    }
    
    // Event number and type
    doc.setFontSize(12);
    doc.text(`Event #${index + 1}`, 20, yPos);
    yPos += 7;
    
    // Reset color for details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Event details
    doc.text(`Timestamp: ${timestamp}`, 25, yPos);
    yPos += 7;
    
    doc.text(`User: ${event.user}`, 25, yPos);
    yPos += 7;
    
    // Action with word wrapping
    const actionLines = doc.splitTextToSize(`Action: ${event.action}`, 160);
    doc.text(actionLines, 25, yPos);
    yPos += (actionLines.length * 5) + 2;
    
    // Status
    if (event.status) {
      doc.text(`Status: ${event.status}`, 25, yPos);
      yPos += 7;
    }
    
    // Add separator unless it's the last event
    if (index < sortedEvents.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, yPos, 190, yPos);
      yPos += 10;
    }
  });
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, 100, 290, { align: 'center' });
    doc.text(`AI-Enhanced Compliance Report`, 100, 284, { align: 'center' });
  }
  
  // Generate the PDF as a blob
  return doc.output('blob');
};

export const getAuditReportFileName = (documentName: string): string => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const sanitizedDocName = documentName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `ai-enhanced-audit-${sanitizedDocName}-${formattedDate}.pdf`;
};
