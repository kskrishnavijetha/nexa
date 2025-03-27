
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from './types';

/**
 * Generate AI-enhanced insights from audit events
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
      text: `${mostActiveUser} is the most active user with ${mostActions} actions recorded.`,
      type: 'observation'
    });
  }
  
  // Analyze task completion rates
  const totalTasks = auditEvents.filter(e => e.status).length;
  const completedTasks = auditEvents.filter(e => e.status === 'completed').length;
  
  if (totalTasks > 0) {
    const completionRate = (completedTasks / totalTasks * 100).toFixed(1);
    insights.push({
      text: `Task completion rate is ${completionRate}% (${completedTasks} out of ${totalTasks} tasks completed).`,
      type: 'observation'
    });
    
    if (parseFloat(completionRate) < 50) {
      insights.push({
        text: `Recommendation: Follow up on pending tasks to improve completion rate.`,
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
      text: `Highest activity was recorded on ${new Date(mostActiveDay).toLocaleDateString()} with ${mostDayActions} events.`,
      type: 'observation'
    });
  }
  
  // Add recommendations based on patterns
  if (auditEvents.length > 10) {
    insights.push({
      text: `This document has significant activity with ${auditEvents.length} tracked events, indicating high collaboration.`,
      type: 'observation'
    });
  }
  
  // Return at least some insights even if our analysis didn't find patterns
  if (insights.length === 0) {
    insights.push({
      text: "Not enough audit data to generate meaningful insights.",
      type: 'warning'
    });
    insights.push({
      text: "Continue tracking document activities to enable more detailed analysis in future reports.",
      type: 'recommendation'
    });
  }
  
  return insights;
};
