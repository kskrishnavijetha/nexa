
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../../types';

/**
 * Analyze task completion rates in the audit events
 */
export const analyzeTaskCompletion = (auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
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
  
  return insights;
};
