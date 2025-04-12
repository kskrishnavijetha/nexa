
import { SlackMessage, SlackViolation } from './types';

/**
 * Analyze messages for potential compliance violations
 */
export const analyzeMessagesForViolations = (messages: SlackMessage[]): SlackViolation[] => {
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
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};
