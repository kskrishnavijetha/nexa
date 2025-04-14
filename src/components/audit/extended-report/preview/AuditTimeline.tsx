
import React from 'react';
import { ExtendedReport } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { formatTimestamp } from '@/components/audit/auditUtils';

interface AuditTimelineProps {
  report: ExtendedReport;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ report }) => {
  const { auditEvents } = report;
  const events = auditEvents || [];

  // Group events by date for better organization
  const eventsByDate: Record<string, typeof events> = {};
  events.forEach(event => {
    const date = new Date(event.timestamp).toDateString();
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">Audit Trail Timeline</h3>
        
        {events.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(eventsByDate).map(([date, dateEvents]) => (
              <div key={date} className="space-y-2">
                <h3 className="font-medium text-base text-gray-700 sticky top-0 bg-white py-2">
                  {date}
                </h3>
                
                <div className="border-l-2 border-gray-200 pl-4 ml-2 space-y-6">
                  {dateEvents.map((event, i) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[21px] mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-300" />
                      
                      <div className="mb-1 flex items-center">
                        <time className="block text-xs font-normal leading-none text-gray-500">
                          {formatTimestamp(event.timestamp, true)}
                        </time>
                        
                        <div className="ml-2">
                          {event.status === 'completed' && (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Completed
                            </span>
                          )}
                          
                          {event.status === 'pending' && (
                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">
                              Pending
                            </span>
                          )}
                          
                          {event.status === 'in-progress' && (
                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="text-base font-semibold text-gray-900">{event.action}</h3>
                      
                      <div className="mt-1 text-sm text-gray-700">
                        <span className="font-medium">{event.user}</span>
                        {event.comments && event.comments.length > 0 && (
                          <p className="mt-1 text-gray-500">{event.comments[0].text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No audit events available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
