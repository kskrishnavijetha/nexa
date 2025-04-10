
import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface UseHistoryUrlStateProps {
  selectedDocument: string | null;
  activeTab: string;
}

export const useHistoryUrlState = ({ selectedDocument, activeTab }: UseHistoryUrlStateProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { preventBlink?: boolean; from?: string } | null;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const documentParam = params.get('document');
    const tabParam = params.get('tab');
    
    if (documentParam) {
      // This will be handled by the parent component
      console.log('Document param found:', documentParam);
    }
    
    if (tabParam && (tabParam === 'reports' || tabParam === 'audit')) {
      // This will be handled by the parent component
      console.log('Tab param found:', tabParam);
    }
  }, [location.search]);

  const updateUrl = useCallback(() => {
    if (locationState?.preventBlink) {
      return;
    }
    
    const params = new URLSearchParams();
    if (selectedDocument) {
      params.set('document', selectedDocument);
    }
    params.set('tab', activeTab);
    
    navigate(`/history?${params.toString()}`, { 
      replace: true,
      state: null
    });
  }, [selectedDocument, activeTab, navigate, locationState]);

  useEffect(() => {
    if (!locationState?.preventBlink) {
      updateUrl();
    } else if (locationState.from === 'action-items' || locationState.from === 'audit-reports') {
      navigate(location.pathname + location.search, {
        replace: true,
        state: null
      });
    }
  }, [selectedDocument, activeTab, updateUrl, locationState, navigate, location.pathname, location.search]);

  return { locationState };
};
