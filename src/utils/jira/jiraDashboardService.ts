
import { RiskDistribution } from './types';

/**
 * Get risk distribution for all compliance issues in demo mode
 */
const getRiskDistribution = (): RiskDistribution => {
  // Check if demo mode is enabled in localStorage
  const isDemoMode = localStorage.getItem('jira_demo_mode') === 'true';
  
  if (isDemoMode) {
    // Generate more dynamic demo risk distribution
    return {
      high: Math.floor(Math.random() * 20 + 10),   // 10-30
      medium: Math.floor(Math.random() * 30 + 20), // 20-50
      low: Math.floor(Math.random() * 20 + 15),    // 15-35
      total: 0
    };
  }
  
  // In non-demo mode, return existing logic
  return {
    high: 12,
    medium: 25,
    low: 18,
    total: 55
  };
};

/**
 * Generate a PDF report of compliance issues
 */
const generateComplianceReport = async (): Promise<string> => {
  try {
    // In a real implementation, this would generate a PDF report
    console.log('Generating compliance report...');
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate report generation
    
    return 'compliance-report.pdf';
  } catch (error) {
    console.error('Error generating compliance report:', error);
    throw new Error('Failed to generate compliance report');
  }
};

/**
 * Set up alerts for high risk issues
 */
const configureRiskAlerts = async (enabled: boolean): Promise<boolean> => {
  try {
    // In a real implementation, this would configure alert settings
    console.log(`${enabled ? 'Enabling' : 'Disabling'} risk alerts...`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    
    return true;
  } catch (error) {
    console.error('Error configuring risk alerts:', error);
    return false;
  }
};

export const jiraDashboardService = {
  getRiskDistribution,
  generateComplianceReport,
  configureRiskAlerts,
};

