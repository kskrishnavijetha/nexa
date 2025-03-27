
import { Clock, Eye, Check, Users, FileCheck, AlertTriangle, Shield, Settings } from 'lucide-react';
import { AuditEvent } from '../types';

/**
 * Generate mock audit events for a document
 */
export const generateMockAuditTrail = (documentName: string): AuditEvent[] => {
  // Create some sample audit events
  const mockEvents: AuditEvent[] = [
    {
      id: 'audit-1',
      timestamp: new Date().toISOString(),
      action: 'Document uploaded for compliance analysis',
      documentName,
      user: 'System',
      status: 'completed',
      comments: [],
    },
    {
      id: 'audit-2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: 'Initial automated compliance scan completed with 94% GDPR adherence',
      documentName,
      user: 'System',
      status: 'completed',
      comments: [],
    },
    {
      id: 'audit-3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      action: 'GDPR Article 13 & 14 compliance verification performed',
      documentName,
      user: 'Data Protection Officer',
      status: 'completed',
      comments: [{
        id: 'comment-1',
        user: 'Data Protection Officer',
        text: 'All required privacy notice elements present and clearly articulated.',
        timestamp: new Date(Date.now() - 7200000 + 600000).toISOString()
      }],
    },
    {
      id: 'audit-4',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      action: 'Document sections reviewed for HIPAA Security Rule compliance',
      documentName,
      user: 'Compliance Officer',
      status: 'in-progress',
      comments: [{
        id: 'comment-2',
        user: 'Compliance Officer',
        text: 'Section 4.2 needs additional details on PHI handling procedures.',
        timestamp: new Date(Date.now() - 10800000 + 1200000).toISOString()
      }],
    },
    {
      id: 'audit-5',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      action: 'Data protection impact assessment initiated',
      documentName,
      user: 'System',
      status: 'completed',
      comments: [],
    },
    {
      id: 'audit-6',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      action: 'Cross-border data transfer compliance evaluated against SCCs',
      documentName,
      user: 'Legal Advisor',
      status: 'completed',
      comments: [{
        id: 'comment-3',
        user: 'Legal Advisor',
        text: 'Transfer mechanisms properly documented and Standard Contractual Clauses implemented correctly.',
        timestamp: new Date(Date.now() - 18000000 + 900000).toISOString()
      }],
    },
    {
      id: 'audit-7',
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      action: 'Security vulnerability assessment performed',
      documentName,
      user: 'Security Analyst',
      status: 'completed',
      comments: [{
        id: 'comment-4',
        user: 'Security Analyst',
        text: 'No critical vulnerabilities detected. Two medium-severity findings documented in section 7.',
        timestamp: new Date(Date.now() - 21600000 + 1800000).toISOString()
      }],
    },
    {
      id: 'audit-8',
      timestamp: new Date(Date.now() - 25200000).toISOString(),
      action: 'Document classification updated to "Confidential - Regulated Data"',
      documentName,
      user: 'Data Protection Officer',
      status: 'completed',
      comments: [],
    },
    {
      id: 'audit-9',
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      action: 'Access control policy compliance verification',
      documentName,
      user: 'IT Security Manager',
      status: 'completed',
      comments: [{
        id: 'comment-5',
        user: 'IT Security Manager',
        text: 'Role-based access controls properly implemented according to least privilege principle.',
        timestamp: new Date(Date.now() - 28800000 + 600000).toISOString()
      }],
    },
    {
      id: 'audit-10',
      timestamp: new Date(Date.now() - 32400000).toISOString(),
      action: 'Data retention schedule updated per regulatory requirements',
      documentName,
      user: 'Compliance Officer',
      status: 'completed',
      comments: [],
    }
  ];
  
  return mockEvents;
};

/**
 * Get mock audit events for a specific document (for API simulation)
 */
export const getAuditEventsForDocument = async (documentName: string): Promise<AuditEvent[]> => {
  // Simulate fetching audit events for a specific document
  // In a real application, this would call an API endpoint
  return Promise.resolve(generateMockAuditTrail(documentName));
};
