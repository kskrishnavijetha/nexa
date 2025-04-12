
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
    question: "How does our compliance scanning technology work?",
    answer: "Our compliance scanning uses advanced machine learning algorithms to analyze documents and identify regulatory issues across multiple frameworks. The system extracts key data points, compares them against current regulations, and highlights potential compliance gaps with severity ratings. It also provides actionable recommendations to remediate issues."
  },
  {
    question: "What is the Audit Trail feature and how does it work?",
    answer: "The Audit Trail feature provides a chronological record of all compliance-related activities in your organization. It automatically logs document scans, user actions, policy changes, and compliance status updates. This creates an immutable record that helps demonstrate due diligence during audits and ensures accountability across your organization."
  },
  {
    question: "How do Audit Logs differ from the Audit Trail?",
    answer: "While Audit Trail provides a visual timeline of compliance activities, Audit Logs offer a detailed technical record of all system events with timestamps, user information, and action details. Audit Logs can be filtered, searched, and exported for comprehensive compliance reporting. They're essential for forensic analysis, regulatory investigations, and security monitoring."
  },
  {
    question: "What are Compliance Scenarios and how can I use them?",
    answer: "Compliance Scenarios are interactive simulations that let you model the impact of regulatory changes or business decisions on your compliance posture. You can select from pre-defined scenarios based on your industry or create custom ones. The system analyzes your current compliance data and generates predictive results showing potential compliance scores, risk increases/decreases, and recommended actions."
  },
  {
    question: "How does the Predictive Analysis feature help my organization?",
    answer: "Our Predictive Analysis feature uses historical compliance data and machine learning to forecast future compliance risks. It identifies emerging risk patterns, predicts potential compliance issues before they occur, generates risk trend analyses, and provides proactive recommendations. This helps you stay ahead of regulatory changes and optimize your compliance resources strategically."
  },
  {
    question: "Which regulations does Nexabloom cover?",
    answer: "Our platform covers major regulations including GDPR, HIPAA, SOC 2, PCI-DSS, CCPA, and many more. We regularly update our system to incorporate new regulations and compliance requirements across different regions and industries."
  },
  {
    question: "Can I use Nexabloom for different industries?",
    answer: "Yes, Nexabloom is designed to work across multiple industries including finance, healthcare, e-commerce, technology, government, pharmaceuticals, and more. Each industry module contains specialized compliance rules and guidelines specific to that sector."
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
    <div className="my-16">
      <h2 className="text-3xl font-bold mb-8 text-center">❓ Frequently Asked Questions</h2>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FaqSection;
