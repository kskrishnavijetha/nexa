
import React from 'react';

interface ScoreProps {
  score: number;
  label: string;
}

const ScoreCard: React.FC<ScoreProps> = ({ score, label }) => {
  return (
    <div className="rounded-lg border p-4 text-center">
      <div className={`text-2xl font-bold mb-1 ${
        score >= 80 ? 'text-green-500' : 
        score >= 70 ? 'text-amber-500' : 
        'text-red-500'
      }`}>
        {score}%
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
};

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
