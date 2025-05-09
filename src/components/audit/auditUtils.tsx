
import React from 'react';
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
      comments: []
    },
    {
      id: '2',
      action: 'Compliance analysis started',
      documentName,
      timestamp: new Date(now.getTime() - 3500000).toISOString(), // 58 minutes ago
      user: 'System',
      icon: <Eye className="h-4 w-4 text-purple-500" />,
      status: 'completed',
      comments: []
    },
    {
      id: '3',
      action: 'Compliance report generated',
      documentName,
      timestamp: new Date(now.getTime() - 3400000).toISOString(), // 56 minutes ago
      user: 'System',
      icon: <Check className="h-4 w-4 text-green-500" />,
      status: 'completed',
      comments: []
    },
    {
      id: '4',
      action: 'Report viewed',
      documentName,
      timestamp: new Date(now.getTime() - 3000000).toISOString(), // 50 minutes ago
      user: 'Compliance Officer',
      icon: <Eye className="h-4 w-4 text-gray-500" />,
      status: 'completed',
      comments: []
    },
    {
      id: '5',
      action: 'Remediation task assigned',
      documentName,
      timestamp: new Date(now.getTime() - 2400000).toISOString(), // 40 minutes ago
      user: 'Compliance Officer',
      icon: <Users className="h-4 w-4 text-orange-500" />,
      status: 'in-progress',
      comments: []
    },
    {
      id: '6',
      action: 'Report downloaded',
      documentName,
      timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
      user: 'Compliance Officer',
      icon: <Download className="h-4 w-4 text-indigo-500" />,
      status: 'completed',
      comments: []
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

// Add the missing formatDate function
export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};
