
import { AuditEvent } from '@/components/audit/types';
import { AIInsight } from '../types';
import { analyzeUserActivity } from './analyzers/userActivityAnalyzer';
import { analyzeTaskCompletion } from './analyzers/taskCompletionAnalyzer';
import { analyzeActivityOverTime } from './analyzers/timeActivityAnalyzer';
import { analyzeComplianceChecks } from './analyzers/complianceAnalyzer';
import { analyzeSystemBalance } from './analyzers/systemBalanceAnalyzer';
import { analyzeActivityFrequency } from './analyzers/frequencyAnalyzer';
import { analyzeCriticalAssets } from './analyzers/criticalAssetAnalyzer';
import { analyzeRemediationNeeds } from './analyzers/remediationAnalyzer';
import { generateFallbackInsights } from './generators/fallbackInsightGenerator';
import { Industry, INDUSTRY_REGULATIONS } from '@/utils/types';
import { mapToIndustryType } from '../industryUtils';

/**
 * Generate AI-enhanced insights from audit events with more detailed analysis
 */
export const generateAIInsights = (
  auditEvents: AuditEvent[],
  documentName?: string
): AIInsight[] => {
  // Extract industry from document name if possible
  const industry = extractIndustryFromDocument(documentName);
  
  // In a real application, this would call an AI model API
  // For now, we'll generate insights based on patterns in the audit data
  
  const insights: AIInsight[] = [];
  
  // Run all analyzers to generate insights
  insights.push(...analyzeUserActivity(auditEvents));
  insights.push(...analyzeTaskCompletion(auditEvents));
  insights.push(...analyzeActivityOverTime(auditEvents));
  insights.push(...analyzeComplianceChecks(auditEvents));
  insights.push(...analyzeSystemBalance(auditEvents));
  insights.push(...analyzeActivityFrequency(auditEvents));
  insights.push(...analyzeCriticalAssets(auditEvents));
  insights.push(...analyzeRemediationNeeds(auditEvents));
  
  // Add industry-specific insights if industry was detected
  if (industry) {
    insights.push(...generateIndustryInsights(industry, auditEvents));
  }
  
  // Return at least some insights even if our analysis didn't find patterns
  if (insights.length === 0) {
    insights.push(...generateFallbackInsights());
  }
  
  return insights;
};

/**
 * Extract the industry from document name
 */
const extractIndustryFromDocument = (documentName?: string): Industry | undefined => {
  return mapToIndustryType(documentName);
};

/**
 * Generate industry-specific insights based on the industry regulations mapping
 */
