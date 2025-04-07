
import ActionItemsContainer from './action-items/ActionItemsContainer';
import { ComplianceReport } from '@/utils/types';

interface ActionItemsProps {
  selectedReport?: ComplianceReport | null;
}

const ActionItems = ({ selectedReport }: ActionItemsProps) => {
  return <ActionItemsContainer selectedReport={selectedReport} />;
};

export default ActionItems;
