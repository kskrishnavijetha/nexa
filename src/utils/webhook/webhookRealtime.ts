
import { Webhook } from './webhookServices';

// Type definitions for the subscription callbacks
export type WebhookChangeCallback = (webhooks: Webhook[]) => void;
type Subscription = string | number;

// In-memory storage of all webhook data
let webhooksCache: Webhook[] = [];

// Store all active subscriptions
const subscriptions: Map<Subscription, WebhookChangeCallback> = new Map();

// Counter for generating unique subscription IDs
let subscriptionCounter = 0;

// Function to subscribe to webhook changes
export const subscribeToWebhookChanges = (callback: WebhookChangeCallback): Subscription => {
  const subscriptionId = subscriptionCounter++;
  subscriptions.set(subscriptionId, callback);
  
  console.log(`New webhook subscription created: ${subscriptionId}`);
  
  // If we already have webhooks in the cache, immediately notify the new subscriber
  if (webhooksCache.length > 0) {
    setTimeout(() => callback([...webhooksCache]), 0);
  }
  
  return subscriptionId;
};

// Function to unsubscribe from webhook changes
export const unsubscribeFromWebhookChanges = (subscriptionId: Subscription): void => {
  if (subscriptions.has(subscriptionId)) {
    subscriptions.delete(subscriptionId);
    console.log(`Webhook subscription removed: ${subscriptionId}`);
  }
};

// Function to update the webhook cache and notify all subscribers
export const updateWebhooksCache = (webhooks: Webhook[]): void => {
  webhooksCache = [...webhooks];
  
  // Notify all subscribers of the change
  subscriptions.forEach((callback) => {
    try {
      callback([...webhooksCache]);
    } catch (error) {
      console.error('Error in webhook subscription callback:', error);
    }
  });
};

// Function to add a webhook to the cache
export const addWebhookToCache = (webhook: Webhook): void => {
  webhooksCache = [...webhooksCache, webhook];
  notifySubscribers();
};

// Function to update a webhook in the cache
export const updateWebhookInCache = (updatedWebhook: Webhook): void => {
  webhooksCache = webhooksCache.map(webhook => 
    webhook.id === updatedWebhook.id ? updatedWebhook : webhook
  );
  notifySubscribers();
};

// Function to remove a webhook from the cache
export const removeWebhookFromCache = (webhookId: string): void => {
  webhooksCache = webhooksCache.filter(webhook => webhook.id !== webhookId);
  notifySubscribers();
};

// Helper function to notify all subscribers
const notifySubscribers = (): void => {
  subscriptions.forEach((callback) => {
    try {
      callback([...webhooksCache]);
    } catch (error) {
      console.error('Error in webhook subscription callback:', error);
    }
  });
};

// Initialize with empty array
updateWebhooksCache([]);
