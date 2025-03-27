
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from './types';

/**
 * Generate AI-enhanced insights from audit events with more detailed analysis
 */
export const generateAIInsights = (auditEvents: AuditEvent[]): AIInsight[] => {
  // In a real application, this would call an AI model API
  // For now, we'll generate insights based on patterns in the audit data
  
  const insights: AIInsight[] = [];
  
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
    insights.push({
      text: `${mostActiveUser} is the most active user with ${mostActions} actions recorded, suggesting a key role in compliance management for this document.`,
      type: 'observation'
    });
  }
  
  // Analyze task completion rates
  const totalTasks = auditEvents.filter(e => e.status).length;
  const completedTasks = auditEvents.filter(e => e.status === 'completed').length;
  
  if (totalTasks > 0) {
    const completionRate = (completedTasks / totalTasks * 100).toFixed(1);
    insights.push({
      text: `Task completion rate is ${completionRate}% (${completedTasks} out of ${totalTasks} tasks completed), indicating ${parseFloat(completionRate) > 75 ? 'excellent' : parseFloat(completionRate) > 50 ? 'moderate' : 'concerning'} process efficiency.`,
      type: 'observation'
    });
    
    if (parseFloat(completionRate) < 50) {
      insights.push({
        text: `The low task completion rate (${completionRate}%) suggests potential workflow bottlenecks or resource constraints. Consider reviewing incomplete tasks and allocating additional resources if needed.`,
        type: 'recommendation'
      });
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
    insights.push({
      text: `Highest activity was recorded on ${new Date(mostActiveDay).toLocaleDateString()} with ${mostDayActions} events, which may correlate with compliance deadlines or review cycles.`,
      type: 'observation'
    });
  }
  
  // Analyze compliance check distribution
  const complianceChecks = auditEvents.filter(e => 
    e.action.toLowerCase().includes('compliance') || 
    e.action.toLowerCase().includes('check') ||
    e.action.toLowerCase().includes('scan')
  ).length;
  
  if (complianceChecks > 0) {
    const checkPercentage = (complianceChecks / auditEvents.length * 100).toFixed(1);
    insights.push({
      text: `${complianceChecks} compliance verification activities (${checkPercentage}% of all events) have been performed, demonstrating ${parseFloat(checkPercentage) > 30 ? 'thorough' : 'basic'} due diligence in regulatory adherence.`,
      type: 'observation'
    });
  }
  
  // Analyze user vs system balance
  const systemPercentage = (auditEvents.filter(e => e.user === 'System').length / auditEvents.length * 100).toFixed(1);
  
  if (parseFloat(systemPercentage) > 70) {
    insights.push({
      text: `${systemPercentage}% of activities are automated system actions, indicating heavy reliance on automated compliance tools with limited human oversight. Consider increasing manual review frequency.`,
      type: 'recommendation'
    });
  } else if (parseFloat(systemPercentage) < 30) {
    insights.push({
      text: `Only ${systemPercentage}% of activities are automated, suggesting a manual-heavy compliance process. Consider implementing more automated compliance checks to improve efficiency and consistency.`,
      type: 'recommendation'
    });
  } else {
    insights.push({
      text: `The balance between automated (${systemPercentage}%) and manual activities demonstrates a well-integrated compliance approach combining technological efficiency with human expertise.`,
      type: 'observation'
    });
  }
  
  // Add activity frequency analysis
  if (auditEvents.length > 0) {
    const oldestEvent = new Date(auditEvents.reduce((oldest, event) => 
      new Date(event.timestamp) < new Date(oldest.timestamp) ? event : oldest
    ).timestamp);
    
    const newestEvent = new Date(auditEvents.reduce((newest, event) => 
      new Date(event.timestamp) > new Date(newest.timestamp) ? event : newest
    ).timestamp);
    
    const daysDifference = Math.max(1, Math.round((newestEvent.getTime() - oldestEvent.getTime()) / (1000 * 60 * 60 * 24)));
    const eventsPerDay = (auditEvents.length / daysDifference).toFixed(1);
    
    insights.push({
      text: `Average activity frequency is ${eventsPerDay} events per day over the ${daysDifference} day monitoring period, indicating ${parseFloat(eventsPerDay) > 5 ? 'high' : parseFloat(eventsPerDay) > 2 ? 'moderate' : 'low'} engagement with this document.`,
      type: 'observation'
    });
  }
  
  // Add recommendations based on patterns
  if (auditEvents.length > 10) {
    insights.push({
      text: `This document has significant activity with ${auditEvents.length} tracked events, suggesting it may be a critical compliance asset requiring continued monitoring and periodic reviews.`,
      type: 'observation'
    });
  }
  
  // Look for potential remediation needs
  const remediationNeeded = auditEvents.some(e => 
    e.action.toLowerCase().includes('violation') || 
    e.action.toLowerCase().includes('non-compliance') ||
    e.action.toLowerCase().includes('issue')
  );
  
  if (remediationNeeded) {
    insights.push({
      text: "Compliance issues have been identified in the audit trail. Ensure all identified issues have corresponding remediation actions and verify their completion to maintain regulatory compliance.",
      type: 'warning'
    });
  }
  
  // Return at least some insights even if our analysis didn't find patterns
  if (insights.length === 0) {
    insights.push({
      text: "Not enough audit data to generate meaningful insights. Consider implementing more detailed tracking of compliance activities.",
      type: 'warning'
    });
    insights.push({
      text: "Continue tracking document activities with greater detail, including specific compliance checks performed and their outcomes to enable more comprehensive analysis in future reports.",
      type: 'recommendation'
    });
  }
  
  return insights;
};
