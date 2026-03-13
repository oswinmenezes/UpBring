import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * GitHubCallback Component
 * 
 * Handles the redirect from GitHub OAuth.
 * Extracts the authorization code from the URL and exchanges it for an access token.
 * Redirects to the onboarding page upon successful authentication.
 */
const GitHubCallback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing authentication...');
    const [repos, setRepos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleAuth = async () => {
            // Extract the 'code' from the URL query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');

            if (!code) {
                setStatus('Authentication failed: No code provided.');
                setError('No authorization code found in the URL.');
                return;
            }

            setStatus('Authorization code received. Exchanging for access token via backend...');

            try {
                // 1. Send code to Flask backend to get the access token
                const tokenResponse = await fetch('http://localhost:5000/api/auth/github', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code })
                });

                const tokenData = await tokenResponse.json();

                if (!tokenResponse.ok) {
                    throw new Error(tokenData.error || 'Failed to exchange code for token.');
                }

                const accessToken = tokenData.access_token;
                if (!accessToken) {
                    throw new Error('Access token not returned from backend.');
                }

                setStatus('Token received. Fetching repositories and READMEs via backend...');

                // 2. Use the token to fetch repos from Flask backend
                const reposResponse = await fetch('http://localhost:5000/api/github/repos', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log("res" + reposResponse);

                const reposData = await reposResponse.json();

                if (!reposResponse.ok) {
                    throw new Error(reposData.error || 'Failed to fetch repositories.');
                }

                const fetchedRepos = reposData.repos || [];
                setRepos(fetchedRepos);
                setStatus(`Successfully fetched ${fetchedRepos.length} repositories along with their READMEs.`);

                // Store repos in sessionStorage for access in onboarding page
                sessionStorage.setItem('githubRepos', JSON.stringify(fetchedRepos));
                sessionStorage.setItem('githubAccessToken', accessToken);

                // Redirect to onboarding after successful authentication
                setTimeout(() => {
                    navigate('/onboarding', { replace: true });
                }, 2000);

            } catch (err) {
                console.error('Error during GitHub Auth callback:', err);
                setStatus('Authentication process failed.');
                setError(err.message);
            }
        };

        handleAuth();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>GitHub Authentication Callback</h2>
            <p>Status: <strong>{status}</strong></p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {repos.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Your Repositories:</h3>
                    <ul style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                        {repos.map(repo => (
                            <li key={repo.id} style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                                <strong>{repo.name}</strong> ({repo.private ? 'Private' : 'Public'})
                                <br />
                                <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '4px 0' }}>{repo.description || 'No description'}</p>

                                {repo.readme ? (
                                    <div style={{ marginTop: '10px', backgroundColor: '#f6f8fa', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>
                                        <strong>README Preview:</strong>
                                        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto', marginTop: '5px' }}>
                                            {repo.readme}
                                        </pre>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>No README found</div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GitHubCallback;
