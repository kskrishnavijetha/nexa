
import { ComplianceReport } from '@/utils/types';

// Real production data would be fetched from an API
export const mockScans: ComplianceReport[] = [
  {
    documentId: '1',
    id: '1', // Added to match expected usage
    documentName: 'Privacy Policy v2.0',
    timestamp: new Date().toISOString(),
    overallScore: 85,
    gdprScore: 90,
    hipaaScore: 82,
    soc2Score: 88,
    industryScore: 85, // Added required field
    regionalScore: 87, // Added required field
    regulationScore: 84, // Added required field
    risks: [
      { 
        id: '101', 
        title: 'Data Retention',
        description: 'Missing data retention policy', 
        severity: 'medium', 
        regulation: 'GDPR',
        mitigation: 'Implement a clear data retention policy'
      },
      { 
        id: '102', 
        title: 'Breach Notification',
        description: 'Inadequate breach notification procedure', 
        severity: 'low', 
        regulation: 'HIPAA',
        mitigation: 'Update breach notification procedures'
      },
    ],
    summary: 'Generally compliant with minor improvements needed',
    industry: 'Technology',
    region: 'North America',
    complianceStatus: 'partially-compliant', // Added required field
    regulations: ['GDPR', 'HIPAA'], // Added required field
    suggestions: []
  }
];
