
import { ComplianceReport } from '@/utils/types';

// Mock data for demonstration
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
  },
  {
    id: '2',
    documentId: '2',
    documentName: 'Data Processing Agreement',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    overallScore: 65,
    gdprScore: 60,
    hipaaScore: 70,
    soc2Score: 65,
    risks: [
      { id: '201', description: 'Insufficient data subject rights', severity: 'high', regulation: 'GDPR' },
      { id: '202', description: 'Weak access control provisions', severity: 'medium', regulation: 'SOC 2' },
    ],
    summary: 'Several compliance gaps identified that require attention',
  },
  {
    id: '3',
    documentId: '3',
    documentName: 'Patient Consent Form',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    overallScore: 92,
    gdprScore: 95,
    hipaaScore: 94,
    soc2Score: 90,
    risks: [
      { id: '301', description: 'Minor formatting issues in consent withdrawal procedure', severity: 'low', regulation: 'HIPAA' },
    ],
    summary: 'Highly compliant document with minimal issues',
  },
  {
    id: '4',
    documentId: '4',
    documentName: 'Vendor Security Assessment',
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    overallScore: 72,
    gdprScore: 75,
    hipaaScore: 70,
    soc2Score: 78,
    risks: [
      { id: '401', description: 'Incomplete data processor obligations', severity: 'medium', regulation: 'GDPR' },
      { id: '402', description: 'Inadequate security controls specification', severity: 'high', regulation: 'SOC 2' },
    ],
    summary: 'Several moderate compliance issues requiring attention',
  },
  {
    id: '5',
    documentId: '5',
    documentName: 'Employee Data Handling Policy',
    timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    overallScore: 45,
    gdprScore: 40,
    hipaaScore: 50,
    soc2Score: 48,
    risks: [
      { id: '501', description: 'Missing legitimate interest assessments', severity: 'high', regulation: 'GDPR' },
      { id: '502', description: 'No data minimization procedures', severity: 'high', regulation: 'GDPR' },
      { id: '503', description: 'Weak access control provisions', severity: 'medium', regulation: 'SOC 2' },
    ],
    summary: 'Significant compliance gaps requiring immediate attention',
  },
];
