
// Google API configuration constants
// These are publishable client IDs that can be safely stored in client-side code
export const CLIENT_ID = ""; // Add your client ID here
export const API_KEY = ""; // Add your API key here
export const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
export const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

// Information about origin restrictions and how to fix them
export const GOOGLE_API_HELP_TEXT = `
To set up Google API credentials:

1. Go to https://console.cloud.google.com/apis/credentials
2. Create a new project or select an existing one
3. Create credentials:
   - Click "Create Credentials" > "OAuth client ID" > "Web application"
   - Under "Authorized JavaScript origins", add your domain:
     - For local development: http://localhost:5173 (or your dev server port)
     - For production: https://yourdomain.com
   - Click "Create"
4. Also create an API key for your project
5. Add both the Client ID and API Key to the application
6. Refresh this page

Note: Google API credentials are domain-specific and won't work on unauthorized domains.
`;

// Setting for enabling demo mode (when true, uses mock data instead of actual Google API)
export const ENABLE_DEMO_MODE = true; // Default to demo mode until valid credentials are provided

// Debug information about the domain
export const DEBUG_HOST_INFO = {
  currentHost: window.location.origin,
  currentHostname: window.location.hostname,
  isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};
