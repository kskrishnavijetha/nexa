
import { useState, useEffect } from 'react';
import { Webhook } from '@/utils/webhook/webhookServices';
import { subscribeToWebhookChanges, unsubscribeFromWebhookChanges } from '@/utils/webhook/webhookRealtime';
import { toast } from "sonner";

export const useWebhookState = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    console.log('WebhookIntegrations component mounted');
    const unsubscribe = subscribeToWebhookChanges((updatedWebhooks) => {
      console.log("Real-time webhook update received:", updatedWebhooks);
      setWebhooks(updatedWebhooks);
      toast.info("Webhook configurations updated in real-time");
    });

    return () => {
      console.log('WebhookIntegrations component unmounted');
      unsubscribeFromWebhookChanges(unsubscribe);
    };
  }, []);

  return {
    webhooks,
    setWebhooks,
    isLoading,
    setIsLoading,
    isSheetOpen,
    setIsSheetOpen,
    isTestingWebhook,
    setIsTestingWebhook
  };
};
