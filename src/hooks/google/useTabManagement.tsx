
import { useState } from 'react';

export function useTabManagement() {
  const [activeTab, setActiveTab] = useState('scanner');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return {
    activeTab,
    handleTabChange
  };
}
