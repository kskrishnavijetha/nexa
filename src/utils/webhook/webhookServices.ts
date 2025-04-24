
import { ApiResponse } from '@/utils/types';
import { updateWebhooksCache, addWebhookToCache, updateWebhookInCache, removeWebhookFromCache } from './webhookRealtime';

// Types for webhook integrations
export interface Webhook {
  id: string;
  name: string;
  url: string;
  triggerEvents: WebhookTrigger[];
  active: boolean;
  createdAt: string;
  lastTriggered?: string;
}

export type WebhookTrigger = 
  | 'compliance_violation' 
  | 'high_risk_detected' 
  | 'pii_detected' 
  | 'scan_completed' 
  | 'service_connected' 
  | 'service_disconnected';

export interface WebhookTriggerPayload {
  event: WebhookTrigger;
  timestamp: string;
  sourceSystem: string;
  data: Record<string, any>;
}

// Mock webhooks data
let mockWebhooks: Webhook[] = [
  {
    id: 'webhook-1',
    name: 'Slack Alert',
    url: 'https://hooks.slack.com/services/example',
    triggerEvents: ['compliance_violation', 'high_risk_detected'],
    active: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'webhook-2',
    name: 'Zapier Integration',
    url: 'https://hooks.zapier.com/example',
    triggerEvents: ['scan_completed', 'pii_detected'],
    active: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Get all webhooks
export const getWebhooks = async (): Promise<ApiResponse<Webhook[]>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update the real-time cache
    updateWebhooksCache([...mockWebhooks]);
    
    return {
      success: true,
      data: mockWebhooks,
      status: 200
    };
  } catch (error) {
    console.error('Error getting webhooks:', error);
    return {
      success: false,
      error: 'Failed to get webhooks. Please try again.',
      status: 500
    };
  }
};

// Get a webhook by ID
export const getWebhook = async (webhookId: string): Promise<ApiResponse<Webhook>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const webhook = mockWebhooks.find(w => w.id === webhookId);
    
    if (!webhook) {
      return {
        success: false,
        error: 'Webhook not found',
        status: 404
      };
    }
    
    return {
      success: true,
      data: webhook,
      status: 200
    };
  } catch (error) {
    console.error('Error getting webhook:', error);
    return {
      success: false,
      error: 'Failed to get webhook. Please try again.',
      status: 500
    };
  }
};

// Create a new webhook
export const createWebhook = async (webhook: Omit<Webhook, 'id' | 'createdAt' | 'lastTriggered'>): Promise<ApiResponse<Webhook>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newWebhook: Webhook = {
      ...webhook,
      id: `webhook-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    mockWebhooks.push(newWebhook);
    
    // Update real-time cache with the new webhook
    addWebhookToCache(newWebhook);
    
    return {
      success: true,
      data: newWebhook,
      status: 201
    };
  } catch (error) {
    console.error('Error creating webhook:', error);
    return {
      success: false,
      error: 'Failed to create webhook. Please try again.',
      status: 500
    };
  }
};

// Update an existing webhook
export const updateWebhook = async (webhookId: string, updates: Partial<Omit<Webhook, 'id' | 'createdAt'>>): Promise<ApiResponse<Webhook>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const webhookIndex = mockWebhooks.findIndex(w => w.id === webhookId);
    
    if (webhookIndex === -1) {
      return {
        success: false,
        error: 'Webhook not found',
        status: 404
      };
    }
    
    mockWebhooks[webhookIndex] = {
      ...mockWebhooks[webhookIndex],
      ...updates
    };
    
    // Update real-time cache with the updated webhook
    updateWebhookInCache(mockWebhooks[webhookIndex]);
    
    return {
      success: true,
      data: mockWebhooks[webhookIndex],
      status: 200
    };
  } catch (error) {
    console.error('Error updating webhook:', error);
    return {
      success: false,
      error: 'Failed to update webhook. Please try again.',
      status: 500
    };
  }
};

// Delete a webhook
export const deleteWebhook = async (webhookId: string): Promise<ApiResponse<void>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const webhookIndex = mockWebhooks.findIndex(w => w.id === webhookId);
    
    if (webhookIndex === -1) {
      return {
        success: false,
        error: 'Webhook not found',
        status: 404
      };
    }
    
    mockWebhooks.splice(webhookIndex, 1);
    
    // Update real-time cache by removing the webhook
    removeWebhookFromCache(webhookId);
    
    return {
      success: true,
      status: 204
    };
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return {
      success: false,
      error: 'Failed to delete webhook. Please try again.',
      status: 500
    };
  }
};

// Trigger a webhook with a payload
export const triggerWebhook = async (url: string, payload: WebhookTriggerPayload): Promise<ApiResponse<boolean>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Triggering webhook to ${url} with payload:`, payload);
    
    // In a real implementation, this would make an HTTP request to the webhook URL
    // For demo purposes, we'll just simulate a successful response
    
    // Update lastTriggered time for the webhook if it exists in our mock data
    const webhook = mockWebhooks.find(w => w.url === url);
    if (webhook) {
      webhook.lastTriggered = new Date().toISOString();
      
      // Update real-time cache with the updated webhook
      updateWebhookInCache(webhook);
    }
    
    return {
      success: true,
      data: true, // Successfully triggered
      status: 200
    };
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return {
      success: false,
      error: 'Failed to trigger webhook. Please try again.',
      status: 500
    };
  }
};

// Test a webhook with a ping payload
export const testWebhook = async (url: string): Promise<ApiResponse<boolean>> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const testPayload: WebhookTriggerPayload = {
      event: 'scan_completed',
      timestamp: new Date().toISOString(),
      sourceSystem: 'webhook_test',
      data: {
        message: 'This is a test ping from the compliance monitoring system',
        test: true
      }
    };
    
    // In a real implementation, this would make an HTTP request to the webhook URL
    console.log(`Testing webhook to ${url} with test payload:`, testPayload);
    
    // Update lastTriggered time for the webhook if it exists in our mock data
    const webhook = mockWebhooks.find(w => w.url === url);
    if (webhook) {
      webhook.lastTriggered = new Date().toISOString();
      
      // Update real-time cache with the updated webhook
      updateWebhookInCache(webhook);
    }
    
    return {
      success: true,
      data: true, // Successfully tested
      status: 200
    };
  } catch (error) {
    console.error('Error testing webhook:', error);
    return {
      success: false,
      error: 'Failed to test webhook. Please try again.',
      status: 500
    };
  }
};

// Initialize the real-time cache with the mock webhooks
updateWebhooksCache([...mockWebhooks]);
