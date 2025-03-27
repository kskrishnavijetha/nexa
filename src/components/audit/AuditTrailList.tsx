
import React from 'react';
import { useAuditTrail } from './AuditTrailProvider';
import AuditEvent from './AuditEvent';
import { formatTimestamp } from './auditUtils';

const AuditTrailList: React.FC = () => {
  const { auditEvents } = useAuditTrail();

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-gray-200"></div>
      <div className="space-y-6">
        {auditEvents.map((event) => (
          <AuditEvent
            key={event.id}
            event={event}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default AuditTrailList;
