
import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const UpcomingDeadlines = () => {
  // Mock data for upcoming deadlines
  const deadlines = [
    {
      id: 1,
      title: 'GDPR Audit',
      date: '2025-04-12',
      daysLeft: 6,
      critical: true,
      icon: 'red'
    },
    {
      id: 2,
      title: 'Quarterly Compliance Report',
      date: '2025-04-15',
      daysLeft: 9,
      critical: false,
      icon: 'blue'
    },
    {
      id: 3,
      title: 'Annual Security Assessment',
      date: '2025-04-30',
      daysLeft: 24,
      critical: false,
      icon: 'blue'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Upcoming Deadlines</h3>
      <p className="text-sm text-muted-foreground mb-4">Action items due soon</p>
      
      {deadlines.map((deadline) => (
        <div key={deadline.id} className="flex items-start space-x-3">
          <div className={cn(
            "p-2 rounded-md flex-shrink-0 mt-1",
            deadline.icon === 'red' ? "bg-red-100" : "bg-blue-100"
          )}>
            <Calendar className={cn(
              "h-5 w-5",
              deadline.icon === 'red' ? "text-red-500" : "text-blue-500"
            )} />
          </div>
          <div>
            <h4 className="font-medium">{deadline.title}</h4>
            <div className="flex items-center text-sm space-x-2 mt-1">
              <span className="text-muted-foreground">{new Date(deadline.date).toLocaleDateString()}</span>
              <span className="text-muted-foreground">•</span>
              <span className={cn(
                "font-medium",
                deadline.daysLeft < 7 ? "text-red-500" : "text-muted-foreground"
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
