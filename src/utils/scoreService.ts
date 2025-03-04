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
