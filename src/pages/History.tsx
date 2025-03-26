
import React, { useState } from 'react';
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

const History: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(mockScans[0]?.documentName || null);
  const [activeTab, setActiveTab] = useState<string>('reports');

  const handleDocumentSelect = (documentName: string) => {
    setSelectedDocument(documentName);
  };

  const getSelectedReport = () => {
    return mockScans.find(scan => scan.documentName === selectedDocument) || mockScans[0];
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Compliance History</h1>
      
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
                        <ul className="space-y-2">
                          {mockScans.map((scan) => (
                            <li 
                              key={scan.documentId}
                              className="cursor-pointer rounded p-2 hover:bg-slate-100"
                              onClick={() => handleDocumentSelect(scan.documentName)}
                            >
                              {scan.documentName}
                            </li>
                          ))}
                        </ul>
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
