
import React from 'react';
import { Webhook, WebhookTrigger } from '@/utils/webhook/webhookServices';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCwIcon, Trash2Icon, Loader2 } from 'lucide-react';

interface WebhookCardProps {
  webhook: Webhook;
  isTestingWebhook: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
  availableTriggers: { value: WebhookTrigger; label: string }[];
}

const WebhookCard = ({ 
  webhook, 
  isTestingWebhook, 
  onEdit, 
  onDelete, 
  onTest,
  availableTriggers 
}: WebhookCardProps) => {
  return (
    <Card key={webhook.id}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              {webhook.name}
              {webhook.active ? (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">Active</Badge>
              ) : (
                <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-700">Inactive</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1 break-all">
              {webhook.url}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onEdit}
              title="Edit webhook"
            >
              <span className="sr-only">Edit</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onDelete}
              title="Delete webhook"
            >
              <span className="sr-only">Delete</span>
              <Trash2Icon className="h-[18px] w-[18px]" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {webhook.triggerEvents.map((trigger) => {
            const triggerLabel = availableTriggers.find(t => t.value === trigger)?.label || trigger;
            return (
              <Badge key={trigger} variant="secondary" className="text-xs">
                {triggerLabel}
              </Badge>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          {webhook.lastTriggered ? (
            <span>Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}</span>
          ) : (
            <span>Never triggered</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onTest}
          disabled={isTestingWebhook}
          className="text-xs"
        >
          {isTestingWebhook ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" /> 
              Testing...
            </>
          ) : (
            <>
              <RotateCwIcon className="h-3 w-3 mr-1" /> 
              Test Webhook
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WebhookCard;
