
/**
 * Generate random compliance scores
 */
export function generateScores(regulations: string[] = []) {
  // Generate random scores but keep them somewhat consistent
  const gdprScore = Math.floor(Math.random() * 40) + 60;
  const hipaaScore = Math.floor(Math.random() * 40) + 60;
  const soc2Score = Math.floor(Math.random() * 40) + 60;
  const pciDssScore = Math.floor(Math.random() * 40) + 60;
  
  // Generate industry-specific scores
  const industryScores: Record<string, number> = {};
  
  regulations.forEach(regulation => {
    industryScores[regulation] = Math.floor(Math.random() * 40) + 60;
  });
  
  // Calculate overall score as an average of all scores
  const allScores = [gdprScore, hipaaScore, soc2Score, pciDssScore, ...Object.values(industryScores)];
  const overallScore = Math.floor(allScores.reduce((sum, score) => sum + score, 0) / allScores.length);
  
  return {
    gdprScore,
    hipaaScore,
    soc2Score,
    pciDssScore,
    industryScores,
    overallScore
  };
}

/**
 * Calculate score difference percentage
 */
export function calculateScoreDifference(originalScore: number, newScore: number): number {
  return newScore - originalScore;
}

/**
 * Get a descriptive label for a score
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Satisfactory';
  if (score >= 60) return 'Needs Improvement';
  return 'Critical';
}

/**
 * Get color for a score value
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 80) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Get color for a score difference
 */
export function getScoreDifferenceColor(difference: number): string {
  if (difference > 0) return 'text-green-600';
  if (difference < 0) return 'text-red-600';
  return 'text-gray-600';
}
