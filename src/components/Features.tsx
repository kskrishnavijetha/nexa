
import React from 'react';
import { 
  Shield, 
  BarChart, 
  FileText, 
  Zap, 
  Clock, 
  Download
} from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: 'Comprehensive Compliance Checks',
    description: 'Analyze your documents against GDPR, HIPAA, SOC 2, and other regulatory frameworks with pinpoint accuracy.'
  },
  {
    icon: <BarChart className="w-10 h-10 text-primary" />,
    title: 'Detailed Risk Assessment',
    description: 'Get a complete breakdown of compliance risks categorized by severity, with clear explanations and references.'
  },
  {
    icon: <FileText className="w-10 h-10 text-primary" />,
    title: 'Custom Report Generation',
    description: 'Export professional compliance reports in PDF format with your branding for internal reviews or client presentations.'
  },
  {
    icon: <Zap className="w-10 h-10 text-primary" />,
    title: 'AI-Powered Analysis',
    description: 'Our advanced AI engine provides context-aware analysis that understands the nuances of regulatory requirements.'
  },
  {
    icon: <Clock className="w-10 h-10 text-primary" />,
    title: 'Real-Time Processing',
    description: 'Get instant results in seconds, not days, allowing you to quickly iterate on compliance improvements.'
  },
  {
    icon: <Download className="w-10 h-10 text-primary" />,
    title: 'Multi-Format Support',
    description: 'Upload documents in various formats including PDF, DOCX, and plain text for seamless verification.'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Our Compliance Tool?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform simplifies compliance verification with powerful features designed to save you time and reduce risk.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="rounded-xl p-6 border bg-card transition-all duration-300 hover:shadow-soft animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="rounded-lg inline-flex items-center justify-center p-3 bg-primary/5 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
