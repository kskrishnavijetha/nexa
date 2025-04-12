
/**
 * Authentication utilities for Slack integration
 */

// Mock Slack API token - in a real implementation, this would be stored securely
let slackToken: string | null = null;

/**
 * Set the Slack API token for authentication
 */
export const setSlackToken = (token: string) => {
  slackToken = token;
  localStorage.setItem('slack_token', token);
  return true;
};

/**
 * Get the stored Slack token
 */
export const getSlackToken = (): string | null => {
  if (!slackToken) {
    slackToken = localStorage.getItem('slack_token');
  }
  return slackToken;
};

/**
 * Clear the stored Slack token
 */
export const clearSlackToken = () => {
  slackToken = null;
  localStorage.removeItem('slack_token');
};

/**
 * Check if the Slack integration is connected
 */
export const isSlackConnected = (): boolean => {
  return !!getSlackToken();
};
