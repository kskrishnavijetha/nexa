
export interface ActionItem {
  id: string;
  title: string;
  description: string;
  severity: string;
  dueDate: string;
  completed?: boolean;
  resolutionSteps?: string[];
  currentStep?: number;
}
