import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LinkedInAuthButton from './feature/auth/linkedin_auth/auth_button'
import { useLinkedInCallback } from './feature/auth/linkedin_auth/hooks/useLinkedInCallback'

function App() {
  const [count, setCount] = useState(0)

  // This custom hook runs once when the App mounts, parses the URL 
  // for LinkedIn redirect parameters, and triggers the success/error handlers
  useLinkedInCallback();

  return (
    <>
      <LinkedInAuthButton />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
