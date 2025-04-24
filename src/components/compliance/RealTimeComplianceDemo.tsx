
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRealTimeCompliance } from '@/hooks/useRealTimeCompliance';
import RealTimeComplianceAdvisor from './RealTimeComplianceAdvisor';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const RealTimeComplianceDemo: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [newRegulation, setNewRegulation] = useState<string>('');
  const [regulations, setRegulations] = useState<string[]>(['GDPR', 'HIPAA']);
  const [isMonitoringActive, setIsMonitoringActive] = useState<boolean>(true);

  const { risks, suggestions, lastAnalyzedAt, analyzeContent } = useRealTimeCompliance({
    content,
    regulations,
    isActive: isMonitoringActive,
    interval: 5000 // Check every 5 seconds
  });

  const addRegulation = () => {
    if (newRegulation && !regulations.includes(newRegulation)) {
      setRegulations([...regulations, newRegulation]);
      setNewRegulation('');
    }
  };

  const removeRegulation = (regulation: string) => {
    setRegulations(regulations.filter(r => r !== regulation));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <Label htmlFor="content">Enter content to analyze for compliance:</Label>
            <Textarea
              id="content"
              className="min-h-[200px] mt-2"
              placeholder="Enter your content here to check for compliance issues in real-time..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="mt-4">
              <Label>Applicable regulations:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {regulations.map(regulation => (
                  <Badge key={regulation} variant="secondary" className="flex gap-1 items-center">
                    {regulation}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeRegulation(regulation)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Add regulation (e.g., PCI-DSS)"
                  value={newRegulation}
                  onChange={(e) => setNewRegulation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRegulation()}
                />
              </div>
              <Button onClick={addRegulation}>Add</Button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-6">
              <p>Try including sensitive content like:</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Credit card numbers or CVV codes (PCI-DSS violation)</li>
                <li>Patient medical information (HIPAA violation)</li>
                <li>Personal identifiers like SSN (GDPR violation)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <RealTimeComplianceAdvisor
          isActive={isMonitoringActive}
          onToggleActive={setIsMonitoringActive}
          risks={risks}
          suggestions={suggestions}
          lastAnalyzedAt={lastAnalyzedAt}
          onAnalyzeNow={analyzeContent}
        />
      </div>
    </div>
  );
};

export default RealTimeComplianceDemo;
