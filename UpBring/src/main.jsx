import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GitHubCallback  from './feature/auth/github_auth/github_callback.jsx'
import AuthCallback    from './feature/auth/login/auth_callback.jsx'
import OnboardingPage  from './feature/auth/onboarding/onboarding_page.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            {/* Main app — protected by AuthWrapper inside App */}
            <Route path="/" element={<App />} />

            {/* First-time user profile setup */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Supabase Google OAuth redirect target */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* GitHub OAuth redirect target */}
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
        </Routes>
    </BrowserRouter>
)
