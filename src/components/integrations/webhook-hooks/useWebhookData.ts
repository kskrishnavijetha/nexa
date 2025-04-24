
import { WebhookTrigger } from '@/utils/webhook/webhookServices';

export const useWebhookData = () => {
  const availableTriggers: { value: WebhookTrigger; label: string }[] = [
    { value: 'compliance_violation', label: 'Compliance Violation Detected' },
    { value: 'high_risk_detected', label: 'High Risk Content Detected' },
    { value: 'pii_detected', label: 'PII Information Detected' },
    { value: 'scan_completed', label: 'Document Scan Completed' },
    { value: 'service_connected', label: 'External Service Connected' },
    { value: 'service_disconnected', label: 'External Service Disconnected' },
  ];

  return {
    availableTriggers
  };
};
