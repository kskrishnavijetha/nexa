
import React from 'react';
import { AuditEvent as AuditEventType } from './types';
import StatusBadge from './StatusBadge';

interface AuditEventProps {
  event: AuditEventType;
  formatTimestamp: (timestamp: string) => string;
}

const AuditEvent: React.FC<AuditEventProps> = ({
  event,
  formatTimestamp
}) => {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 p-1 bg-white rounded-full border border-gray-200">
        {event.icon}
      </div>
      <div className="bg-gray-50 p-3 rounded border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{event.action}</span>
              {event.status && <StatusBadge status={event.status} />}
            </div>
            <div className="text-sm text-gray-600 mt-1">{event.user}</div>
          </div>
          <span className="text-xs text-gray-500">{formatTimestamp(event.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default AuditEvent;
