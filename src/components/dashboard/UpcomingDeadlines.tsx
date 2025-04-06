
import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const UpcomingDeadlines = () => {
  // Mock data for upcoming deadlines
  const deadlines = [
    {
      id: 1,
      title: 'GDPR Audit',
      date: '2025-04-12',
      daysLeft: 6,
      critical: true
    },
    {
      id: 2,
      title: 'Quarterly Compliance Report',
      date: '2025-04-15',
      daysLeft: 9,
      critical: false
    },
    {
      id: 3,
      title: 'Annual Security Assessment',
      date: '2025-04-30',
      daysLeft: 24,
      critical: false
    }
  ];

  return (
    <div className="space-y-4">
      {deadlines.map((deadline) => (
        <div key={deadline.id} className="flex items-start">
          <div className={cn(
            "p-2 rounded-md mr-3 flex-shrink-0",
            deadline.critical ? "bg-red-100" : "bg-blue-100"
          )}>
            <CalendarIcon className={cn(
              "h-4 w-4",
              deadline.critical ? "text-red-500" : "text-blue-500"
            )} />
          </div>
          <div>
            <h4 className="font-medium text-sm">{deadline.title}</h4>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>{new Date(deadline.date).toLocaleDateString()}</span>
              <span className="mx-2">•</span>
              <span className={cn(
                deadline.daysLeft < 7 ? "text-red-500 font-medium" : ""
              )}>
                {deadline.daysLeft} days left
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingDeadlines;
