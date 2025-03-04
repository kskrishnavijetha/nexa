/**
 * Generate random compliance scores
 */
export function generateScores() {
  // Generate random scores but keep them somewhat consistent
  const gdprScore = Math.floor(Math.random() * 40) + 60;
  const hipaaScore = Math.floor(Math.random() * 40) + 60;
  const soc2Score = Math.floor(Math.random() * 40) + 60;
  const pciDssScore = Math.floor(Math.random() * 40) + 60;
  
  // Calculate overall score as an average
  const overallScore = Math.floor((gdprScore + hipaaScore + soc2Score + pciDssScore) / 4);
  
  return {
    gdprScore,
    hipaaScore,
    soc2Score,
    pciDssScore,
    overallScore
  };
}
