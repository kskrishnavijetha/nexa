
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Globe, Shield, FileText } from 'lucide-react';
import { getPrivacyPolicyPdfUrl, getTermsOfServicePdfUrl } from '@/utils/pdfGuide';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const handlePrivacyPolicyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const pdfUrl = getPrivacyPolicyPdfUrl();
      window.open(pdfUrl, '_blank');
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error('Error generating privacy policy PDF', error);
      toast.error('Unable to open privacy policy. Please try again later.');
    }
  };
  
  const handleTermsOfServiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const pdfUrl = getTermsOfServicePdfUrl();
      window.open(pdfUrl, '_blank');
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);
    } catch (error) {
      console.error('Error generating terms of service PDF', error);
      toast.error('Unable to open terms of service. Please try again later.');
    }
  };
  
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/02ec954b-2d1e-4c5c-bfbd-f06f37b0329d.png" 
                alt="Nexabloom Logo" 
                className="h-6 w-6 object-contain" 
              />
              <span className="font-bold text-xl">Nexabloom</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Automate your compliance monitoring with AI. Stay compliant with GDPR, HIPAA, SOC 2, and PCI-DSS regulations effortlessly.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>contact@nexabloom.com</span>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center text-sm text-muted-foreground">
                <Globe className="h-4 w-4 mr-2" />
                <span>www.nexabloom.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm text-muted-foreground">© {currentYear} Nexabloom. All rights reserved.</span>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="#" 
              onClick={handlePrivacyPolicyClick} 
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="h-4 w-4 mr-1" />
              Privacy Policy
            </a>
            <a 
              href="#" 
              onClick={handleTermsOfServiceClick} 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
