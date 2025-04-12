
import React from 'react';
import { Separator } from '@/components/ui/separator';

const SlackMonitorHeader: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Slack Compliance Monitor</h2>
      <p className="text-muted-foreground mb-4">
        Monitor your Slack workspace for potential compliance violations in messages and file uploads.
      </p>
      <Separator className="my-6" />
    </div>
  );
};

export default SlackMonitorHeader;
