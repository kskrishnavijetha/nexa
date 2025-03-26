
import React from 'react';
import ScoreCard from './ScoreCard';

interface ComplianceScoreCardsProps {
  gdprScore: number;
  hipaaScore: number;
  soc2Score: number;
}

const ComplianceScoreCards: React.FC<ComplianceScoreCardsProps> = ({
  gdprScore,
  hipaaScore,
  soc2Score
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <ScoreCard score={gdprScore} label="GDPR" />
      <ScoreCard score={hipaaScore} label="HIPAA" />
      <ScoreCard score={soc2Score} label="SOC 2" />
    </div>
  );
};

export default ComplianceScoreCards;
