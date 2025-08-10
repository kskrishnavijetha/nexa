
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Heart, 
  Users, 
  Download, 
  CheckCircle, 
  FileText,
  Shield,
  Banknote
} from 'lucide-react';

interface ComplianceTemplate {
  id: string;
  name: string;
  industry: string;
  frameworks: string[];
  requirements: number;
  description: string;
  lastUpdated: string;
}

const IndustryTemplates: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('financial');

  const templates: ComplianceTemplate[] = [
    {
      id: 'financial-sox',
      name: 'SOX Compliance Checklist',
      industry: 'financial',
      frameworks: ['SOX', 'Basel III', 'COSO'],
      requirements: 45,
      description: 'Comprehensive Sarbanes-Oxley compliance checklist for financial institutions',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'financial-basel',
      name: 'Basel III Risk Management',
      industry: 'financial',
      frameworks: ['Basel III', 'BCBS'],
      requirements: 32,
      description: 'Risk management framework compliance for banking operations',
      lastUpdated: '2024-01-10'
    },
    {
      id: 'healthcare-hipaa',
      name: 'HIPAA Privacy & Security',
      industry: 'healthcare',
      frameworks: ['HIPAA', 'HITECH'],
      requirements: 38,
      description: 'Complete HIPAA compliance template for healthcare organizations',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'healthcare-hitech',
      name: 'HITECH Act Compliance',
      industry: 'healthcare',
      frameworks: ['HITECH', 'HIPAA'],
      requirements: 28,
      description: 'HITECH Act breach notification and security requirements',
      lastUpdated: '2024-01-08'
    },
    {
      id: 'hr-gdpr',
      name: 'GDPR Employee Data Protection',
      industry: 'hr',
      frameworks: ['GDPR', 'CCPA'],
      requirements: 41,
      description: 'Data protection compliance for HR and payroll systems',
      lastUpdated: '2024-01-20'
    },
    {
      id: 'hr-labor',
      name: 'Labor Law Compliance',
      industry: 'hr',
      frameworks: ['FLSA', 'FMLA', 'ADA'],
      requirements: 35,
      description: 'Comprehensive labor law compliance for HR departments',
      lastUpdated: '2024-01-18'
    }
  ];

  const industries = [
    { 
      id: 'financial', 
      name: 'Financial Services', 
      icon: Banknote, 
      description: 'SOX, Basel III, and financial regulations' 
    },
    { 
      id: 'healthcare', 
      name: 'Healthcare', 
      icon: Heart, 
      description: 'HIPAA, HITECH, and health data protection' 
    },
    { 
      id: 'hr', 
      name: 'HR & Payroll', 
      icon: Users, 
      description: 'GDPR, labor laws, and employee data' 
    }
  ];

  const filteredTemplates = templates.filter(template => template.industry === selectedIndustry);
  const selectedIndustryInfo = industries.find(ind => ind.id === selectedIndustry);

  const handleDownloadTemplate = (templateId: string) => {
    // In a real implementation, this would download the actual template
    console.log(`Downloading template: ${templateId}`);
    // Simulate download
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const content = `# ${template.name}\n\nIndustry: ${template.industry}\nFrameworks: ${template.frameworks.join(', ')}\nRequirements: ${template.requirements}\n\nDescription: ${template.description}`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Industry Compliance Templates</h2>
        <p className="text-muted-foreground">
          Pre-built compliance checklists and templates tailored for your industry
        </p>
      </div>

      {/* Industry Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {industries.map((industry) => {
          const Icon = industry.icon;
          return (
            <Card 
              key={industry.id} 
              className={`cursor-pointer transition-colors ${
                selectedIndustry === industry.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedIndustry(industry.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedIndustry === industry.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{industry.name}</h3>
                    <p className="text-xs text-muted-foreground">{industry.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Templates for Selected Industry */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {selectedIndustryInfo && <selectedIndustryInfo.icon className="h-5 w-5" />}
            <CardTitle>{selectedIndustryInfo?.name} Templates</CardTitle>
          </div>
          <CardDescription>
            Available compliance templates for {selectedIndustryInfo?.name.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.requirements} items
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.frameworks.map((framework) => (
                        <Badge key={framework} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        Updated {new Date(template.lastUpdated).toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownloadTemplate(template.id)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Templates Available</h3>
              <p className="text-muted-foreground">
                Templates for this industry are coming soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Template Request */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Custom Template Request
          </CardTitle>
          <CardDescription>
            Need a template for specific requirements? Request a custom compliance template.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900">Custom Template Service</h4>
              <p className="text-sm text-blue-700">
                Our compliance experts can create tailored templates for your specific needs
              </p>
            </div>
            <Button variant="outline">
              Request Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndustryTemplates;
