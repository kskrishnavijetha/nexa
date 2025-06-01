
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
    
    // For Jira API tokens, we need to ask the user for their email
    // Since we can't get it without authentication, we'll need to modify our approach
    // Let's try a different strategy - use the API token directly with a placeholder email first
    // and if that fails, we'll provide specific guidance
    
    const testUrl = `https://${cleanCloudId}.atlassian.net/rest/api/3/myself`;
    
    // Try with the API token as both username and password (some API setups work this way)
    let authString = `${apiToken}:${apiToken}`;
    let authHeader = btoa(authString);
    
    let response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('First attempt response status:', response.status);
    
    // If that doesn't work, try with empty password (another common pattern)
    if (!response.ok && response.status === 401) {
      authString = `${apiToken}:`;
      authHeader = btoa(authString);
      
      response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Second attempt response status:', response.status);
    }
    
    if (!response.ok) {
      if (response.status === 401) {
        return { 
          token: null, 
          error: 'Authentication failed. For Jira API tokens, you need to use your Atlassian account email as username and the API token as password. Please ensure your API token is valid and has the correct permissions.' 
        };
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
    
    // Create a token that includes the necessary info - use the successful auth method
    const successfulAuthString = response.status === 200 ? authString : `${apiToken}:`;
    const authToken = `${cleanCloudId}:${userInfo.emailAddress}:${apiToken}:${btoa(successfulAuthString)}`;
    
    return { token: authToken, error: null };
  } catch (error) {
    console.error('Jira authentication error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { token: null, error: 'Network error: Unable to connect to Jira. Please check your internet connection and Jira domain.' };
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
    const parts = token.split(':');
    if (parts.length !== 4) {
      return false;
    }
    
    const [cloudId, email, apiToken, encodedAuth] = parts;
    const testUrl = `https://${cloudId}.atlassian.net/rest/api/3/myself`;
    const authHeader = atob(encodedAuth);
    
    console.log('Validating Jira token for:', cloudId);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(authHeader)}`,
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
  
  const parts = token.split(':');
  if (parts.length !== 4) {
    throw new Error('Invalid token format');
  }
  
  const [cloudId, email, apiToken, encodedAuth] = parts;
  const authHeader = atob(encodedAuth);
  
  return {
    'Authorization': `Basic ${btoa(authHeader)}`,
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
