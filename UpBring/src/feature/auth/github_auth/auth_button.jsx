import React from 'react';

/**
 * GitHubAuthButton Component
 * 
 * A reusable React functional component that renders a "Sign in with GitHub" button.
 * It manually constructs the GitHub OAuth authorization URL and redirects the user
 * in the same window, similar to the LinkedIn authentication flow.
 */
const GitHubAuthButton = () => {
    // GitHub OAuth Configuration
    const clientId = import.meta.env.VITE_REACT_APP_GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID_HERE';
    // Redirect now goes directly to the backend to set the cookie
    const redirectUri = `http://localhost:5173/auth/github/callback`;

    // Scopes for GitHub API
    // 'repo' scope grants full access to private and public repositories,
    // which is needed to read both private and public repository READMEs.
    const scope = 'repo user';


    // Generate a random state string to prevent CSRF attacks
    // In a real application, you should store this in localStorage/sessionStorage
    // and verify it when the user is redirected back.
    const state = Math.random().toString(36).substring(7);

    // Construct the Authorization URL
    // Documentation: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

    // Handle button click
    const handleLoginClick = () => {
        // Redirect the user in the same window
        window.location.href = githubAuthUrl;
    };

    return (
        <button
            onClick={handleLoginClick}
            className="github-auth-button"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#24292e', // Official GitHub Dark
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            }}
            aria-label="Sign in with GitHub"
        >
            {/* Inline SVG for the GitHub logo */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '24px', height: '24px', marginRight: '8px' }}
                aria-hidden="true"
            >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Connect with GitHub
        </button>
    );
};

export default GitHubAuthButton;
