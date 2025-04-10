
// Google API configuration constants
export const CLIENT_ID = "714133727140-brgtrgiecs5en8aet67id9thj3d482br.apps.googleusercontent.com"; 
export const API_KEY = "AIzaSyCx_CpE_hCJUEI4A3jnFJ-RXv4w7J7C4ZY"; 
export const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
export const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

// Information about origin restrictions and how to fix them
export const GOOGLE_API_HELP_TEXT = `
If you experience connection issues with Google Drive integration, verify that your current domain 
is added to the authorized JavaScript origins in the Google Cloud Console. 

1. Go to https://console.cloud.google.com/apis/credentials
2. Find the OAuth client ID used for this application
3. Add this site's origin to the "Authorized JavaScript origins" list
4. Save changes and reload this page

Note: This domain is configured to work with Google services. If you're still having issues,
try clearing your browser cookies and cache, then reload the page.
`;