const generateIndustryInsights = (industry: Industry, auditEvents: AuditEvent[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  // Get applicable regulations for this industry
  const regulations = INDUSTRY_REGULATIONS[industry] || [];
  
  switch (industry) {
    case 'Healthcare':
      if (regulations.includes('HIPAA')) {
        insights.push({
          title: 'HIPAA Compliance Insight',
          text: 'Patient data access patterns suggest potential privacy control improvements needed.',
          type: 'warning'
        });
      }
      
      if (regulations.includes('HITECH')) {
        insights.push({
          title: 'HITECH Act Compliance',
          text: 'Consider enhanced breach notification procedures to comply with HITECH requirements.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('21 CFR Part 11')) {
        insights.push({
          title: '21 CFR Part 11 Compliance',
          text: 'Electronic records and signatures should be validated against FDA requirements.',
          type: 'warning'
        });
      }
      
      insights.push({
        title: 'Medical Record Security',
        text: 'Implement additional safeguards for electronic protected health information (ePHI).',
        type: 'recommendation'
      });
      break;
      
    case 'Finance & Banking':
      if (regulations.includes('PCI-DSS')) {
        insights.push({
          title: 'PCI DSS Compliance',
          text: 'Strengthen cardholder data environment (CDE) segmentation to improve security posture.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('SOX')) {
        insights.push({
          title: 'SOX Compliance',
          text: 'Financial reporting controls should be reviewed for Sarbanes-Oxley Act compliance.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('GLBA')) {
        insights.push({
          title: 'GLBA Privacy Notices',
          text: 'Update customer privacy notices to comply with Gramm-Leach-Bliley Act requirements.',
          type: 'warning'
        });
      }
      
      insights.push({
        title: 'Financial Transaction Monitoring',
        text: 'Suspicious transaction pattern detection should be enhanced for better fraud prevention.',
        type: 'warning'
      });
      break;
      
    case 'E-Commerce':
    case 'Retail & Consumer':
      if (regulations.includes('CCPA')) {
        insights.push({
          title: 'CCPA Compliance',
          text: 'Implement "Do Not Sell My Personal Information" functionality to comply with California regulations.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('FTC Act')) {
        insights.push({
          title: 'FTC Act Compliance',
          text: 'Review advertising practices and disclosures for compliance with consumer protection laws.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'Customer Data Protection',
        text: 'Consider implementing enhanced customer PII protection measures for loyalty program data.',
        type: 'recommendation'
      });
      
      insights.push({
        title: 'Inventory Tracking',
        text: 'Audit trail for inventory changes shows potential gaps in logging completeness.',
        type: 'warning'
      });
      break;
      
    case 'Cloud & SaaS':
      if (regulations.includes('SOC 2')) {
        insights.push({
          title: 'SOC 2 Service Controls',
          text: 'Enhance monitoring and logging of service availability to meet SOC 2 requirements.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('FedRAMP')) {
        insights.push({
          title: 'FedRAMP Compliance',
          text: 'Government data handling practices need additional controls to meet federal requirements.',
          type: 'warning'
        });
      }
      
      if (regulations.includes('CIS Benchmarks')) {
        insights.push({
          title: 'CIS Benchmark Alignment',
          text: 'System configurations should be assessed against CIS benchmarks for cloud security.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'API Access Controls',
        text: 'Implement stricter rate limiting and authentication for API endpoints to prevent abuse.',
        type: 'recommendation'
      });
      
      insights.push({
        title: 'Development Environment',
        text: 'Code deployment patterns indicate potential bypassing of security review processes.',
        type: 'warning'
      });
      break;
      
    case 'Government & Defense':
      if (regulations.includes('FISMA')) {
        insights.push({
          title: 'FISMA Controls',
          text: 'Federal information system security controls should be regularly assessed and documented.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('ITAR')) {
        insights.push({
          title: 'ITAR Compliance',
          text: 'Technical data export controls need enhancement to prevent unauthorized access.',
          type: 'warning'
        });
      }
      
      if (regulations.includes('CMMC')) {
        insights.push({
          title: 'CMMC Preparation',
          text: 'Prepare for Cybersecurity Maturity Model Certification assessment through enhanced controls.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'Records Management',
        text: 'Implement NARA-compliant records retention schedules for all document categories.',
        type: 'recommendation'
      });
      
      insights.push({
        title: 'Classified Information Handling',
        text: 'Access controls for sensitive information should be reviewed for proper clearance enforcement.',
        type: 'warning'
      });
      break;
      
    case 'Energy & Utilities':
      if (regulations.includes('NERC CIP')) {
        insights.push({
          title: 'Critical Infrastructure Protection',
          text: 'NERC CIP compliance gaps identified in operational technology security controls.',
          type: 'warning'
        });
      }
      
      if (regulations.includes('FERC')) {
        insights.push({
          title: 'FERC Compliance',
          text: 'Regulatory reporting for energy market participation should be reviewed for accuracy.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('ISO 14001')) {
        insights.push({
          title: 'Environmental Management',
          text: 'ISO 14001 environmental impact monitoring should be integrated with compliance processes.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'Smart Grid Security',
        text: 'Enhance network segmentation for industrial control systems to prevent lateral movement.',
        type: 'recommendation'
      });
      break;
      
    case 'Telecom':
      if (regulations.includes('FCC Regulations')) {
        insights.push({
          title: 'FCC Regulations Compliance',
          text: 'Telecommunications service reporting should be reviewed for regulatory completeness.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('CPRA')) {
        insights.push({
          title: 'CPRA Implementation',
          text: 'Prepare for expanded consumer privacy rights under California Privacy Rights Act.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'Customer Data Privacy',
        text: 'CPNI protection measures need enhancement to meet current FCC requirements.',
        type: 'warning'
      });
      
      insights.push({
        title: 'Network Infrastructure Security',
        text: 'Implement additional security monitoring for critical network infrastructure components.',
        type: 'recommendation'
      });
      break;
      
    case 'Manufacturing & Supply Chain':
      if (regulations.includes('ISO 9001')) {
        insights.push({
          title: 'Quality Management',
          text: 'ISO 9001 process documentation should be aligned with compliance management systems.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('C-TPAT')) {
        insights.push({
          title: 'Supply Chain Security',
          text: 'C-TPAT security practices should be extended to all international suppliers.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('RoHS')) {
        insights.push({
          title: 'RoHS Compliance',
          text: 'Material compliance documentation for hazardous substances should be centralized.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'ICS Security Controls',
        text: 'Industrial Control System security monitoring needs enhancement to detect advanced threats.',
        type: 'warning'
      });
      
      insights.push({
        title: 'IoT Device Management',
        text: 'Implement comprehensive IoT device inventory and vulnerability management program.',
        type: 'recommendation'
      });
      break;
      
    case 'Education':
      if (regulations.includes('FERPA')) {
        insights.push({
          title: 'Student Data Privacy',
          text: 'FERPA compliance gaps identified in student record access controls.',
          type: 'warning'
        });
      }
      
      if (regulations.includes('COPPA')) {
        insights.push({
          title: 'Child Online Protection',
          text: 'COPPA compliance requires enhanced consent management for users under 13.',
          type: 'warning'
        });
      }
      
      insights.push({
        title: 'Learning Management Security',
        text: 'Enhance authentication controls for learning management systems to prevent unauthorized access.',
        type: 'recommendation'
      });
      break;
      
    case 'Automotive':
      if (regulations.includes('ISO 26262')) {
        insights.push({
          title: 'Functional Safety',
          text: 'ISO 26262 functional safety documentation should be integrated with compliance processes.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('TS 16949')) {
        insights.push({
          title: 'Quality Management',
          text: 'TS 16949 automotive quality management practices should be digitally transformed.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'Connected Vehicle Security',
        text: 'Implement stronger security controls for connected vehicle systems.',
        type: 'warning'
      });
      
      insights.push({
        title: 'Component Traceability',
        text: 'Improve supply chain component traceability and security validation.',
        type: 'recommendation'
      });
      break;
      
    case 'Pharmaceutical & Biotech':
      if (regulations.includes('FDA Regulations')) {
        insights.push({
          title: 'FDA Regulatory Compliance',
          text: 'Drug and medical device compliance documentation should be centralized for audit readiness.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('EMA Regulations')) {
        insights.push({
          title: 'EMA Submission Standards',
          text: 'European Medicines Agency submission formatting should follow current standards.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('ISO 13485')) {
        insights.push({
          title: 'Quality Management System',
          text: 'ISO 13485 medical device quality management procedures require digital transformation.',
          type: 'recommendation'
        });
      }
      
      if (regulations.includes('GxP') || regulations.includes('FDA CFR Part 11')) {
        insights.push({
          title: 'Clinical Data Integrity',
          text: 'Audit trail analysis indicates potential gaps in 21 CFR Part 11 compliance for clinical systems.',
          type: 'warning'
        });
        
        insights.push({
          title: 'GxP Compliance',
          text: 'Implement enhanced data integrity controls for laboratory information management systems.',
          type: 'recommendation'
        });
      }
      
      insights.push({
        title: 'Research Data Protection',
        text: 'Strengthen access controls and encryption for sensitive research and development data.',
        type: 'recommendation'
      });
      break;
      
    default:
      // No industry-specific insights needed, use general ones
      break;
  }
  
  return insights;
};
