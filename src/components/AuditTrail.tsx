
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Check, Eye, Download, FileText } from 'lucide-react';

// For demo purposes, we'll create mock audit trail data
interface AuditEvent {
  id: string;
  action: string;
  documentName: string;
  timestamp: string;
  user: string;
  icon: React.ReactNode;
}

const generateMockAuditTrail = (documentName: string): AuditEvent[] => {
  const now = new Date();
  
  return [
    {
      id: '1',
      action: 'Document uploaded',
      documentName,
      timestamp: new Date(now.getTime() - 3600000).toISOString(), // 1 hour ago
      user: 'Compliance Officer',
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    {
      id: '2',
      action: 'Compliance analysis started',
      documentName,
      timestamp: new Date(now.getTime() - 3500000).toISOString(), // 58 minutes ago
      user: 'System',
      icon: <Eye className="h-4 w-4 text-purple-500" />
    },
    {
      id: '3',
      action: 'Compliance report generated',
      documentName,
      timestamp: new Date(now.getTime() - 3400000).toISOString(), // 56 minutes ago
      user: 'System',
      icon: <Check className="h-4 w-4 text-green-500" />
    },
    {
      id: '4',
      action: 'Report viewed',
      documentName,
      timestamp: new Date(now.getTime() - 3000000).toISOString(), // 50 minutes ago
      user: 'Compliance Officer',
      icon: <Eye className="h-4 w-4 text-gray-500" />
    },
    {
      id: '5',
      action: 'Report downloaded',
      documentName,
      timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
      user: 'Compliance Officer',
      icon: <Download className="h-4 w-4 text-indigo-500" />
    }
  ];
};

interface AuditTrailProps {
  documentName: string;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ documentName }) => {
  const auditEvents = generateMockAuditTrail(documentName);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-gray-500" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {auditEvents.map((event) => (
              <div key={event.id} className="relative pl-8">
                <div className="absolute left-0 p-1 bg-white rounded-full border border-gray-200">
                  {event.icon}
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{event.action}</span>
                    <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{event.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditTrail;
