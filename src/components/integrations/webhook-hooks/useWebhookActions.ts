
import { useState } from 'react';
import { Webhook, WebhookTrigger } from '@/utils/webhook/webhookServices';
import { createWebhook, updateWebhook, deleteWebhook, testWebhook } from '@/utils/webhook/webhookServices';
import { toast } from "sonner";

export const useWebhookActions = (
  setIsSheetOpen: (open: boolean) => void,
  setIsTestingWebhook: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  const [webhookToDelete, setWebhookToDelete] = useState<Webhook | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    active: true,
    triggerEvents: [] as WebhookTrigger[],
    isEditing: false,
    editId: ''
  });

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
        setIsSheetOpen(false);
      } else {
        toast.error(response.error || 'Failed to save webhook');
      }
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleTestWebhook = async (webhook: Webhook) => {
    // Fix the type issue - use proper React.SetStateAction syntax
    setIsTestingWebhook((prev) => {
      const newState = { ...prev };
      newState[webhook.id] = true;
      return newState;
    });
    
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
      // Fix the type issue - use proper React.SetStateAction syntax
      setIsTestingWebhook((prev) => {
        const newState = { ...prev };
        newState[webhook.id] = false;
        return newState;
      });
    }
  };

  const handleDeleteWebhook = async () => {
    if (!webhookToDelete) return;

    try {
      const response = await deleteWebhook(webhookToDelete.id);
      if (response.success) {
        toast.success('Webhook deleted successfully');
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

  return {
    formData,
    setFormData,
    webhookToDelete,
    setWebhookToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleCreateOrUpdateWebhook,
    handleTestWebhook,
    handleDeleteWebhook,
    resetForm
  };
};
