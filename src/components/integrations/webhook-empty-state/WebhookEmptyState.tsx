
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";
import { PlusIcon, ZapIcon } from 'lucide-react';

const WebhookEmptyState = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <ZapIcon className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-lg">No webhooks configured</h3>
        <p className="text-muted-foreground mt-1 mb-4">
          Add a webhook to notify external systems of compliance events
        </p>
        <SheetTrigger asChild>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Webhook
          </Button>
        </SheetTrigger>
      </CardContent>
    </Card>
  );
};

export default WebhookEmptyState;
