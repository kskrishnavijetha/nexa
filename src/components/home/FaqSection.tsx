
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Nexabloom?",
    answer: "Nexabloom is an AI-powered compliance automation platform that helps businesses maintain regulatory compliance with less effort. Our system provides automated document scanning, risk detection, policy generation, and real-time monitoring across various industries and regulatory frameworks."
  },
  {
    question: "How does the compliance scanning technology work?",
    answer: "Our compliance scanning uses advanced machine learning algorithms to analyze documents and identify regulatory issues across multiple frameworks. The system extracts key data points, compares them against current regulations, and highlights potential compliance gaps with severity ratings. It also provides actionable recommendations to remediate issues."
  },
  {
    question: "Which regulations does Nexabloom cover?",
    answer: "Our platform covers major regulations including GDPR, HIPAA, SOC 2, PCI-DSS, CCPA, and many more. We regularly update our system to incorporate new regulations and compliance requirements across different regions and industries."
  },
  {
    question: "How secure is my data with Nexabloom?",
    answer: "We take data security very seriously. All documents and data are encrypted in transit and at rest. We follow best practices for secure data handling and maintain strict access controls. Our system is designed to help you maintain compliance without compromising your own data security."
  },
  {
    question: "How accurate is the AI-powered compliance detection?",
    answer: "Our AI compliance engine achieves over 95% accuracy in detecting compliance issues across supported regulations. The system continuously learns and improves through machine learning, and all critical findings are validated against the latest regulatory requirements."
  }
];

const FaqSection: React.FC = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our compliance platform
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-medium text-lg py-4 hover:no-underline hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
