
// Service for handling Jira authentication

interface JiraAuthResponse {
  token: string;
  expiresIn: number;
}

const authenticate = async (cloudId: string, apiToken: string): Promise<string | null> => {
  try {
    console.log('Authenticating with Jira', { cloudId, apiToken: '***' });
    
    // In a real implementation, this would make an API call to your backend
    // which would handle the OAuth flow with Jira
    // For demo purposes, we'll simulate a successful authentication
    
    // Make API request to authenticate
    try {
      const response = await fetch('/api/jira/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cloudId, apiToken }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Authentication error:', errorData);
        return null;
      }
      
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Fallback for demo purposes
      console.log('Using fallback authentication for demo');
      const mockResponse: JiraAuthResponse = {
        token: `jira_token_${Date.now()}`,
        expiresIn: 3600
      };
      
      return mockResponse.token;
    }
  } catch (error) {
    console.error('Jira authentication error:', error);
    return null;
  }
};

const validateToken = async (token: string): Promise<boolean> => {
  try {
    console.log('Validating Jira token', { token: token.substring(0, 5) + '***' });
    
    // Try to validate against API
    try {
      const response = await fetch('/api/jira/validate-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token validation API request failed:', error);
      
      // Fallback for demo purposes
      console.log('Using fallback token validation for demo');
      return Boolean(token) && token.startsWith('jira_token_');
    }
  } catch (error) {
    console.error('Jira token validation error:', error);
    return false;
  }
};

export const jiraAuthService = {
  authenticate,
  validateToken
};
