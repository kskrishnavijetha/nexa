
import { AIInsight } from '../../types';
import { Industry } from '@/utils/types';

/**
 * Generate fallback insights when no patterns are found in the audit data
 */
export const generateFallbackInsights = (): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  insights.push({
    text: "Not enough audit data to generate meaningful insights. Consider implementing more detailed tracking of compliance activities.",
    type: 'warning',
    priority: 'medium'
  });
  
  insights.push({
    text: "Continue tracking document activities with greater detail, including specific compliance checks performed and their outcomes to enable more comprehensive analysis in future reports.",
    type: 'recommendation',
    priority: 'medium'
  });
  
  return insights;
};
