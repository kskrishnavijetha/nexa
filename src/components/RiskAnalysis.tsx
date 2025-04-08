
import React, { useState } from 'react';
import { ComplianceRisk } from '@/utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, CheckCircle, Wrench, ArrowRight, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface RiskAnalysisProps {
  risks: ComplianceRisk[];
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ risks }) => {
  // State for dialogs
  const [activeMitigation, setActiveMitigation] = useState<ComplianceRisk | null>(null);
  const [activeRegulation, setActiveRegulation] = useState<string | null>(null);
  const [expertHelpRisk, setExpertHelpRisk] = useState<ComplianceRisk | null>(null);

  // Group risks by severity
  const highRisks = risks.filter(risk => risk.severity === 'high');
  const mediumRisks = risks.filter(risk => risk.severity === 'medium');
  const lowRisks = risks.filter(risk => risk.severity === 'low');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleMitigationAction = (risk: ComplianceRisk) => {
    setActiveMitigation(risk);
    toast.success(`Creating mitigation plan for: ${risk.title || risk.description.substring(0, 30)}...`);
  };
  
  const handleViewRegulation = (regulation: string) => {
    setActiveRegulation(regulation);
    toast.info(`Opening documentation for ${regulation}`);
  };

  const handleGetHelp = (risk: ComplianceRisk) => {
    setExpertHelpRisk(risk);
    toast.info(`Requesting expert assistance for ${risk.regulation} compliance`);
  };

  const renderRiskGroup = (risksGroup: ComplianceRisk[], title: string) => (
    <div className="mb-4">
      <h4 className="font-medium text-lg mb-2 flex items-center gap-2">
        {risksGroup.length > 0 && getSeverityIcon(risksGroup[0]?.severity || '')}
        {title} ({risksGroup.length})
      </h4>
      {risksGroup.length > 0 ? (
        <div className="space-y-3">
          {risksGroup.map((risk, index) => (
            <div 
              key={index} 
              className={`p-4 rounded border-l-4 ${
                risk.severity === 'high' ? 'border-red-500 bg-red-50' : 
                risk.severity === 'medium' ? 'border-amber-500 bg-amber-50' : 
                'border-green-500 bg-green-50'
              }`}
            >
              <div className="font-medium">{risk.description}</div>
              <p className="text-sm mt-1">
                <span className="font-medium">{risk.regulation}</span>
                {risk.section && ` - ${risk.section}`}
              </p>
              
              {/* Action Tools for Risk Mitigation */}
              <div className="flex flex-wrap gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs h-7"
                  onClick={() => handleMitigationAction(risk)}
                >
                  <Wrench className="h-3 w-3" />
                  Create Mitigation Plan
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs h-7"
                  onClick={() => handleViewRegulation(risk.regulation || '')}
                >
                  <FileText className="h-3 w-3" />
                  View Regulation
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs h-7"
                  onClick={() => handleGetHelp(risk)}
                >
                  <HelpCircle className="h-3 w-3" />
                  Get Expert Help
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No {title.toLowerCase()} issues found.</p>
      )}
    </div>
  );

  // Mitigation Plan Dialog
  const MitigationDialog = () => (
    <Dialog open={!!activeMitigation} onOpenChange={() => setActiveMitigation(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Mitigation Plan</DialogTitle>
          <DialogDescription>
            Create a mitigation plan for the identified compliance risk
          </DialogDescription>
        </DialogHeader>
        
        {activeMitigation && (
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Risk Description</h4>
              <p className="text-sm bg-slate-50 p-3 rounded-md border">
                {activeMitigation.description}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Regulation</h4>
              <p className="text-sm bg-slate-50 p-3 rounded-md border">
                {activeMitigation.regulation} {activeMitigation.section && `- ${activeMitigation.section}`}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Suggested Actions</h4>
              <ul className="text-sm bg-slate-50 p-3 rounded-md border space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Review and document affected processes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Update policies to address compliance gaps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Implement technical controls as needed
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Schedule follow-up audit to verify resolution
                </li>
              </ul>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setActiveMitigation(null)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast.success("Mitigation plan created successfully!");
            setActiveMitigation(null);
          }}>
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // View Regulation Dialog
  const RegulationDialog = () => (
    <Dialog open={!!activeRegulation} onOpenChange={() => setActiveRegulation(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Regulation Details</DialogTitle>
          <DialogDescription>
            Information about {activeRegulation}
          </DialogDescription>
        </DialogHeader>
        
        {activeRegulation && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-md border">
              <h4 className="font-medium">{activeRegulation} Overview</h4>
              <p className="mt-2 text-sm">
                This regulation requires organizations to maintain appropriate administrative, 
                technical, and physical safeguards to protect the security, confidentiality, 
                and integrity of sensitive information.
              </p>
              
              <h4 className="font-medium mt-4">Key Requirements</h4>
              <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
                <li>Risk assessment and management</li>
                <li>Access controls and authentication</li>
                <li>Encryption of sensitive data</li>
                <li>Audit controls and logging</li>
                <li>Data integrity and validation</li>
                <li>Incident reporting and response</li>
              </ul>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => setActiveRegulation(null)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Expert Help Dialog
  const ExpertHelpDialog = () => (
    <Dialog open={!!expertHelpRisk} onOpenChange={() => setExpertHelpRisk(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request Expert Help</DialogTitle>
          <DialogDescription>
            Get specialized compliance assistance
          </DialogDescription>
        </DialogHeader>
        
        {expertHelpRisk && (
          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Risk Area</h4>
              <p className="text-sm bg-slate-50 p-3 rounded-md border">
                {expertHelpRisk.regulation} compliance issue
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Available Experts</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-md border bg-white hover:bg-slate-50 cursor-pointer">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-full">
                    <span className="font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">Jane Doe - {expertHelpRisk.regulation} Specialist</p>
                    <p className="text-sm text-slate-500">Available in 2 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border bg-white hover:bg-slate-50 cursor-pointer">
                  <div className="bg-green-100 text-green-800 p-2 rounded-full">
                    <span className="font-medium">MS</span>
                  </div>
                  <div>
                    <p className="font-medium">Michael Smith - Compliance Advisor</p>
                    <p className="text-sm text-slate-500">Available today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setExpertHelpRisk(null)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast.success("Expert help request submitted successfully!");
            setExpertHelpRisk(null);
          }}>
            Request Help
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        {renderRiskGroup(highRisks, 'High Severity')}
        {renderRiskGroup(mediumRisks, 'Medium Severity')}
        {renderRiskGroup(lowRisks, 'Low Severity')}
      </CardContent>

      {/* Render Dialogs */}
      <MitigationDialog />
      <RegulationDialog />
      <ExpertHelpDialog />
    </Card>
  );
};

export default RiskAnalysis;
