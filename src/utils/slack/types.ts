
import { SupportedLanguage } from '@/utils/language';

export interface SlackMessage {
  id: string;
  text: string;
  user: string;
  channel: string;
  timestamp: string;
  hasAttachments: boolean;
  attachments?: SlackAttachment[];
}

export interface SlackAttachment {
  id: string;
  name: string;
  filetype: string;
  url: string;
  size: number;
}

export interface SlackViolation {
  messageId: string;
  text: string;
  severity: 'high' | 'medium' | 'low';
  rule: string;
  context: string;
  timestamp: string;
  user: string;
  channel: string;
}

export interface SlackScanOptions {
  channels: string[];
  timeRange: 'hour' | 'day' | 'week' | 'month';
  language: SupportedLanguage;
  sensitivityLevel: 'strict' | 'standard' | 'relaxed';
}

export interface SlackScanResults {
  scanId: string;
  timestamp: string;
  violations: SlackViolation[];
  scannedMessages: number;
  scannedFiles: number;
  status: 'completed' | 'in-progress' | 'failed';
}
