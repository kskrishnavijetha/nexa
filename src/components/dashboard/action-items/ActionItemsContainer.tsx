
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHistoricalReports } from '@/utils/historyService';
import { ActionItem } from './types';
import ActionItemsList from './ActionItemsList';
import { ComplianceReport } from '@/utils/types';

interface ActionItemsContainerProps {
  selectedReport?: ComplianceReport | null;
}

const ActionItemsContainer: React.FC<ActionItemsContainerProps> = ({ selectedReport }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  
  useEffect(() => {
    const generateActionItems = () => {
      if (user?.id) {
        const userReports = getUserHistoricalReports(user.id);
        
        if (userReports.length > 0) {
          // Generate action items from report risks
          const items: ActionItem[] = [];
          
          // If a selectedReport is provided, only generate items for that report
          const reportsToProcess = selectedReport 
            ? [selectedReport] 
            : userReports;
          
          reportsToProcess.forEach(report => {
            // Take higher severity risks and convert them to action items
            report.risks.forEach((risk, index) => {
              if (risk.severity === 'high' || (risk.severity === 'medium' && index % 3 === 0)) {
                // Generate due dates between now and 30 days from now
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30) + 1);
                
                // Add resolution steps
                const resolutionSteps = [
                  `Review ${risk.title} documentation`,
                  `Update compliance policy`,
                  `Implement technical controls`,
                  `Document changes and verify compliance`
                ];
                
                items.push({
                  id: `${report.documentId}-${risk.id || index}`,
                  title: risk.title,
                  description: risk.mitigation || risk.description,
                  severity: risk.severity,
                  dueDate: dueDate.toISOString().split('T')[0],
                  completed: false,
                  resolutionSteps: resolutionSteps,
                  documentId: report.documentId,
                  documentName: report.documentName
                });
              }
            });
          });
          
          // Take most recent items (max 4)
          if (items.length > 0) {
            if (selectedReport) {
              setActionItems(items.filter(item => item.documentId === selectedReport.documentId));
            } else {
              setActionItems(items.slice(0, 4));
            }
          }
        }
      }
    };
    
    generateActionItems();
    
    // Set up interval for real-time updates
    const interval = setInterval(() => {
      generateActionItems();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [user, selectedReport]);

  const handleResolve = (id: string) => {
    setActionItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          // If current step is not defined, set it to 0 to start the resolution process
          if (item.currentStep === undefined) {
            toast.success("Starting resolution process");
            return { ...item, currentStep: 0 };
          }
          
          const nextStep = (item.currentStep || 0) + 1;
          const totalSteps = item.resolutionSteps?.length || 0;
          
          // If all steps complete, mark as completed
          if (nextStep >= totalSteps) {
            toast.success("All steps completed! Action item resolved.");
            return { ...item, completed: true };
          }
          
          // Otherwise advance to next step
          toast.success(`Step ${nextStep} of ${totalSteps} completed!`);
          return { ...item, currentStep: nextStep };
        }
        return item;
      })
    );
  };

  const handleViewAll = () => {
    // Navigate to audit tab in history page with preventBlink state to avoid page reload
    navigate('/history?tab=audit', { 
      state: { 
        preventBlink: true,
        from: 'action-items',
        documentId: selectedReport?.documentId
      }
    });
    toast.info(`Viewing all action items${selectedReport ? ` for ${selectedReport.documentName}` : ''}`);
  };

  return (
    <ActionItemsList 
      actionItems={actionItems}
      onResolve={handleResolve}
      onViewAll={handleViewAll}
      selectedReport={selectedReport}
    />
  );
};

export default ActionItemsContainer;
