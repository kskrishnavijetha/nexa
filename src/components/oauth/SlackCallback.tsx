
import { useEffect } from 'react';
import { handleOAuthCallback } from '@/utils/oauth/oauthCallbacks';

const SlackCallback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleOAuthCallback('slack', code);
    } else {
      console.error('No code received from Slack OAuth');
      window.location.href = '/integrations';
    }
  }, []);

  return <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>;
};

export default SlackCallback;
