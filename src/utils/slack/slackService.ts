
import { toast } from 'sonner';
import { SlackScanOptions, SlackScanResults } from './types';
import { getSlackToken, setSlackToken, clearSlackToken, isSlackConnected } from './slackAuth';
import { fetchSlackMessages } from './slackMessages';
import { analyzeMessagesForViolations } from './slackAnalysis';

// Re-export the auth functions for backward compatibility
export { setSlackToken, getSlackToken, clearSlackToken, isSlackConnected };

/**
 * Scan Slack messages for compliance violations
 */
export const scanSlackMessages = async (options: SlackScanOptions): Promise<SlackScanResults> => {
  try {
    // Fetch messages from Slack
    const messages = await fetchSlackMessages(options);
    
    // Simulate processing time based on the number of messages
    await new Promise(resolve => setTimeout(resolve, messages.length * 50 + 1000));
    
    // Analyze messages for violations (in a real implementation, this would use AI)
    const violations = analyzeMessagesForViolations(messages);
    
    const results: SlackScanResults = {
      scanId: `slack-scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      violations,
      scannedMessages: messages.length,
      scannedFiles: messages.reduce((count, msg) => count + (msg.attachments?.length || 0), 0),
      status: 'completed'
    };
    
    return results;
  } catch (error) {
    console.error('Slack scan error:', error);
    toast.error('Failed to scan Slack messages. Please try again.');
    
    return {
      scanId: `slack-scan-error-${Date.now()}`,
      timestamp: new Date().toISOString(),
      violations: [],
      scannedMessages: 0,
      scannedFiles: 0,
      status: 'failed'
    };
  }
};
