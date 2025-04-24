
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
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PlusIcon, RotateCwIcon, Trash2Icon, Loader2, CheckCircleIcon, XCircleIcon, ZapIcon } from 'lucide-react';
import { toast } from "sonner";

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

    // Validate URL format
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

  const toggleTrigger = (trigger: WebhookTrigger) => {
    if (formData.triggerEvents.includes(trigger)) {
      setFormData({
        ...formData,
        triggerEvents: formData.triggerEvents.filter(t => t !== trigger)
      });
    } else {
      setFormData({
        ...formData,
        triggerEvents: [...formData.triggerEvents, trigger]
      });
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
            <form onSubmit={handleCreateOrUpdateWebhook} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter a name for this webhook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Webhook URL</Label>
                <Input 
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/webhooks/compliance"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="active" 
                    checked={formData.active}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, active: checked === true })}
                  />
                  <label
                    htmlFor="active"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Active
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <Label>Trigger Events</Label>
                <div className="grid grid-cols-1 gap-2">
                  {availableTriggers.map((trigger) => (
                    <div key={trigger.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`trigger-${trigger.value}`} 
                        checked={formData.triggerEvents.includes(trigger.value)}
                        onCheckedChange={() => toggleTrigger(trigger.value)}
                      />
                      <label
                        htmlFor={`trigger-${trigger.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {trigger.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <SheetFooter className="pt-4">
                <Button type="submit" className="w-full">
                  {formData.isEditing ? 'Update Webhook' : 'Create Webhook'}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : webhooks.length === 0 ? (
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
              <Button onClick={() => setIsSheetOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </SheetTrigger>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id} className={webhook.active ? "" : "opacity-70"}>
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
                      onClick={() => handleEditWebhook(webhook)}
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
                      onClick={() => confirmDeleteWebhook(webhook)}
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
                  onClick={() => handleTestWebhook(webhook)}
                  disabled={isTestingWebhook[webhook.id]}
                  className="text-xs"
                >
                  {isTestingWebhook[webhook.id] ? (
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
