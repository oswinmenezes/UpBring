import { useState } from 'react'
import LinkedInAuthButton from './feature/auth/linkedin_auth/auth_button'
import GitHubAuthButton from './feature/auth/github_auth/auth_button'
import { useLinkedInCallback } from './feature/auth/linkedin_auth/hooks/useLinkedInCallback'
import AuthWrapper from './feature/auth/login/wrapper'
import Landing from './landingPage'
import Dashboard from './pages/dashboard'

/**
 * Home — the protected main page.
 * Only rendered when the user has an active Supabase session.
 */
function Home() {
  const [count, setCount] = useState(0)

  // This custom hook runs once when the component mounts, parses the URL 
  // for LinkedIn redirect parameters, and triggers the success/error handlers
  useLinkedInCallback();

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100vh', justifyContent: 'center', alignItems: 'center', marginBottom: '40px' }}>
        <LinkedInAuthButton />
        <GitHubAuthButton />
      </div>
    </>
  )
}

/**
 * App — wraps Home in AuthWrapper so unauthenticated users
 * are redirected to the login page automatically.
 */
function App() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  )
}

export default App
