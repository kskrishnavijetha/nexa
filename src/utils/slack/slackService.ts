
import { toast } from 'sonner';
import { SlackMessage, SlackScanOptions, SlackScanResults, SlackViolation } from './types';

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

/**
 * Fetch recent messages from specified Slack channels
 */
export const fetchSlackMessages = async (options: SlackScanOptions): Promise<SlackMessage[]> => {
  const token = getSlackToken();
  if (!token) {
    throw new Error('Slack token not found. Please connect to Slack first.');
  }
  
  // In a real implementation, this would call the Slack API
  // For now, we'll return mock data
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  
  return generateMockMessages(options);
};

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

/**
 * Generate mock messages for development and testing
 */
const generateMockMessages = (options: SlackScanOptions): SlackMessage[] => {
  const messageCount = Math.floor(Math.random() * 50) + 20; // 20-70 messages
  const messages: SlackMessage[] = [];
  
  const sensitivePatterns = [
    'social security number',
    'SSN',
    'credit card',
    'password',
    'bank account',
    'confidential',
    'private data',
    'personal information',
    'secret'
  ];
  
  const channelNames = options.channels.length > 0 
    ? options.channels 
    : ['general', 'random', 'project-x', 'compliance', 'hr-team'];
  
  const userNames = ['alex', 'taylor', 'jordan', 'casey', 'morgan', 'pat', 'robin'];
  
  const getRandomDate = () => {
    const now = new Date();
    let daysAgo;
    
    switch(options.timeRange) {
      case 'hour': daysAgo = 0; break;
      case 'day': daysAgo = 1; break;
      case 'week': daysAgo = 7; break;
      case 'month': daysAgo = 30; break;
      default: daysAgo = 7;
    }
    
    const pastDate = new Date(now.getTime() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
    return pastDate.toISOString();
  };
  
  for (let i = 0; i < messageCount; i++) {
    // Randomly decide if this message will contain sensitive information (10-20% chance)
    const containsSensitiveInfo = Math.random() < (options.sensitivityLevel === 'strict' ? 0.2 : 
                                                 options.sensitivityLevel === 'standard' ? 0.15 : 0.1);
    
    let messageText = containsSensitiveInfo 
      ? `Here's the ${sensitivePatterns[Math.floor(Math.random() * sensitivePatterns.length)]} you requested: 123-45-6789`
      : `Just updating the team on project progress. We're on track for the deadline.`;
    
    // Randomly decide if this message has attachments (30% chance)
    const hasAttachments = Math.random() < 0.3;
    
    const message: SlackMessage = {
      id: `msg-${Date.now()}-${i}`,
      text: messageText,
      user: userNames[Math.floor(Math.random() * userNames.length)],
      channel: channelNames[Math.floor(Math.random() * channelNames.length)],
      timestamp: getRandomDate(),
      hasAttachments
    };
    
    if (hasAttachments) {
      const attachmentCount = Math.floor(Math.random() * 3) + 1; // 1-3 attachments
      message.attachments = Array(attachmentCount).fill(0).map((_, j) => {
        const fileTypes = ['pdf', 'docx', 'xlsx', 'txt', 'jpg', 'png'];
        const selectedType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
        
        return {
          id: `file-${Date.now()}-${i}-${j}`,
          name: `document-${j}.${selectedType}`,
          filetype: selectedType,
          url: `https://example.com/files/document-${j}.${selectedType}`,
          size: Math.floor(Math.random() * 5000000) + 10000 // 10KB to 5MB
        };
      });
    }
    
    messages.push(message);
  }
  
  return messages;
};

/**
 * Analyze messages for potential compliance violations
 */
const analyzeMessagesForViolations = (messages: SlackMessage[]): SlackViolation[] => {
  const violations: SlackViolation[] = [];
  
  // Patterns to check for (very simplified - a real implementation would use AI)
  const sensitivePatterns = [
    { pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, rule: 'SSN_DETECTED', severity: 'high' as const },
    { pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g, rule: 'CREDIT_CARD_DETECTED', severity: 'high' as const },
    { pattern: /password/gi, rule: 'PASSWORD_REFERENCE', severity: 'medium' as const },
    { pattern: /confidential|classified/gi, rule: 'CONFIDENTIAL_DATA', severity: 'medium' as const },
    { pattern: /private|personal/gi, rule: 'PERSONAL_DATA', severity: 'low' as const },
  ];
  
  messages.forEach(message => {
    for (const { pattern, rule, severity } of sensitivePatterns) {
      const matches = message.text.match(pattern);
      if (matches) {
        violations.push({
          messageId: message.id,
          text: message.text,
          severity,
          rule,
          context: extractContext(message.text, matches[0]),
          timestamp: message.timestamp,
          user: message.user,
          channel: message.channel
        });
      }
    }
    
    // Check attachments for sensitive file types or names
    if (message.attachments) {
      message.attachments.forEach(attachment => {
        if (['xlsx', 'csv'].includes(attachment.filetype) && 
            (attachment.name.toLowerCase().includes('personal') || 
             attachment.name.toLowerCase().includes('employee') ||
             attachment.name.toLowerCase().includes('financial'))) {
          violations.push({
            messageId: message.id,
            text: `Potentially sensitive file uploaded: ${attachment.name}`,
            severity: 'medium',
            rule: 'SENSITIVE_FILE_UPLOAD',
            context: `File: ${attachment.name} (${attachment.filetype.toUpperCase()}, ${formatFileSize(attachment.size)})`,
            timestamp: message.timestamp,
            user: message.user,
            channel: message.channel
          });
        }
      });
    }
  });
  
  return violations;
};

/**
 * Extract context around the matched pattern
 */
const extractContext = (text: string, match: string): string => {
  const matchIndex = text.indexOf(match);
  const startIndex = Math.max(0, matchIndex - 20);
  const endIndex = Math.min(text.length, matchIndex + match.length + 20);
  
  let context = text.substring(startIndex, endIndex);
  if (startIndex > 0) context = '...' + context;
  if (endIndex < text.length) context = context + '...';
  
  return context;
};

/**
 * Format file size in human-readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
