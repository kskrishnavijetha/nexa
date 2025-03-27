
import { AuditEvent } from '@/components/audit/types';
import { AuditReportStatistics } from './types';

/**
 * Calculate statistics from audit events for the report
 */
export const calculateReportStatistics = (auditEvents: AuditEvent[]): AuditReportStatistics => {
  const systemEvents = auditEvents.filter(event => event.user === 'System').length;
  
  return {
    totalEvents: auditEvents.length,
    systemEvents,
    userEvents: auditEvents.length - systemEvents,
    completed: auditEvents.filter(event => event.status === 'completed').length,
    inProgress: auditEvents.filter(event => event.status === 'in-progress').length,
    pending: auditEvents.filter(event => event.status === 'pending').length
  };
};
