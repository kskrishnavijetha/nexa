
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetFooter } from "@/components/ui/sheet";
import { WebhookTrigger } from '@/utils/webhook/webhookServices';

interface WebhookFormProps {
  formData: {
    name: string;
    url: string;
    active: boolean;
    triggerEvents: WebhookTrigger[];
    isEditing: boolean;
    editId: string;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (formData: Partial<WebhookFormProps['formData']>) => void;
  availableTriggers: { value: WebhookTrigger; label: string }[];
}

const WebhookForm = ({ formData, onSubmit, onChange, availableTriggers }: WebhookFormProps) => {
  const toggleTrigger = (trigger: WebhookTrigger) => {
    const updatedTriggers = formData.triggerEvents.includes(trigger)
      ? formData.triggerEvents.filter(t => t !== trigger)
      : [...formData.triggerEvents, trigger];
    onChange({ triggerEvents: updatedTriggers });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Webhook Name</Label>
        <Input 
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Slack Notifications"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">Endpoint URL</Label>
        <Input 
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://hooks.slack.com/services/..."
        />
        <p className="text-xs text-muted-foreground">
          The URL where compliance notifications will be sent
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="active" 
            checked={formData.active}
            onCheckedChange={(checked) => 
              onChange({ active: checked === true })}
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
        <Label>Notification Events</Label>
        <div className="grid grid-cols-1 gap-3">
          {availableTriggers.map((trigger) => (
            <div key={trigger.value} className="flex items-start space-x-2">
              <Checkbox 
                id={`trigger-${trigger.value}`} 
                checked={formData.triggerEvents.includes(trigger.value)}
                onCheckedChange={() => toggleTrigger(trigger.value)}
              />
              <div className="space-y-1 leading-none">
                <label
                  htmlFor={`trigger-${trigger.value}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {trigger.label}
                </label>
              </div>
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
  );
};

export default WebhookForm;
