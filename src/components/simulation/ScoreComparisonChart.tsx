
import React from 'react';
import { PredictiveAnalysis } from '@/utils/types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
  Label,
} from 'recharts';
import { Brain } from 'lucide-react';

interface ScoreComparisonChartProps {
  analysis: PredictiveAnalysis;
}

const ScoreComparisonChart: React.FC<ScoreComparisonChartProps> = ({ analysis }) => {
  // Create chart data from all available regulations
  const generateChartData = () => {
    const data = [
      {
        name: 'Overall',
        original: analysis.originalScores?.overall || 0,
        predicted: analysis.predictedScores?.overall || 0,
        difference: analysis.scoreDifferences?.overall || 0,
      }
    ];
    
    // Add all major regulatory frameworks that have data
    if (analysis.originalScores?.gdpr > 0 || analysis.predictedScores?.gdpr > 0) {
      data.push({
        name: 'GDPR',
        original: analysis.originalScores?.gdpr || 0,
        predicted: analysis.predictedScores?.gdpr || 0,
        difference: analysis.scoreDifferences?.gdpr || 0,
      });
    }
    
    if (analysis.originalScores?.hipaa > 0 || analysis.predictedScores?.hipaa > 0) {
      data.push({
        name: 'HIPAA',
        original: analysis.originalScores?.hipaa || 0,
        predicted: analysis.predictedScores?.hipaa || 0,
        difference: analysis.scoreDifferences?.hipaa || 0,
      });
    }
    
    if (analysis.originalScores?.soc2 > 0 || analysis.predictedScores?.soc2 > 0) {
      data.push({
        name: 'SOC 2',
        original: analysis.originalScores?.soc2 || 0,
        predicted: analysis.predictedScores?.soc2 || 0,
        difference: analysis.scoreDifferences?.soc2 || 0,
      });
    }
    
    if (analysis.originalScores?.pciDss > 0 || analysis.predictedScores?.pciDss > 0) {
      data.push({
        name: 'PCI DSS',
        original: analysis.originalScores?.pciDss || 0,
        predicted: analysis.predictedScores?.pciDss || 0,
        difference: analysis.scoreDifferences?.pciDss || 0,
      });
    }
    
    // Add industry-specific regulations if they exist in the analysis data
    const specificRegulations = [
      'sox', 'glba', 'hitech', 'fedramp', 'ccpa', 'ferpa', 'coppa', 'fisma', 
      'nerc', 'itar', 'cmmc', 'iso27001', 'iso9001', 'iso13485', 'fcc', 'cpra',
      'ferc', 'iso14001', 'ftc', 'fda', 'ema', 'ctpat', 'rohs', 'iso26262', 'ts16949'
    ];
    
    specificRegulations.forEach(reg => {
      if (
        analysis.originalScores && 
        analysis.predictedScores && 
        (analysis.originalScores[reg as keyof typeof analysis.originalScores] > 0 || 
         analysis.predictedScores[reg as keyof typeof analysis.predictedScores] > 0)
      ) {
        const original = analysis.originalScores[reg as keyof typeof analysis.originalScores] as number || 0;
        const predicted = analysis.predictedScores[reg as keyof typeof analysis.predictedScores] as number || 0;
        const difference = predicted - original;
        
        const displayName = getRegulationDisplayName(reg);
        
        data.push({
          name: displayName,
          original: original,
          predicted: predicted,
          difference: difference,
        });
      }
    });
    
    return data;
  };

  // Helper function to convert regulation codes to proper display names
  const getRegulationDisplayName = (code: string): string => {
    const displayNames: Record<string, string> = {
      'gdpr': 'GDPR',
      'hipaa': 'HIPAA',
      'soc2': 'SOC 2',
      'pciDss': 'PCI DSS',
      'sox': 'SOX',
      'glba': 'GLBA',
      'hitech': 'HITECH',
      'fedramp': 'FedRAMP',
      'ccpa': 'CCPA',
      'ferpa': 'FERPA',
      'coppa': 'COPPA',
      'fisma': 'FISMA',
      'nerc': 'NERC CIP',
      'itar': 'ITAR',
      'cmmc': 'CMMC',
      'iso27001': 'ISO 27001',
      'iso9001': 'ISO 9001',
      'iso13485': 'ISO 13485',
      'fcc': 'FCC Regulations',
      'cpra': 'CPRA',
      'ferc': 'FERC',
      'iso14001': 'ISO 14001',
      'ftc': 'FTC Act',
      'fda': 'FDA Regulations',
      'ema': 'EMA Regulations',
      'ctpat': 'C-TPAT',
      'rohs': 'RoHS',
      'iso26262': 'ISO 26262',
      'ts16949': 'TS 16949'
    };
    
    return displayNames[code] || code.toUpperCase();
  };

  const chartData = generateChartData();

  // Find the threshold for compliance
  const complianceThreshold = 75; // Typical compliance threshold

  return (
    <div className="h-72">
      <div className="flex items-center text-xs text-muted-foreground mb-2">
        <Brain className="h-4 w-4 mr-1 text-blue-500" />
        <span>AI-powered score prediction and comparison</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'original') return [`${value}`, 'Current Score'];
              if (name === 'predicted') return [`${value}`, 'AI-Predicted Score'];
              return [`${value > 0 ? '+' : ''}${value}`, 'Difference'];
            }}
            labelFormatter={(label) => `${label} Compliance Score`}
          />
          <Legend formatter={(value) => {
            if (value === 'original') return 'Current';
            if (value === 'predicted') return 'AI-Predicted';
            return 'Difference';
          }} />
          <ReferenceLine y={complianceThreshold} stroke="#ff6b6b" strokeDasharray="3 3">
            <Label value="Compliance Threshold" position="right" fill="#ff6b6b" />
          </ReferenceLine>
          <Bar dataKey="original" name="original" fill="#94a3b8" barSize={20} />
          <Bar dataKey="predicted" name="predicted" fill="#2563eb" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreComparisonChart;
