
import React from 'react';
import { TestTube, Play, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { enableDemoMode, isDemoMode } from '@/utils/demoMode';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DemoSection: React.FC = () => {
  const navigate = useNavigate();
  const [demoActive, setDemoActive] = React.useState(isDemoMode());

  const handleStartDemo = () => {
    enableDemoMode();
    setDemoActive(true);
    toast.success('Demo mode activated! Try uploading a document to scan.');
    navigate('/dashboard');
  };

  const demoFeatures = [
    {
      icon: FileText,
      title: 'Upload Documents',
      description: 'Test document upload and scanning functionality'
    },
    {
      icon: Shield,
      title: 'Compliance Checks',
      description: 'See how our AI analyzes documents for compliance issues'
    },
    {
      icon: TestTube,
      title: '3 Free Scans',
      description: 'Try our service with no registration required'
    }
  ];

  if (demoActive) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <TestTube className="h-4 w-4" />
            <span className="font-medium">Demo Mode Active</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Demo Mode is Running</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            You can now explore all features with 3 free scans. No registration required!
          </p>
          <Button onClick={() => navigate('/dashboard')} size="lg">
            Go to Dashboard
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Try Nexabloom for Free</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience our compliance scanning platform with no registration required. 
            Get 3 free scans to test all features.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {demoFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button onClick={handleStartDemo} size="lg" className="px-8">
            <Play className="h-5 w-5 mr-2" />
            Start Free Demo
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            No credit card or registration required
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
