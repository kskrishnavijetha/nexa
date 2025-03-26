
import React from 'react';
import { getScoreColor } from '@/utils/scoreService';

interface ScoreCardProps {
  score: number;
  label: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ score, label }) => {
  const colorClass = getScoreColor(score);
  
  return (
    <div className="rounded-lg border p-4 text-center">
      <div className={`text-2xl font-bold mb-1 ${colorClass}`}>
        {score}%
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
};

export default ScoreCard;
