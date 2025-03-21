
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScanViolation } from './types';

interface ScanResultsProps {
  violations: ScanViolation[];
}

const ScanResults: React.FC<ScanResultsProps> = ({ violations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Results</CardTitle>
        <CardDescription>
          Found {violations.length} potential compliance issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {violations.map((violation, index) => (
            <div key={index} className="flex items-start p-3 rounded-md bg-muted/50">
              {violation.severity === 'high' ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              ) : violation.severity === 'medium' ? (
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
              )}
              <div>
                <h4 className="font-medium">
                  {violation.title}
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${
                      violation.severity === 'high' 
                        ? 'border-red-200 bg-red-100 text-red-800' 
                        : violation.severity === 'medium'
                        ? 'border-amber-200 bg-amber-100 text-amber-800'
                        : 'border-blue-200 bg-blue-100 text-blue-800'
                    }`}
                  >
                    {violation.severity}
                  </Badge>
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {violation.service}
                  </Badge>
                  <span>{violation.location}</span>
                </div>
              </div>
            </div>
          ))}
          
          {violations.length === 0 && (
            <div className="flex items-center justify-center p-4 rounded-md bg-green-50 text-green-700">
              <Check className="h-5 w-5 mr-2" />
              <span>No compliance issues found</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanResults;
