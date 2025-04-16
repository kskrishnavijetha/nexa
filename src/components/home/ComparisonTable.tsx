
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Check, X, Zap, FileText, FileCheck, Clock, DollarSign, Brain, Globe } from 'lucide-react';

const ComparisonTable: React.FC = () => {
  const comparisonData = [
    {
      nexabloom: "⚡ AI-Powered Risk Detection",
      traditional: "Manual checklists & consultant-led reviews",
      icon: <Zap className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "📄 Instant Audit-Ready PDF Reports",
      traditional: "Delays, setup time, and add-on costs",
      icon: <FileText className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "🔐 Tamper-Proof Hash Verification",
      traditional: "Not included or requires custom integrations",
      icon: <FileCheck className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "🔎 Smart Audit Trails & Logs",
      traditional: "Limited tracking, no AI timeline mapping",
      icon: <Clock className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "💸 $999 Lifetime Deal",
      traditional: "$12,000–$50,000/year + onboarding fees",
      icon: <DollarSign className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "🧠 Launch in Minutes",
      traditional: "Requires integrations, audits, and team setup",
      icon: <Brain className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "🤖 Auto Framework Mapping (GDPR, HIPAA, SOC 2)",
      traditional: "Requires consultants or templates",
      icon: <FileText className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "🧾 Exportable Reports with Branding",
      traditional: "Locked behind Enterprise tiers",
      icon: <FileText className="h-5 w-5 text-amber-500" />
    },
    {
      nexabloom: "🌍 Ideal for Startups, Agencies, and Solo Devs",
      traditional: "Focused on large-scale or VC-backed companies",
      icon: <Globe className="h-5 w-5 text-amber-500" />
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">
            <span className="text-primary">✅ NexaBloom</span> | <span className="text-red-500">❌ Traditional Tools</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            See how NexaBloom outperforms traditional enterprise compliance solutions
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="font-bold text-primary text-lg">NexaBloom</TableHead>
                  <TableHead className="font-bold text-gray-500 text-lg">Traditional Tools</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <TableCell className="text-center">{row.icon}</TableCell>
                    <TableCell className="font-medium">{row.nexabloom}</TableCell>
                    <TableCell className="text-gray-600">{row.traditional}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
