
import React from 'react';
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { PlusIcon } from 'lucide-react';

interface WebhookHeaderProps {
  onOpenAddWebhook: () => void;
}

const WebhookHeader = ({ onOpenAddWebhook }: WebhookHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Webhook Integrations</h2>
        <p className="text-muted-foreground">
          Send notifications to other systems when compliance events occur
        </p>
      </div>
      <SheetTrigger asChild onClick={onOpenAddWebhook}>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </SheetTrigger>
    </div>
  );
};

export default WebhookHeader;
