
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import WebhookForm from './webhook-form/WebhookForm';
import WebhookCard from './webhook-card/WebhookCard';
import WebhookEmptyState from './webhook-empty-state/WebhookEmptyState';
import WebhookHeader from './webhook-header/WebhookHeader';
import DeleteWebhookDialog from './webhook-dialog/DeleteWebhookDialog';
import { useWebhookState } from './webhook-hooks/useWebhookState';
import { useWebhookActions } from './webhook-hooks/useWebhookActions';
import { useWebhookData } from './webhook-hooks/useWebhookData';
import { Webhook } from '@/utils/webhook/webhookServices';

const WebhookIntegrations = () => {
  const {
    webhooks,
    isLoading,
    isSheetOpen,
    setIsSheetOpen,
    isTestingWebhook,
    setIsTestingWebhook
  } = useWebhookState();

  const {
    formData,
    setFormData,
    webhookToDelete,
    setWebhookToDelete,  // This was missing and causing the error
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleCreateOrUpdateWebhook,
    handleTestWebhook,
    handleDeleteWebhook,
  } = useWebhookActions(setIsSheetOpen, setIsTestingWebhook);

  const { availableTriggers } = useWebhookData();

  const handleSheetOpenChange = (open: boolean) => {
    console.log('Sheet open changed to:', open);
    setIsSheetOpen(open);
    if (!open) {
      setFormData(prev => ({
        ...prev,
        name: '',
        url: '',
        active: true,
        triggerEvents: [],
        isEditing: false,
        editId: ''
      }));
    }
  };

  const handleOpenAddWebhook = () => {
    console.log('Opening add webhook sheet');
    setIsSheetOpen(true);
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
