
import { useState, useEffect, useCallback } from 'react';
import { assessContentRisk, generateSuggestions } from '@/utils/riskService';
import { Risk, Suggestion } from '@/utils/types';
import { toast } from 'sonner';

interface UseRealTimeComplianceProps {
  content: string;
  regulations: string[];
  isActive: boolean;
  interval?: number;
}

export function useRealTimeCompliance({
  content,
  regulations,
  isActive,
  interval = 3000
}: UseRealTimeComplianceProps) {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<Date | null>(null);

  const analyzeContent = useCallback(() => {
    if (!content.trim()) {
      setRisks([]);
      setSuggestions([]);
      return;
    }

    const detectedRisks = assessContentRisk(content, regulations);
    setRisks(detectedRisks);
    
    const generatedSuggestions = generateSuggestions(detectedRisks);
    setSuggestions(generatedSuggestions);
    setLastAnalyzedAt(new Date());
    
    // Show toast notification for high-severity risks
    const highSeverityRisks = detectedRisks.filter(r => r.severity === 'high');
    if (highSeverityRisks.length > 0) {
      toast.warning(`Detected ${highSeverityRisks.length} high-severity compliance issues`, {
        description: 'Check the real-time advisor for details',
        duration: 5000,
      });
    }
  }, [content, regulations]);
  
  // Set up interval for real-time monitoring
  useEffect(() => {
    if (!isActive) return;
    
    // Initial analysis
    analyzeContent();
    
    // Set up interval for continuous monitoring
    const intervalId = setInterval(() => {
      analyzeContent();
    }, interval);
    
    return () => clearInterval(intervalId);
  }, [isActive, analyzeContent, interval]);

  return {
    risks,
    suggestions,
    lastAnalyzedAt,
    analyzeContent
  };
}
