
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Globe, Stethoscope, Shield, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  category: 'global' | 'regional' | 'healthcare' | 'security' | 'financial';
  region?: string;
  focus?: string;
  useCase?: string;
  area?: string;
  purpose?: string;
}

export interface ComplianceFrameworkSelectorProps {
  selectedFrameworks: string[];
  onFrameworksChange: (frameworks: string[]) => void;
  disabled?: boolean;
}

// Define all available frameworks
const COMPLIANCE_FRAMEWORKS: ComplianceFramework[] = [
  // Global frameworks
  { id: 'GDPR', name: 'GDPR', description: 'General Data Protection Regulation', category: 'global', focus: 'Data privacy', region: 'EU, Global SaaS' },
  { id: 'HIPAA', name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', category: 'global', focus: 'Healthcare data', region: 'USA' },
  { id: 'SOC2', name: 'SOC 2', description: 'System and Organization Controls Type 2', category: 'global', focus: 'Security, availability, confidentiality', region: 'SaaS, Cloud' },
  { id: 'ISO27001', name: 'ISO 27001', description: 'International Standards for Information Security Management', category: 'global', focus: 'InfoSec management', region: 'Global Enterprise' },
  { id: 'PCIDSS', name: 'PCI-DSS', description: 'Payment Card Industry Data Security Standard', category: 'global', focus: 'Credit card handling', region: 'Fintech, eCommerce' },
  { id: 'GLBA', name: 'GLBA', description: 'Gramm-Leach-Bliley Act', category: 'global', focus: 'Financial data privacy', region: 'U.S. Banks & Lending' },
  { id: 'CCPA', name: 'CCPA / CPRA', description: 'California Consumer Privacy Act / Rights Act', category: 'global', focus: 'Consumer data rights', region: 'California, USA' },
  { id: 'NIST800-53', name: 'NIST 800-53', description: 'National Institute of Standards and Technology', category: 'global', focus: 'Federal security controls', region: 'U.S. Govt, Defense' },
  { id: 'SOX', name: 'SOX', description: 'Sarbanes-Oxley Act', category: 'global', focus: 'Financial reporting integrity', region: 'Public companies (U.S.)' },
  { id: 'FISMA', name: 'FISMA', description: 'Federal Information Security Management Act', category: 'global', focus: 'IT security controls', region: 'U.S. Government agencies' },
  { id: 'FedRAMP', name: 'FedRAMP', description: 'Federal Risk and Authorization Mgmt Program', category: 'global', focus: 'Cloud services to U.S. government', region: 'US federal contractors' },
  
  // Regional frameworks
  { id: 'LGPD', name: 'LGPD', description: 'Lei Geral de Proteção de Dados', category: 'regional', focus: 'GDPR-style privacy law', region: 'Brazil' },
  { id: 'PIPEDA', name: 'PIPEDA', description: 'Personal Information Protection and Electronic Documents Act', category: 'regional', focus: 'Data privacy', region: 'Canada' },
  { id: 'PDPA', name: 'PDPA', description: 'Personal Data Protection Act', category: 'regional', focus: 'Data protection', region: 'Singapore, Thailand, Malaysia' },
  { id: 'UK-GDPR', name: 'UK-GDPR', description: 'UK General Data Protection Regulation', category: 'regional', focus: 'Post-Brexit version of GDPR', region: 'United Kingdom' },
  { id: 'ePrivacy', name: 'ePrivacy Directive', description: 'EU ePrivacy Directive', category: 'regional', focus: 'Email & cookie tracking consent', region: 'EU' },
  { id: 'APRA-CPS-234', name: 'APRA CPS 234', description: 'Australian Prudential Regulation Authority', category: 'regional', focus: 'Info security for finance', region: 'Australia' },
  
  // Healthcare frameworks
  { id: 'HITECH', name: 'HITECH Act', description: 'Health Information Technology for Economic and Clinical Health Act', category: 'healthcare', area: 'U.S.', purpose: 'Promotes use of electronic health records' },
  { id: 'GDPR-Health', name: 'GDPR (Health Records)', description: 'GDPR Special Category Data', category: 'healthcare', area: 'EU', purpose: 'Special category for health data' },
  { id: 'ISO27799', name: 'ISO 27799', description: 'ISO Health Data Security', category: 'healthcare', area: 'Global', purpose: 'Health data security controls' },
  { id: 'NHS-DSP', name: 'NHS DSP Toolkit', description: 'NHS Data Security and Protection Toolkit', category: 'healthcare', area: 'UK', purpose: 'NHS compliance assessments' },
  
  // Security frameworks
  { id: 'ISO27017', name: 'ISO 27017', description: 'ISO Cloud Security', category: 'security', focus: 'Cloud security' },
  { id: 'ISO27018', name: 'ISO 27018', description: 'ISO Cloud Privacy', category: 'security', focus: 'Personal data protection in cloud' },
  { id: 'CIS', name: 'CIS Controls', description: 'Center for Internet Security Controls', category: 'security', focus: 'Cybersecurity best practices' },
  { id: 'NIST-CSF', name: 'NIST CSF', description: 'NIST Cybersecurity Framework', category: 'security', focus: 'Cyber threat management' },
  { id: 'CSA-CCM', name: 'CSA CCM', description: 'Cloud Security Alliance - Cloud Controls Matrix', category: 'security', focus: 'Cloud Security Alliance – Cloud Controls Matrix' },
  
  // Financial frameworks
  { id: 'FINRA', name: 'FINRA', description: 'Financial Industry Regulatory Authority', category: 'financial', useCase: 'Financial industry self-regulation' },
  { id: 'MAS-TRM', name: 'MAS TRM Guidelines', description: 'Monetary Authority of Singapore', category: 'financial', useCase: 'Singapore banking sector' },
  { id: 'EMIR-MiFID', name: 'EMIR/MiFID II', description: 'European Market Infrastructure Regulation', category: 'financial', useCase: 'European investment compliance' },
];

export const ComplianceFrameworkSelector: React.FC<ComplianceFrameworkSelectorProps> = ({
  selectedFrameworks,
  onFrameworksChange,
  disabled = false,
}) => {
  const handleFrameworkToggle = (frameworkId: string, checked: boolean) => {
    if (checked) {
      onFrameworksChange([...selectedFrameworks, frameworkId]);
    } else {
      onFrameworksChange(selectedFrameworks.filter(id => id !== frameworkId));
    }
  };

  const renderFrameworkList = (category: ComplianceFramework['category']) => {
    const frameworks = COMPLIANCE_FRAMEWORKS.filter(fw => fw.category === category);
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {frameworks.map(framework => (
          <div key={framework.id} className="flex items-start space-x-3 p-3 border rounded-md bg-white hover:bg-slate-50 transition-colors">
            <Checkbox 
              id={`fw-${framework.id}`}
              checked={selectedFrameworks.includes(framework.id)}
              onCheckedChange={(checked) => handleFrameworkToggle(framework.id, checked === true)}
              disabled={disabled}
            />
            <div className="space-y-1">
              <div className="flex items-center">
                <Label 
                  htmlFor={`fw-${framework.id}`}
                  className="font-medium text-sm cursor-pointer"
                >
                  {framework.name}
                </Label>
                {framework.region && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    {framework.region}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{framework.description}</p>
              <p className="text-xs">
                {framework.focus || framework.useCase || framework.purpose || ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <ClipboardList className="h-5 w-5 mr-2" />
          Compliance Frameworks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Select one or more compliance frameworks to audit against. Multi-framework reports will show compliance status across all selected standards.
        </p>
        
        {selectedFrameworks.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedFrameworks.map(id => {
              const framework = COMPLIANCE_FRAMEWORKS.find(fw => fw.id === id);
              return framework ? (
                <Badge key={id} variant="secondary" className="flex items-center gap-1">
                  {framework.name}
                </Badge>
              ) : null;
            })}
          </div>
        )}
        
        <Tabs defaultValue="global">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="global" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Global</span>
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Regional</span>
            </TabsTrigger>
            <TabsTrigger value="healthcare" className="flex items-center gap-1">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Healthcare</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Financial</span>
            </TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[320px] pr-4">
            <TabsContent value="global" className="mt-0">
              {renderFrameworkList('global')}
            </TabsContent>
            
            <TabsContent value="regional" className="mt-0">
              {renderFrameworkList('regional')}
            </TabsContent>
            
            <TabsContent value="healthcare" className="mt-0">
              {renderFrameworkList('healthcare')}
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              {renderFrameworkList('security')}
            </TabsContent>
            
            <TabsContent value="financial" className="mt-0">
              {renderFrameworkList('financial')}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ComplianceFrameworkSelector;
