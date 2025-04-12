
import { SlackScanOptions, SlackViolation } from './types';
import { isSlackConnected } from './slackAuth';
import { toast } from 'sonner';
import { addReportToHistory } from '../historyService';
import { Industry } from '@/utils/types';

interface RealTimeMonitoringOptions {
  options: SlackScanOptions;
  onViolationDetected: (violations: SlackViolation[]) => void;
  onError: (error: Error) => void;
}

// Store the interval ID for cleanup
let monitoringInterval: number | null = null;
let currentViolations: SlackViolation[] = [];

// Mock violations for demo purposes
const mockViolations: SlackViolation[] = [
  {
    messageId: 'msg1',
    text: 'This contains confidential customer data: 123-45-6789',
    severity: 'high',
    rule: 'PII_DETECTED',
    context: 'Here is a customer SSN: 123-45-6789',
    timestamp: new Date().toISOString(),
    user: 'User1',
    channel: 'general'
  },
  {
    messageId: 'msg2',
    text: 'Let me share my password: p@ssw0rd123!',
    severity: 'high',
    rule: 'CREDENTIALS_SHARED',
    context: 'Let me share my password: p@ssw0rd123!',
    timestamp: new Date().toISOString(),
    user: 'User2',
    channel: 'development'
  },
  {
    messageId: 'msg3',
    text: 'Sending internal document link: https://docs.internal.company.com/confidential',
    severity: 'medium',
    rule: 'INTERNAL_LINK_SHARED',
    context: 'Sending internal document link: https://docs.internal.company.com/confidential',
    timestamp: new Date().toISOString(),
    user: 'User3',
    channel: 'general'
  }
];

/**
 * Start real-time monitoring of Slack messages
 */
export const startRealTimeMonitoring = (options: RealTimeMonitoringOptions) => {
  if (!isSlackConnected()) {
    throw new Error('Slack is not connected');
  }
  
  // Clear any existing monitoring
  if (monitoringInterval !== null) {
    clearInterval(monitoringInterval);
  }
  
  // Reset violations
  currentViolations = [];
  
  // For demo purposes, we'll gradually add mock violations
  monitoringInterval = window.setInterval(() => {
    try {
      // Randomly decide if we detect a new violation (30% chance)
      if (Math.random() < 0.3) {
        // Select a random violation from our mocks
        const randomViolation = { 
          ...mockViolations[Math.floor(Math.random() * mockViolations.length)],
          messageId: `msg-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        // Add to our current set
        currentViolations = [randomViolation, ...currentViolations];
        
        // If using "strict" sensitivity, add more violations
        if (options.options.sensitivityLevel === 'strict' && Math.random() < 0.5) {
          const secondViolation = { 
            ...mockViolations[Math.floor(Math.random() * mockViolations.length)],
            messageId: `msg-${Date.now() + 100}`,
            timestamp: new Date().toISOString()
          };
          currentViolations = [secondViolation, ...currentViolations];
        }
        
        // Notify via the callback
        options.onViolationDetected([...currentViolations]);
        
        // Show toast for high severity violations
        const highSeverityViolations = currentViolations.filter(v => v.severity === 'high');
        if (highSeverityViolations.length > 0) {
          toast.warning('High severity violation detected', {
            description: highSeverityViolations[0].rule,
          });
          
          // Add to history
          addReportToHistory({
            documentId: `slack-rt-${Date.now()}`,
            documentName: `Slack Monitoring ${new Date().toLocaleString()}`,
            timestamp: new Date().toISOString(),
            scanDate: new Date().toISOString(),
            industry: 'Cloud & SaaS' as Industry,
            overallScore: 75,
            gdprScore: 70,
            hipaaScore: 80,
            soc2Score: 75,
            summary: `Real-time monitoring detected ${currentViolations.length} violations`,
            risks: currentViolations.map(v => ({
              id: v.messageId,
              title: v.rule,
              description: v.text,
              severity: v.severity as any,
              regulation: v.rule,
              mitigation: 'Review and remove sensitive information'
            })),
            complianceStatus: 'partially-compliant',
            regulations: ['GDPR', 'Data Privacy']
          });
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        options.onError(error);
      } else {
        options.onError(new Error('Unknown monitoring error'));
      }
    }
  }, 10000); // Check every 10 seconds
};

/**
 * Stop real-time monitoring
 */
export const stopRealTimeMonitoring = () => {
  if (monitoringInterval !== null) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
  }
};
