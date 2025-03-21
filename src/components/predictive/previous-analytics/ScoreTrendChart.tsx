
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageService';

interface ScoreTrendChartProps {
  trendData: {
    name: string;
    score: number;
    predictedScore: number;
  }[];
  language?: SupportedLanguage;
}

const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({ trendData, language = 'en' }) => {
  const getChartTitle = (): string => {
    switch (language) {
      case 'es': return 'Tendencias de Puntuación a lo Largo del Tiempo';
      case 'fr': return 'Tendances des Scores dans le Temps';
      case 'de': return 'Score-Trends im Zeitverlauf';
      case 'zh': return '随时间推移的评分趋势';
      default: return 'Score Trends Over Time';
    }
  };

  const getActualScoreLabel = (): string => {
    switch (language) {
      case 'es': return 'Puntuación Real';
      case 'fr': return 'Score Réel';
      case 'de': return 'Tatsächlicher Score';
      case 'zh': return '实际评分';
      default: return 'Actual Score';
    }
  };

  const getPredictedScoreLabel = (): string => {
    switch (language) {
      case 'es': return 'Puntuación Prevista';
      case 'fr': return 'Score Prédit';
      case 'de': return 'Vorhergesagter Score';
      case 'zh': return '预测评分';
      default: return 'Predicted Score';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
          {getChartTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                name={getActualScoreLabel()}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="predictedScore"
                name={getPredictedScoreLabel()}
                stroke="#82ca9d"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreTrendChart;
