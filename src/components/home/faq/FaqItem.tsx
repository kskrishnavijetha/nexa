
import React from 'react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface FaqItemProps {
  question: string;
  answer: string;
  itemValue: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, itemValue }) => {
  return (
    <AccordionItem value={itemValue} className="border-b border-gray-200">
      <AccordionTrigger className="text-left font-medium text-lg py-4 hover:no-underline hover:text-primary">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-muted-foreground pb-4">
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FaqItem;
