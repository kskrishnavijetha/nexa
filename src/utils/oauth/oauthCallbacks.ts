
import { toast } from 'sonner';

export const handleOAuthCallback = async (
  service: 'google' | 'slack' | 'jira' | 'zoom' | 'microsoft',
  code: string
) => {
  try {
    // This would typically make a request to your backend to exchange the code for tokens
    console.log(`Handling ${service} OAuth callback with code:`, code);
    
    // Mock successful authentication
    toast.success(`Successfully connected to ${service}`);
    
    // Redirect to the appropriate service page
    const redirectMap = {
      google: '/google-services',
      slack: '/slack-monitoring',
      jira: '/jira',
      zoom: '/zoom',
      microsoft: '/microsoft-365'
    };
    
    window.location.href = redirectMap[service];
  } catch (error) {
    console.error(`Error handling ${service} OAuth:`, error);
    toast.error(`Failed to connect to ${service}`);
    // Redirect to integrations page on error
    window.location.href = '/integrations';
  }
};
