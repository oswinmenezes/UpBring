import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import GitHubCallback from './feature/auth/github_auth/github_callback.jsx'
import AuthCallback from './feature/auth/login/auth_callback.jsx'
import OnboardingPage from './feature/auth/onboarding/onboarding_page.jsx'
import Dashboard from './pages/dashboard.jsx'
import NavBar from './components/NavBar.jsx'
import MockInterview from './mockinterview.jsx'
import JobPortal from './get_job.jsx'
import RoadmapPage from './upskill.jsx'
import Landing from './landingPage.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            {/* Main app — protected by AuthWrapper inside App */}
            <Route path="/" element={<App />} />
            <Route path="/landing" element={<Landing />} />

            {/* First-time user profile setup */}

            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Supabase Google OAuth redirect target */}
            {/*  */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* this is for features */}
            <Route path="/dashboard" element={<><NavBar /><Dashboard /></>} />

            <Route path="/getjob" element={<><NavBar /><JobPortal /></>} />
            <Route path="/learn" element={<><NavBar /><RoadmapPage /></>} />

            <Route path="/mock" element={<><NavBar /><MockInterview /></>} />


            {/* GitHub OAuth redirect target */}
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
        </Routes>
    </BrowserRouter>
)
