
import React from 'react';
import ActionItemsContainer from './action-items/ActionItemsContainer';
import { ComplianceReport } from '@/utils/types';
import { useSelectedReport } from './context/SelectedReportContext';

interface ActionItemsProps {
  selectedReport?: ComplianceReport | null;
}

const ActionItems = ({ selectedReport: propSelectedReport }: ActionItemsProps) => {
  // Use the selected report from context if not provided as a prop
  const { selectedReport: contextSelectedReport } = useSelectedReport();
  
  // Use either the prop selectedReport or the context selectedReport
  const selectedReport = propSelectedReport || contextSelectedReport;
  
  return <ActionItemsContainer selectedReport={selectedReport} />;
};

export default ActionItems;
