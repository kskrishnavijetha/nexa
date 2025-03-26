
import React, { useState, useEffect } from 'react';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComplianceReport } from '@/utils/types';
import AuditTrail from '@/components/audit/AuditTrail';
import RiskAnalysis from '@/components/RiskAnalysis';
import { mockScans } from '@/utils/historyMocks';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const History: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(mockScans[0]?.documentName || null);
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [reports, setReports] = useState<ComplianceReport[]>(mockScans);
  const [realTimeEnabled, setRealTimeEnabled] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [analyzingDocument, setAnalyzingDocument] = useState<string | null>(null);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeEnabled) return;
    
    const interval = setInterval(() => {
      // Update last updated timestamp
      setLastUpdated(new Date());
      
      // 20% chance to update an existing report or start analyzing a new document
      if (Math.random() < 0.2) {
        // 70% chance to update an existing report, 30% chance to start analyzing a new document
        if (Math.random() < 0.7 && reports.length > 0) {
          // Update an existing report score
          const reportIndex = Math.floor(Math.random() * reports.length);
          const updatedReports = [...reports];
          const scoreChange = Math.floor(Math.random() * 10) - 3; // Between -3 and +6
          const report = {...updatedReports[reportIndex]};
          
          report.overallScore = Math.min(100, Math.max(0, report.overallScore + scoreChange));
          report.gdprScore = Math.min(100, Math.max(0, report.gdprScore + Math.floor(Math.random() * 8) - 3));
          report.hipaaScore = Math.min(100, Math.max(0, report.hipaaScore + Math.floor(Math.random() * 8) - 3));
          report.soc2Score = Math.min(100, Math.max(0, report.soc2Score + Math.floor(Math.random() * 8) - 3));
          
          updatedReports[reportIndex] = report;
          setReports(updatedReports);
          toast.info(`Compliance scores updated for "${report.documentName}"`);
        } else {
          // Simulate analyzing a new document
          const documentNames = [
            "Terms of Service",
            "Cookie Policy",
            "Employee Handbook",
            "GDPR Compliance Statement",
            "Data Processing Agreement",
            "Information Security Policy"
          ];
          
          // Get a random document that's not already in reports
          const existingNames = reports.map(r => r.documentName);
          const availableNames = documentNames.filter(name => !existingNames.includes(name));
          
          if (availableNames.length > 0) {
            const newDocName = availableNames[Math.floor(Math.random() * availableNames.length)];
            setAnalyzingDocument(newDocName);
            
            // After 5-10 seconds, add the document to reports
            const analysisTime = 5000 + Math.random() * 5000;
            setTimeout(() => {
              const newReport: ComplianceReport = {
                id: `doc-${Date.now()}`,
                documentId: `doc-${Date.now()}`,
                documentName: newDocName,
                timestamp: new Date().toISOString(),
                overallScore: 60 + Math.floor(Math.random() * 40),
                gdprScore: 60 + Math.floor(Math.random() * 40),
                hipaaScore: 60 + Math.floor(Math.random() * 40),
                soc2Score: 60 + Math.floor(Math.random() * 40),
                risks: [
                  { 
                    id: `risk-${Date.now()}-1`, 
                    description: 'Automatically detected compliance issue', 
                    severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low', 
                    regulation: Math.random() > 0.6 ? 'GDPR' : Math.random() > 0.3 ? 'HIPAA' : 'SOC 2' 
                  },
                ],
                summary: 'Automatically generated compliance report with detected issues',
              };
              
              setReports(prev => [newReport, ...prev]);
              setAnalyzingDocument(null);
              toast.success(`New compliance report added: "${newReport.documentName}"`);
            }, analysisTime);
          }
        }
      }
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [realTimeEnabled, reports]);

  const handleDocumentSelect = (documentName: string) => {
    setSelectedDocument(documentName);
  };

  const toggleRealTime = () => {
    setRealTimeEnabled(!realTimeEnabled);
    toast.info(realTimeEnabled ? 'Real-time updates disabled' : 'Real-time updates enabled');
  };

  const getSelectedReport = () => {
    return reports.find(scan => scan.documentName === selectedDocument) || reports[0];
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Compliance History</h1>
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={toggleRealTime}
          title={realTimeEnabled ? "Disable real-time updates" : "Enable real-time updates"}
        >
          <Badge 
            variant={realTimeEnabled ? "default" : "outline"}
            className={realTimeEnabled ? "bg-green-500" : ""}
          >
            {realTimeEnabled ? "Real-time" : "Static"}
          </Badge>
          <Clock className={`h-4 w-4 ${realTimeEnabled ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
          <span className="text-sm text-muted-foreground">
            {realTimeEnabled ? `Updated: ${lastUpdated.toLocaleTimeString()}` : "Updates paused"}
          </span>
        </div>
      </div>
      
      <Tabs 
        defaultValue="reports" 
        className="mb-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Document Reports</h2>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      {selectedDocument || 'Select Document'}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-[300px]">
                        <div className="font-medium mb-2">Documents</div>
                        <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                          {reports.map((scan) => (
                            <li 
                              key={scan.documentId}
                              className="cursor-pointer rounded p-2 hover:bg-slate-100"
                              onClick={() => handleDocumentSelect(scan.documentName)}
                            >
                              <div className="flex items-center justify-between">
                                <span>{scan.documentName}</span>
                                {scan.documentName === selectedDocument && (
                                  <Badge variant="outline" className="ml-2">Selected</Badge>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                        
                        {analyzingDocument && (
                          <div className="mt-4 p-2 border border-blue-200 rounded bg-blue-50">
                            <div className="flex items-center text-sm text-blue-600">
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              <FileText className="h-3 w-3 mr-2" />
                              <span>Analyzing: {analyzingDocument}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            {selectedDocument && (
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>{getSelectedReport().documentName}</span>
                      <span className={
                        getSelectedReport().overallScore >= 80 ? 'text-green-500' : 
                        getSelectedReport().overallScore >= 70 ? 'text-amber-500' : 
                        'text-red-500'
                      }>
                        {getSelectedReport().overallScore}%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{getSelectedReport().summary}</p>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="rounded-lg border p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          getSelectedReport().gdprScore >= 80 ? 'text-green-500' : 
                          getSelectedReport().gdprScore >= 70 ? 'text-amber-500' : 
                          'text-red-500'
                        }`}>
                          {getSelectedReport().gdprScore}%
                        </div>
                        <p className="text-sm">GDPR</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          getSelectedReport().hipaaScore >= 80 ? 'text-green-500' : 
                          getSelectedReport().hipaaScore >= 70 ? 'text-amber-500' : 
                          'text-red-500'
                        }`}>
                          {getSelectedReport().hipaaScore}%
                        </div>
                        <p className="text-sm">HIPAA</p>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <div className={`text-2xl font-bold mb-1 ${
                          getSelectedReport().soc2Score >= 80 ? 'text-green-500' : 
                          getSelectedReport().soc2Score >= 70 ? 'text-amber-500' : 
                          'text-red-500'
                        }`}>
                          {getSelectedReport().soc2Score}%
                        </div>
                        <p className="text-sm">SOC 2</p>
                      </div>
                    </div>
                    <RiskAnalysis risks={getSelectedReport().risks} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          {selectedDocument && (
            <AuditTrail documentName={selectedDocument} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
