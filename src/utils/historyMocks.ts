
import { ComplianceReport } from '@/utils/types';

// Real production data would be fetched from an API
export const mockScans: ComplianceReport[] = [
  {
    id: '1',
    documentId: '1',
    documentName: 'Privacy Policy v2.0',
    timestamp: new Date().toISOString(),
    overallScore: 85,
    gdprScore: 90,
    hipaaScore: 82,
    soc2Score: 88,
    risks: [
      { id: '101', description: 'Missing data retention policy', severity: 'medium', regulation: 'GDPR' },
      { id: '102', description: 'Inadequate breach notification procedure', severity: 'low', regulation: 'HIPAA' },
    ],
    summary: 'Generally compliant with minor improvements needed',
  }
];

