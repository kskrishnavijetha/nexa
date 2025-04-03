
import { GoogleService } from '@/components/google/types';
import { Industry, RiskSeverity } from '@/utils/types';
import { ScanViolation } from '@/components/google/types';

export function useFallbackResults() {
  const generateIndustrySpecificFallbackResults = (
    connectedServices: GoogleService[],
    industry?: Industry
  ) => {
    let fallbackViolations: ScanViolation[] = [];
    
    switch(industry) {
      case 'Finance & Banking':
        fallbackViolations = [
          {
            title: 'PCI Data Retention',
            description: 'Financial documents exceed retention policy',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Financial Records',
            industry: 'Finance & Banking'
          },
          {
            title: 'Customer Financial Information',
            description: 'Unencrypted account numbers detected',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Customer Files',
            industry: 'Finance & Banking'
          }
        ];
        break;
        
      case 'Healthcare':
        fallbackViolations = [
          {
            title: 'PHI Exposure Risk',
            description: 'Patient health information in unsecured document',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Patient Records',
            industry: 'Healthcare'
          },
          {
            title: 'HIPAA Consent Forms',
            description: 'Missing signed authorization forms',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Consent Forms',
            industry: 'Healthcare'
          }
        ];
        break;
        
      case 'Retail & Consumer':
        fallbackViolations = [
          {
            title: 'Credit Card Information',
            description: 'PCI-DSS violation: stored card data',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Sales Records',
            industry: 'Retail & Consumer'
          },
          {
            title: 'Customer Personal Data',
            description: 'Customer data shared without consent',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Marketing Lists',
            industry: 'Retail & Consumer'
          }
        ];
        break;
        
      // Default case for other industries
      default:
        fallbackViolations = [
          {
            title: 'Data Retention Policy',
            description: 'Documents exceed maximum retention period',
            severity: 'medium' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Shared Documents',
            industry: industry || 'Global'
          },
          {
            title: 'Sensitive Information',
            description: 'PII detected in unsecured document',
            severity: 'high' as RiskSeverity,
            service: connectedServices[0] || 'drive',
            location: 'Personal Files',
            industry: industry || 'Global'
          }
        ];
    }
    
    return fallbackViolations;
  };

  return { generateIndustrySpecificFallbackResults };
}
