
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Use an environment variable or a direct key value
// For this example, we'll use a specific key directly since this is a demo app
const PUBLISHABLE_KEY = "pk_test_aW5jcmVkaWJsZS1naXJhZmZlLTUzLmNsZXJrLmFjY291bnRzLmRldiQ"
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      clerkJSVersion="5.56.0-snapshot.v20250312225817"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/payment"
      signUpFallbackRedirectUrl="/payment"
      signInForceRedirectUrl="/payment"
      signUpForceRedirectUrl="/payment"
      afterSignOutUrl="/"
      waitlistUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
