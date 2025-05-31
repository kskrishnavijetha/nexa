
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
    let cleanCloudId = cloudId.trim();
    
    // Remove protocol if present
    cleanCloudId = cleanCloudId.replace(/^https?:\/\//, '');
    
    // Remove .atlassian.net suffix if present
    cleanCloudId = cleanCloudId.replace(/\.atlassian\.net\/?$/, '');
    
    // If it still contains dots or slashes, extract the subdomain part
    if (cleanCloudId.includes('.') || cleanCloudId.includes('/')) {
      const parts = cleanCloudId.split(/[./]/);
      cleanCloudId = parts[0];
    }
    
    console.log('Authenticating with Jira', { cloudId: cleanCloudId, hasToken: !!apiToken });
    
    // Test the connection by making an actual API call to Jira
    const testUrl = `https://${cleanCloudId}.atlassian.net/rest/api/3/myself`;
    
    // For Jira API tokens, the format is email:token
    const authString = `${apiToken}:${apiToken}`;
    const authHeader = btoa(authString);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Jira API response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        return { token: null, error: 'Invalid API token. Please check your Atlassian API token and ensure it has the correct permissions.' };
      }
      if (response.status === 404) {
        return { token: null, error: `Invalid Cloud ID "${cleanCloudId}". Please check your Jira domain (e.g., "mycompany" from mycompany.atlassian.net).` };
      }
      if (response.status === 403) {
        return { token: null, error: 'Access denied. Please ensure your API token has the required permissions to access Jira.' };
      }
      const errorText = await response.text().catch(() => 'Unknown error');
      return { token: null, error: `Authentication failed: ${response.status} ${response.statusText}. ${errorText}` };
    }
    
    const userInfo: JiraUserInfo = await response.json();
    console.log('Jira authentication successful:', { user: userInfo.displayName, email: userInfo.emailAddress });
    
    // Create a token that includes the necessary info
    const authToken = `${cleanCloudId}:${apiToken}`;
    
    return { token: authToken, error: null };
  } catch (error) {
    console.error('Jira authentication error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { token: null, error: 'Network error: Unable to connect to Jira. Please check your internet connection and try again.' };
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while connecting to Jira';
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
    const authString = `${apiToken}:${apiToken}`;
    const authHeader = btoa(authString);
    
    console.log('Validating Jira token for:', cloudId);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json'
      }
    });
    
    const isValid = response.ok;
    console.log('Token validation result:', isValid);
    return isValid;
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
  const authString = `${apiToken}:${apiToken}`;
  const authHeader = btoa(authString);
  
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
