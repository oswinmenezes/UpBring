/**
 * auth_callback.jsx
 *
 * Handles the OAuth redirect from Supabase / Google.
 *
 * After the user approves the Google consent screen, Supabase
 * redirects the browser to /auth/callback with a URL fragment
 * containing the access_token and refresh_token.
 *
 * On session capture:
 *   - First-time user (onboarded === undefined/false) → /onboarding
 *   - Returning user (onboarded === true)             → /
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../services/supabase_client';

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: '#f1f5f9',
        gap: '20px',
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid rgba(255,255,255,0.15)',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
    },
    text: {
        fontSize: '16px',
        color: 'rgba(255,255,255,0.55)',
        letterSpacing: '0.2px',
    },
    errorBox: {
        padding: '14px 20px',
        borderRadius: '12px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.3)',
        color: '#fca5a5',
        fontSize: '14px',
        maxWidth: '360px',
        textAlign: 'center',
    },
};

/**
 * Determines where to send the user after sign-in.
 *
 * @param {import('@supabase/supabase-js').User} user
 * @returns {string} route path
 */
const resolveDestination = (user) => {
    const isOnboarded = user?.user_metadata?.onboarded === true;
    return isOnboarded ? '/' : '/onboarding';
};

/**
 * AuthCallback
 *
 * Mounted at /auth/callback.
 * Waits for Supabase to process the OAuth tokens from the URL,
 * then redirects first-time users to /onboarding and returning
 * users to /.
 */
const AuthCallback = () => {
    const navigate  = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        /**
         * Listen for the SIGNED_IN event that fires once Supabase
         * has exchanged the OAuth code/tokens for a session.
         */
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                navigate(resolveDestination(session.user), { replace: true });
            }
        });

        /**
         * Fallback: if a session already exists by the time this
         * component mounts (fast redirect), navigate immediately.
         */
        supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
            if (sessionError) {
                setError(sessionError.message || 'Authentication failed. Please try again.');
                return;
            }
            if (session) {
                navigate(resolveDestination(session.user), { replace: true });
            }
        });

        return () => subscription?.unsubscribe();
    }, [navigate]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; margin: 0; padding: 0; }
            `}</style>

            <div style={styles.container} role="status" aria-live="polite">
                {error ? (
                    <div style={styles.errorBox}>{error}</div>
                ) : (
                    <>
                        <div style={styles.spinner} aria-hidden="true" />
                        <p style={styles.text}>Completing sign-in…</p>
                    </>
                )}
            </div>
        </>
    );
};

export default AuthCallback;
