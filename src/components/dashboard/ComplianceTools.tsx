
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, FileText, Shield, Zap, 
  BookOpen, BarChart2, FileCheck, Clock 
} from 'lucide-react';

const ComplianceTools = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 text-primary mr-2" />
          Compliance Tools
        </CardTitle>
        <CardDescription>Quick access to compliance features and tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 px-4 justify-center text-left"
            onClick={() => navigate('/documents')}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span className="font-medium">Document Scanner</span>
            <span className="text-xs text-muted-foreground">Scan documents for compliance</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 px-4 justify-center text-left"
            onClick={() => navigate('/real-time-compliance')}
          >
            <Eye className="h-5 w-5 mb-1" />
            <span className="font-medium">Real-time Advisor</span>
            <span className="text-xs text-muted-foreground">Monitor content compliance in real-time</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 px-4 justify-center text-left"
            onClick={() => navigate('/history')}
          >
            <BarChart2 className="h-5 w-5 mb-1" />
            <span className="font-medium">Compliance Reports</span>
            <span className="text-xs text-muted-foreground">View historical compliance data</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col h-24 px-4 justify-center text-left"
            onClick={() => navigate('/integrations')}
          >
            <Zap className="h-5 w-5 mb-1" />
            <span className="font-medium">Integrations</span>
            <span className="text-xs text-muted-foreground">Connect to external services</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceTools;
