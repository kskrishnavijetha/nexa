
import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import DocumentPreview from '@/components/document-analysis/DocumentPreview';
import { ComplianceReport } from '@/utils/types';
import { getUserHistoricalReports } from '@/utils/historyService';
import { useAuth } from '@/contexts/AuthContext';

interface DeadlineItem {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  critical: boolean;
  icon: 'red' | 'blue' | 'amber';
  documentId: string;
  report: ComplianceReport;
}

const UpcomingDeadlines = () => {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<ComplianceReport | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  
  useEffect(() => {
    if (user?.id) {
      const reports = getUserHistoricalReports(user.id);
      
      // Generate deadlines from user reports
      const generatedDeadlines: DeadlineItem[] = reports.map((report, index) => {
        // Generate a random due date between now and 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 28) + 3); // 3-30 days
        
        // Calculate days left
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Determine if it's critical (less than 7 days)
        const critical = daysLeft < 7;
        
        return {
          id: report.documentId,
          title: report.documentName,
          date: dueDate.toISOString().split('T')[0],
          daysLeft,
          critical,
          icon: critical ? 'red' : daysLeft < 14 ? 'amber' : 'blue',
          documentId: report.documentId,
          report
        };
      });
      
      // Sort by days left (most urgent first)
      generatedDeadlines.sort((a, b) => a.daysLeft - b.daysLeft);
      
      // Take only first 3 (most urgent)
      setDeadlines(generatedDeadlines.slice(0, 3));
    }
  }, [user]);

  const handleDocumentClick = (report: ComplianceReport) => {
    setSelectedDocument(report);
    setPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      {deadlines.length > 0 ? (
        <>
          {deadlines.map((deadline) => (
            <div 
              key={deadline.id} 
              className="flex items-start space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors"
              onClick={() => handleDocumentClick(deadline.report)}
            >
              <div className={cn(
                "p-2 rounded-md flex-shrink-0 mt-1",
                deadline.icon === 'red' ? "bg-red-100" : 
                deadline.icon === 'amber' ? "bg-amber-100" : "bg-blue-100"
              )}>
                <Calendar className={cn(
                  "h-5 w-5",
                  deadline.icon === 'red' ? "text-red-500" : 
                  deadline.icon === 'amber' ? "text-amber-500" : "text-blue-500"
                )} />
              </div>
              <div>
                <h4 className="font-medium">{deadline.title}</h4>
                <div className="flex items-center text-sm space-x-2 mt-1">
                  <span className="text-muted-foreground">{new Date(deadline.date).toLocaleDateString()}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className={cn(
                    "font-medium",
                    deadline.daysLeft < 7 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {deadline.daysLeft} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">No upcoming deadlines found</p>
        </div>
      )}
      
      {/* Document Preview Dialog */}
      <DocumentPreview 
        report={selectedDocument} 
        isOpen={previewOpen} 
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default UpcomingDeadlines;
