
import { FileText, Eye, Check, Download, Users } from 'lucide-react';
import { AuditEvent } from './types';

export const generateMockAuditTrail = (documentName: string): AuditEvent[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      action: 'Document uploaded',
      documentName,
      timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
      user: 'Compliance Officer',
      icon: <FileText className="h-4 w-4 text-blue-500" />,
      status: 'completed',
      comments: [
        {
          id: 'c1',
          user: 'Compliance Officer',
          text: 'Initial document uploaded for review',
          timestamp: new Date(now.getTime() - 3590000).toISOString()
        }
      ]
    },
    {
      id: '2',
      action: 'Compliance analysis started',
      documentName,
      timestamp: new Date(now.getTime() - 3500000).toISOString(), // 58 minutes ago
      user: 'System',
      icon: <Eye className="h-4 w-4 text-purple-500" />,
      status: 'completed'
    },
    {
      id: '3',
      action: 'Compliance report generated',
      documentName,
      timestamp: new Date(now.getTime() - 3400000).toISOString(), // 56 minutes ago
      user: 'System',
      icon: <Check className="h-4 w-4 text-green-500" />,
      status: 'completed',
      comments: [
        {
          id: 'c2',
          user: 'Legal Advisor',
          text: 'Found several potential GDPR compliance issues that need to be addressed',
          timestamp: new Date(now.getTime() - 3380000).toISOString()
        }
      ]
    },
    {
      id: '4',
      action: 'Report viewed',
      documentName,
      timestamp: new Date(now.getTime() - 3000000).toISOString(), // 50 minutes ago
      user: 'Compliance Officer',
      icon: <Eye className="h-4 w-4 text-gray-500" />,
      status: 'completed'
    },
    {
      id: '5',
      action: 'Remediation task assigned',
      documentName,
      timestamp: new Date(now.getTime() - 2400000).toISOString(), // 40 minutes ago
      user: 'Compliance Officer',
      icon: <Users className="h-4 w-4 text-orange-500" />,
      status: 'in-progress',
      comments: [
        {
          id: 'c3',
          user: 'Compliance Officer',
          text: 'Assigned remediation tasks to the development team',
          timestamp: new Date(now.getTime() - 2390000).toISOString()
        },
        {
          id: 'c4',
          user: 'Developer',
          text: 'Working on fixing identified issues, will update when complete',
          timestamp: new Date(now.getTime() - 1800000).toISOString()
        }
      ]
    },
    {
      id: '6',
      action: 'Report downloaded',
      documentName,
      timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
      user: 'Compliance Officer',
      icon: <Download className="h-4 w-4 text-indigo-500" />,
      status: 'completed'
    }
  ];
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
