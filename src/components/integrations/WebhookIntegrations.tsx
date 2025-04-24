
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
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusIcon, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import WebhookForm from './webhook-form/WebhookForm';
import WebhookCard from './webhook-card/WebhookCard';
import WebhookEmptyState from './webhook-empty-state/WebhookEmptyState';

const WebhookIntegrations = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<Webhook | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState<{ [key: string]: boolean }>({});

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    active: true,
    triggerEvents: [] as WebhookTrigger[],
    isEditing: false,
    editId: ''
  });

  // Available webhook triggers
  const availableTriggers: { value: WebhookTrigger; label: string }[] = [
    { value: 'compliance_violation', label: 'Compliance Violation Detected' },
    { value: 'high_risk_detected', label: 'High Risk Content Detected' },
    { value: 'pii_detected', label: 'PII Information Detected' },
    { value: 'scan_completed', label: 'Document Scan Completed' },
    { value: 'service_connected', label: 'External Service Connected' },
    { value: 'service_disconnected', label: 'External Service Disconnected' },
  ];

  useEffect(() => {
    loadWebhooks();
  }, []);

  const loadWebhooks = async () => {
    setIsLoading(true);
    try {
      const response = await getWebhooks();
      if (response.success && response.data) {
        setWebhooks(response.data);
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
        loadWebhooks();
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
        loadWebhooks();
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
    setIsSheetOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Webhook Integrations</h2>
          <p className="text-muted-foreground">
            Send notifications to other systems when compliance events occur
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </SheetTrigger>
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
      </div>

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

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the webhook "{webhookToDelete?.name}". 
              Any systems relying on this webhook will no longer receive notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteWebhook} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WebhookIntegrations;
