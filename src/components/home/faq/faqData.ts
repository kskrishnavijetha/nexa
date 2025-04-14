
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
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
