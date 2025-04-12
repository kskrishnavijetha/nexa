
import { toast } from 'sonner';
import { SlackScanOptions, SlackScanResults } from './types';
import { getSlackToken, setSlackToken, clearSlackToken, isSlackConnected } from './slackAuth';
import { fetchSlackMessages } from './slackMessages';
import { analyzeMessagesForViolations } from './slackAnalysis';
import { useServiceHistoryStore } from '@/hooks/useServiceHistoryStore';

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
    
    // Add the scan to history
    try {
      const { addScanHistory } = useServiceHistoryStore.getState();
      addScanHistory({
        serviceId: results.scanId,
        serviceName: 'Slack Compliance Scan',
        scanDate: results.timestamp,
        itemsScanned: results.scannedMessages,
        violationsFound: results.violations.length,
        documentName: `Slack Scan ${new Date().toLocaleString()}`,
        industry: 'Technology',
        regulations: ['Data Privacy', 'Information Security']
      });
    } catch (e) {
      console.error('Failed to add scan to history:', e);
    }
    
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

/**
 * Export Slack scan results to audit trail format
 */
export const exportScanResultsToAudit = (results: SlackScanResults) => {
  if (!results) return null;
  
  // Format for audit trail
  const auditEvents = results.violations.map(violation => ({
    id: violation.messageId,
    timestamp: violation.timestamp,
    action: violation.rule,
    severity: violation.severity,
    user: violation.user,
    channel: violation.channel,
    text: violation.text
  }));
  
  return {
    events: auditEvents,
    summary: {
      totalEvents: results.violations.length,
      scannedMessages: results.scannedMessages,
      scannedFiles: results.scannedFiles,
      timestamp: results.timestamp
    }
  };
};
