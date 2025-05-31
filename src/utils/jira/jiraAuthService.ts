
// Enhanced Jira authentication service with better error handling and token validation

interface JiraAuthResponse {
  token: string;
  expiresIn: number;
  cloudId: string;
}

interface JiraUserInfo {
  accountId: string;
  emailAddress: string;
  displayName: string;
}

const authenticate = async (cloudId: string, apiToken: string): Promise<{ token: string | null; error: string | null }> => {
  if (!cloudId || !apiToken) {
    return { token: null, error: 'Missing credentials. Please provide both Cloud ID and API Token.' };
  }
  
  try {
    // Clean the cloudId to ensure it's in the right format
    const cleanCloudId = cloudId.replace(/^https?:\/\//, '').replace(/\.atlassian\.net\/?$/, '');
    console.log('Authenticating with Jira', { cloudId: cleanCloudId, apiToken: '***' });
    
    // Test the connection by making an actual API call to Jira
    const testUrl = `https://${cleanCloudId}.atlassian.net/rest/api/3/myself`;
    const authHeader = btoa(`${apiToken}:${apiToken}`); // For API tokens, use token:token format
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        return { token: null, error: 'Invalid API token or insufficient permissions.' };
      }
      if (response.status === 404) {
        return { token: null, error: 'Invalid Cloud ID. Please check your Jira domain.' };
      }
      return { token: null, error: `Authentication failed: ${response.status} ${response.statusText}` };
    }
    
    const userInfo: JiraUserInfo = await response.json();
    console.log('Jira authentication successful:', { user: userInfo.displayName });
    
    // Create a token that includes the necessary info
    const authToken = `${cleanCloudId}:${apiToken}`;
    
    return { token: authToken, error: null };
  } catch (error) {
    console.error('Jira authentication error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Network error connecting to Jira';
    return { token: null, error: errorMessage };
  }
};

const validateToken = async (token: string): Promise<boolean> => {
  if (!token || !token.includes(':')) {
    return false;
  }
  
  try {
    const [cloudId, apiToken] = token.split(':');
    const testUrl = `https://${cloudId}.atlassian.net/rest/api/3/myself`;
    const authHeader = btoa(`${apiToken}:${apiToken}`);
    
    console.log('Validating Jira token for:', cloudId);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Jira token validation error:', error);
    return false;
  }
};

const getAuthHeaders = (token: string) => {
  if (!token || !token.includes(':')) {
    throw new Error('Invalid token format');
  }
  
  const [cloudId, apiToken] = token.split(':');
  const authHeader = btoa(`${apiToken}:${apiToken}`);
  
  return {
    'Authorization': `Basic ${authHeader}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

const getCloudIdFromToken = (token: string): string => {
  if (!token || !token.includes(':')) {
    throw new Error('Invalid token format');
  }
  return token.split(':')[0];
};

export const jiraAuthService = {
  authenticate,
  validateToken,
  getAuthHeaders,
  getCloudIdFromToken
};
