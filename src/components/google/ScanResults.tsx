
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScanViolation } from './types';
import { Industry } from '@/utils/types';
import { ViolationItem, NoViolationsFound, ReportActions, FileInfoDisplay } from './scan-results';

interface ScanResultsProps {
  violations: ScanViolation[];
  industry?: Industry;
  isCompactView?: boolean;
  fileName?: string;
  serviceName?: string;
}

const ScanResults: React.FC<ScanResultsProps> = ({ 
  violations, 
  industry, 
  isCompactView,
  fileName,
  serviceName 
}) => {
  // Get unique services from violations
  const uniqueServices = [...new Set(violations.map(v => v.service))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Results</CardTitle>
        <CardDescription>
          Found {violations.length} potential compliance issues
          {industry && <span className="ml-1">in {industry} industry</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fileName && (
          <FileInfoDisplay fileName={fileName} serviceName={serviceName} />
        )}
        
        <div className="space-y-4">
          {violations.map((violation, index) => (
            <ViolationItem key={index} violation={violation} />
          ))}
          
          {violations.length === 0 && <NoViolationsFound />}
        </div>
      </CardContent>
      {violations.length > 0 && (
        <CardFooter className="flex flex-col space-y-3 items-stretch sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-2">
          <ReportActions 
            violations={violations} 
            industry={industry} 
            services={uniqueServices} 
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default ScanResults;
