import React from 'react';

// Importing standalone event handlers to keep the component clean
// Note: handleLinkedInSuccess will likely be called on the redirect URI page
// after the authorization code is received in the URL parameters.
// For this button component, we only need to redirect the user.

/**
 * LinkedInAuthButton Component
 * 
 * A reusable React functional component that renders a "Sign in with LinkedIn" button.
 * It manually constructs the LinkedIn OAuth 2.0 authorization URL and redirects the user
 * in the same window, following the official Microsoft/LinkedIn documentation.
 */
const LinkedInAuthButton = () => {
    // LinkedIn OAuth 2.0 Configuration
    const clientId = import.meta.env.VITE_REACT_APP_LINKEDIN_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
    const redirectUri = `${window.location.origin}`; // Ensure this exactly matches your LinkedIn App settings
    
    // Standard OpenID Connect scopes
    const scope = 'openid profile email w_member_social';
    

    // Generate a random state string to prevent CSRF attacks
    // In a real application, you should store this in localStorage/sessionStorage
    // and verify it when the user is redirected back.
    const state = Math.random().toString(36).substring(7);

    // Construct the Authorization URL
    // Documentation: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
    const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

    // Handle button click
    const handleLoginClick = () => {
        // Redirect the user in the same window
        window.location.href = linkedInAuthUrl;
    };

    return (
        <button
            onClick={handleLoginClick}
            className="linkedin-auth-button"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#0A66C2', // Official LinkedIn Blue
                color: 'white',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            }}
            aria-label="Sign in with LinkedIn"
        >
            {/* Inline SVG for the LinkedIn logo to avoid external image dependencies */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '24px', height: '24px', marginRight: '8px' }}
                aria-hidden="true"
            >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
            Sign in with LinkedIn
        </button>
    );
};

export default LinkedInAuthButton;
