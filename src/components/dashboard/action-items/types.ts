
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  resolutionSteps?: string[];
  currentStep?: number;
  documentId?: string;  // Add document reference
  documentName?: string; // Add document name
}
