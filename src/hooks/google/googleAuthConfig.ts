
// Google API configuration constants
// These are publishable client IDs that can be safely stored in client-side code
export const CLIENT_ID = "YOUR_CLIENT_ID_GOES_HERE"; // Blank this out - user needs to provide their own
export const API_KEY = "YOUR_API_KEY_GOES_HERE"; // Blank this out - user needs to provide their own
export const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
export const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

// Information about origin restrictions and how to fix them
export const GOOGLE_API_HELP_TEXT = `
If you're getting 'Error 401: invalid_client' or 'The OAuth client was not found':

1. Go to https://console.cloud.google.com/apis/credentials
2. Create or update your OAuth client ID
3. Under 'Authorized JavaScript origins', add your exact domain:
   - For local development: http://localhost:5173 (or your dev server port)
   - For production: https://yourdomain.com
4. Make sure the client ID and API key in the application match those in Google Cloud Console
5. Save changes and reload this page

Note: Google API credentials are domain-specific and won't work on unauthorized domains.
`;

// Setting for enabling demo mode (when true, uses mock data instead of actual Google API)
export const ENABLE_DEMO_MODE = true;
