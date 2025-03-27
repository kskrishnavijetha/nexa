
import { ReactNode } from 'react';
import { toast } from 'sonner';
import { Clock, Eye, Check, Users, FileCheck, AlertTriangle, Shield, Settings } from 'lucide-react';
import { AuditEvent } from '../types';

/**
 * Create a new real-time audit event
 */
export const generateRealTimeEvent = (documentName: string): AuditEvent => {
  const now = new Date();
  const icons: ReactNode[] = [
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

  return {
    id: `auto-${Date.now()}`,
    action: actions[Math.floor(Math.random() * actions.length)],
    documentName,
    timestamp: now.toISOString(),
    user: users[Math.floor(Math.random() * users.length)],
    icon: icons[Math.floor(Math.random() * icons.length)],
    status: Math.random() > 0.5 ? 'completed' : 'in-progress',
    comments: []
  };
};

/**
 * Create the initial real-time monitoring event
 */
export const generateInitialRealTimeEvent = (documentName: string): AuditEvent => {
  const now = new Date();
  return {
    id: `initial-${Date.now()}`,
    action: 'Real-time compliance monitoring initiated',
    documentName,
    timestamp: now.toISOString(),
    user: 'System',
    icon: <Clock className="h-4 w-4 text-blue-500" />,
    status: 'completed',
    comments: []
  };
};

/**
 * Notify user of new audit activity
 */
export const notifyNewActivity = (event: AuditEvent): void => {
  toast.info(`New activity: ${event.action} by ${event.user}`);
};
