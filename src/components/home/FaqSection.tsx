
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
    question: "How does the scan limit work for different plans?",
    answer: "Each subscription tier comes with a monthly scan limit. Free plans include 5 scans, Basic plans include 15 scans, Pro plans include 50 scans, and Enterprise plans offer unlimited scans. Once you reach your limit, you'll be prompted to upgrade to continue scanning documents."
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
    question: "Can I upgrade my subscription anytime?",
    answer: "Yes, you can upgrade your subscription at any time. When you reach your scan limit or need additional features, you'll be prompted to visit our pricing page where you can select a plan that better fits your needs."
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
