
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Clock, Eye, Check, Users, FileCheck, AlertTriangle, Shield, Settings, FileText } from 'lucide-react';
import { AuditEvent } from '../types';
import { generateMockAuditTrail } from '../auditUtils';

interface UseAuditEventsProps {
  documentName: string;
}

export function useAuditEvents({ documentName }: UseAuditEventsProps) {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());

  // Initialize auditEvents
  useEffect(() => {
    setAuditEvents(generateMockAuditTrail(documentName));
    setLastActivity(new Date());
  }, [documentName]);

  // Real-time updates simulation
  useEffect(() => {
    // Create a function that will add a new event occasionally
    const addRealTimeEvent = () => {
      const now = new Date();
      const icons = [
        <Eye className="h-4 w-4 text-gray-500" key="eye" />,
        <Check className="h-4 w-4 text-green-500" key="check" />,
        <Users className="h-4 w-4 text-orange-500" key="users" />,
        <FileCheck className="h-4 w-4 text-blue-500" key="filecheck" />,
        <AlertTriangle className="h-4 w-4 text-yellow-500" key="alert" />,
        <Shield className="h-4 w-4 text-purple-500" key="shield" />,
        <Settings className="h-4 w-4 text-gray-600" key="settings" />
      ];
      
      const actions = [
        'Document reviewed for compliance with GDPR Article 13',
        'Data privacy impact assessment performed',
        'Security vulnerability scan completed',
        'Cross-department compliance review conducted',
        'Remediation tasks updated for identified issues',
        'Quarterly compliance audit performed',
        'Document encryption status verified',
        'Access permissions updated per security policy',
        'Data retention compliance verified',
        'Sensitive data classification updated'
      ];
      
      const users = [
        'System', 
        'Compliance Officer', 
        'Legal Advisor', 
        'Security Analyst',
        'Data Protection Officer',
        'IT Security Manager',
        'Regulatory Affairs Specialist',
        'External Auditor'
      ];

      const newEvent: AuditEvent = {
        id: `auto-${Date.now()}`,
        action: actions[Math.floor(Math.random() * actions.length)],
        documentName,
        timestamp: now.toISOString(),
        user: users[Math.floor(Math.random() * users.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
        status: Math.random() > 0.5 ? 'completed' : 'in-progress',
        comments: []
      };

      setAuditEvents(prev => [newEvent, ...prev]);
      toast.info(`New activity: ${newEvent.action} by ${newEvent.user}`);
    };

    // Set up interval for real-time updates
    const timeSinceLastActivity = new Date().getTime() - lastActivity.getTime();
    
    // Keep updates flowing for 30 minutes after last activity
    if (timeSinceLastActivity < 30 * 60 * 1000) {
      const timer = setTimeout(() => {
        // 30% chance to add a real-time event every 5-15 seconds
        if (Math.random() < 0.3) {
          addRealTimeEvent();
        }
      }, 5000 + Math.random() * 10000);
      
      return () => clearTimeout(timer);
    }
  }, [auditEvents, documentName, lastActivity]);

  // Trigger an immediate real-time event when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      const newEvent: AuditEvent = {
        id: `initial-${Date.now()}`,
        action: 'Real-time compliance monitoring initiated',
        documentName,
        timestamp: now.toISOString(),
        user: 'System',
        icon: <Clock className="h-4 w-4 text-blue-500" />,
        status: 'completed',
        comments: []
      };

      setAuditEvents(prev => [newEvent, ...prev]);
      toast.info('Real-time audit trail activated');
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [documentName]);

  const updateAuditEvents = (updatedEvents: AuditEvent[]) => {
    setAuditEvents(updatedEvents);
  };

  return {
    auditEvents,
    updateAuditEvents,
    setLastActivity
  };
}

export const getAuditEventsForDocument = async (documentName: string): Promise<AuditEvent[]> => {
  // Simulate fetching audit events for a specific document
  // In a real application, this would call an API endpoint
  
  // Create some sample audit events if none exist yet
  const sampleEvents: AuditEvent[] = [
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
  
  // Return the sample events
  return Promise.resolve(sampleEvents);
};
