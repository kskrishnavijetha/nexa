
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';

interface WebhookHeaderProps {
  onOpenAddWebhook: () => void;
}

const WebhookHeader = ({ onOpenAddWebhook }: WebhookHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Webhook Integrations</h2>
        <p className="text-muted-foreground max-w-2xl">
          Configure webhooks to automatically notify external systems about compliance violations, 
          risk detections, and system events. Perfect for integration with Slack, MS Teams, or custom endpoints.
        </p>
      </div>
      <Button onClick={onOpenAddWebhook}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Add Webhook
      </Button>
    </div>
  );
};

export default WebhookHeader;
