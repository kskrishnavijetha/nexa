
import { useEffect } from 'react';
import { handleOAuthCallback } from '@/utils/oauth/oauthCallbacks';

const ZoomCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback('zoom', code);
    } else {
      console.error('No code received from Zoom OAuth');
      window.location.href = '/integrations';
    }
  }, []);

  return <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>;
};

export default ZoomCallback;
