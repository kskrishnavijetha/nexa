
import { AuditEvent } from '@/components/audit/types';
import { AuditReportStatistics } from './types';

/**
 * Calculate statistics from audit events for reporting
 */
export const calculateReportStatistics = (auditEvents: AuditEvent[]): AuditReportStatistics => {
  // Count events by type
  const systemEvents = auditEvents.filter(event => event.user === 'System').length;
  const userEvents = auditEvents.length - systemEvents;
  
  // Count events by status
  const completed = auditEvents.filter(event => event.status === 'completed').length;
  const inProgress = auditEvents.filter(event => event.status === 'in-progress').length;
  const pending = auditEvents.filter(event => event.status === 'pending').length;
  
  return {
    totalEvents: auditEvents.length,
    systemEvents,
    userEvents,
    completed,
    inProgress,
    pending,
    // Add these aliases for industry findings files
    completedTasks: completed,
    pendingTasks: pending
  };
};
