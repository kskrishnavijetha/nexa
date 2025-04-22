
import { RiskDistribution } from './types';

/**
 * Get risk distribution for all compliance issues
 */
const getRiskDistribution = (): RiskDistribution => {
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
    console.log('Generating compliance report...');
    const reportUrl = await fetch('/api/compliance/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json());
    
    return reportUrl;
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
    const response = await fetch('/api/compliance/alerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ enabled })
    });
    
    return response.ok;
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

