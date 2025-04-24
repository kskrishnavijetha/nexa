
import React, { useState, useEffect } from 'react';
import { 
  getWebhooks, 
  createWebhook, 
  updateWebhook, 
  deleteWebhook, 
  testWebhook,
  Webhook,
  WebhookTrigger
} from '@/utils/webhook/webhookServices';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";
import WebhookForm from './webhook-form/WebhookForm';
import WebhookCard from './webhook-card/WebhookCard';
import WebhookEmptyState from './webhook-empty-state/WebhookEmptyState';
import WebhookHeader from './webhook-header/WebhookHeader';
import DeleteWebhookDialog from './webhook-dialog/DeleteWebhookDialog';
import { subscribeToWebhookChanges, unsubscribeFromWebhookChanges } from '@/utils/webhook/webhookRealtime';

const WebhookIntegrations = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<Webhook | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    active: true,
    triggerEvents: [] as WebhookTrigger[],
    isEditing: false,
    editId: ''
  });

  const availableTriggers: { value: WebhookTrigger; label: string }[] = [
    { value: 'compliance_violation', label: 'Compliance Violation Detected' },
    { value: 'high_risk_detected', label: 'High Risk Content Detected' },
    { value: 'pii_detected', label: 'PII Information Detected' },
    { value: 'scan_completed', label: 'Document Scan Completed' },
    { value: 'service_connected', label: 'External Service Connected' },
    { value: 'service_disconnected', label: 'External Service Disconnected' },
  ];

  useEffect(() => {
    console.log('WebhookIntegrations component mounted');
    loadWebhooks();

    // Subscribe to real-time webhook changes
    const unsubscribe = subscribeToWebhookChanges((updatedWebhooks) => {
      console.log("Real-time webhook update received:", updatedWebhooks);
      setWebhooks(updatedWebhooks);
      toast.info("Webhook configurations updated in real-time");
    });

    return () => {
      console.log('WebhookIntegrations component unmounted');
      // Clean up subscription when component unmounts
      unsubscribeFromWebhookChanges(unsubscribe);
    };
  }, []);

  const loadWebhooks = async () => {
    console.log('Loading webhooks...');
    setIsLoading(true);
    try {
      const response = await getWebhooks();
      console.log('Webhooks response:', response);
      if (response.success && response.data) {
        setWebhooks(response.data);
      } else {
        console.error('Failed to load webhooks:', response.error);
        toast.error('Failed to load webhook integrations');
      }
    } catch (error) {
      console.error('Error loading webhooks:', error);
      toast.error('Failed to load webhook integrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.url || formData.triggerEvents.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    const webhookData = {
      name: formData.name,
      url: formData.url,
      active: formData.active,
      triggerEvents: formData.triggerEvents,
    };

    try {
      let response;
      
      if (formData.isEditing) {
        response = await updateWebhook(formData.editId, webhookData);
        if (response.success) {
          toast.success('Webhook updated successfully');
        }
      } else {
        response = await createWebhook(webhookData);
        if (response.success) {
          toast.success('Webhook created successfully');
        }
      }

      if (response.success) {
        resetForm();
        // No need to call loadWebhooks manually - real-time updates will handle this
        setIsSheetOpen(false);
      } else {
        toast.error(response.error || 'Failed to save webhook');
      }
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteWebhook = async () => {
    if (!webhookToDelete) return;

    try {
      const response = await deleteWebhook(webhookToDelete.id);
      if (response.success) {
        toast.success('Webhook deleted successfully');
        // No need to call loadWebhooks - real-time updates will handle this
      } else {
        toast.error(response.error || 'Failed to delete webhook');
      }
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setDeleteDialogOpen(false);
      setWebhookToDelete(null);
    }
  };

  const handleTestWebhook = async (webhook: Webhook) => {
    setIsTestingWebhook(prev => ({ ...prev, [webhook.id]: true }));
    
    try {
      const response = await testWebhook(webhook.url);
      if (response.success) {
        toast.success('Webhook test successful');
      } else {
        toast.error('Webhook test failed');
      }
    } catch (error) {
      console.error('Error testing webhook:', error);
      toast.error('Failed to test webhook');
    } finally {
      setIsTestingWebhook(prev => ({ ...prev, [webhook.id]: false }));
    }
  };

  const handleEditWebhook = (webhook: Webhook) => {
    setFormData({
      name: webhook.name,
      url: webhook.url,
      active: webhook.active,
      triggerEvents: [...webhook.triggerEvents],
      isEditing: true,
      editId: webhook.id
    });
    setIsSheetOpen(true);
  };

  const confirmDeleteWebhook = (webhook: Webhook) => {
    setWebhookToDelete(webhook);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      active: true,
      triggerEvents: [],
      isEditing: false,
      editId: ''
    });
  };

  const handleSheetOpenChange = (open: boolean) => {
    console.log('Sheet open changed to:', open);
    setIsSheetOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleOpenAddWebhook = () => {
    console.log('Opening add webhook sheet');
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      <WebhookHeader onOpenAddWebhook={handleOpenAddWebhook} />

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{formData.isEditing ? 'Edit Webhook' : 'Add New Webhook'}</SheetTitle>
            <SheetDescription>
              Configure a webhook to notify external systems when events occur in NexaBloom.
            </SheetDescription>
          </SheetHeader>
          <WebhookForm 
            formData={formData}
            onSubmit={handleCreateOrUpdateWebhook}
            onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            availableTriggers={availableTriggers}
          />
        </SheetContent>
      </Sheet>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : webhooks.length === 0 ? (
        <WebhookEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              isTestingWebhook={isTestingWebhook[webhook.id]}
              onEdit={() => handleEditWebhook(webhook)}
              onDelete={() => confirmDeleteWebhook(webhook)}
              onTest={() => handleTestWebhook(webhook)}
              availableTriggers={availableTriggers}
            />
          ))}
        </div>
      )}

      <DeleteWebhookDialog
        webhook={webhookToDelete}
        isOpen={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirmDelete={handleDeleteWebhook}
      />
    </div>
  );
};

export default WebhookIntegrations;
