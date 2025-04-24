
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { ZoomScanResult } from '@/utils/zoom/zoomServices';
import { format } from 'date-fns';

interface ScanResultsProps {
  scanResult: ZoomScanResult;
}

const ScanResults: React.FC<ScanResultsProps> = ({ scanResult }) => {
  return (
    <Card className={scanResult.violationsFound > 0 ? 'border-red-500' : 'border-green-500'}>
      <CardHeader className={scanResult.violationsFound > 0 ? 'bg-red-50' : 'bg-green-50'}>
        <CardTitle className="flex items-center">
          <ShieldAlert className={`h-5 w-5 mr-2 ${scanResult.violationsFound > 0 ? 'text-red-500' : 'text-green-500'}`} />
          Scan Results
        </CardTitle>
        <CardDescription>
          Scan completed on {format(new Date(scanResult.scanDate), 'PPP pp')}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-muted-foreground">Meetings Scanned</div>
            <div className="text-2xl font-bold">{scanResult.meetingsScanned}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-muted-foreground">Recordings</div>
            <div className="text-2xl font-bold">{scanResult.recordingsScanned}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-muted-foreground">Transcripts</div>
            <div className="text-2xl font-bold">{scanResult.transcriptsScanned}</div>
          </div>
          <div className={`${scanResult.violationsFound > 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded`}>
            <div className="text-sm text-muted-foreground">Violations</div>
            <div className={`text-2xl font-bold ${scanResult.violationsFound > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {scanResult.violationsFound}
            </div>
          </div>
        </div>
        
        {scanResult.violationsFound > 0 && (
          <div className="mt-4 space-y-4">
            <h3 className="font-medium">Compliance Issues Found</h3>
            <div className="space-y-2">
              {scanResult.reports.map((report, index) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-3">
                  <h4 className="font-medium">{report.summary?.substring(0, 120)}</h4>
                  <p className="text-sm text-gray-600">
                    {report.risks && report.risks.length > 0 
                      ? report.risks[0].description?.substring(0, 120)
                      : 'No detailed description available'}...
                  </p>
                  <div className="flex mt-2">
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {scanResult.violationsFound === 0 && (
          <div className="text-center py-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-green-500 mb-2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="text-lg font-medium text-green-700">No Compliance Issues Found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your Zoom meetings and recordings are compliant with your configured policies.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanResults;
