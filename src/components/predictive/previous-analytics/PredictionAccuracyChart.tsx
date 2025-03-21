
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AccuracyItem {
  regulation: string;
  predictedScore: number;
  actualScore: number;
  accuracy: number;
}

interface PredictionAccuracyChartProps {
  accuracyItems: AccuracyItem[];
}

const PredictionAccuracyChart: React.FC<PredictionAccuracyChartProps> = ({ accuracyItems }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Prediction Accuracy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={accuracyItems}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="regulation" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" name="Prediction Accuracy %" fill="#8884d8">
                {accuracyItems.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.accuracy > 80 ? '#4ade80' : entry.accuracy > 60 ? '#facc15' : '#ef4444'} 
                  />
                ))}
              </Bar>
              <ReferenceLine y={80} stroke="#4ade80" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionAccuracyChart;
