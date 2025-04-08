
import React from 'react';
import { useAuditTrail } from './context/AuditTrailContext';
import AuditEvent from './AuditEvent';
import { formatTimestamp } from './auditUtils';

const AuditTrailList: React.FC = () => {
  const { auditEvents, loadingEvents } = useAuditTrail();

  if (loadingEvents) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col gap-4 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (auditEvents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No audit events found for this document.</p>
      </div>
    );
  }

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
