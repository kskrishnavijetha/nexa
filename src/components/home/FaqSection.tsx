
import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import FaqItem from './faq/FaqItem';
import { faqs } from './faq/faqData';

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
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                itemValue={`item-${index}`}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FaqSection;
