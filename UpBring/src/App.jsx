import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LinkedInAuthButton from './feature/auth/linkedin_auth/auth_button'
import GitHubAuthButton from './feature/auth/github_auth/auth_button'
import GitHubCallback from './feature/auth/github_auth/github_callback'
import { useLinkedInCallback } from './feature/auth/linkedin_auth/hooks/useLinkedInCallback'

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
      </Routes>
    </Router>
  )
}

export default App
