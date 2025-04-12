
import { SlackMessage, SlackScanOptions } from './types';
import { getSlackToken } from './slackAuth';

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
