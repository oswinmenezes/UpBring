/**
 * wrapper.jsx
 *
 * AuthWrapper — an auth-state guard component.
 *
 * Subscribes to the Supabase auth session on mount. While the session
 * status is indeterminate (initial load), a centered spinner is shown.
 * Once resolved:
 *   - No session                   → renders <LoginPage />
 *   - Session, not yet onboarded   → redirects to /onboarding
 *   - Session, onboarded           → renders {children}
 *
 * Usage:
 *   <AuthWrapper>
 *     <App />
 *   </AuthWrapper>
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './login_page';
import supabase  from '../../../services/supabase_client';

const styles = {
    loader: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)',
    },
    spinner: {
        width: '40px', height: '40px',
        border: '4px solid rgba(255,255,255,0.12)',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.85s linear infinite',
    },
};

/**
 * AuthWrapper
 *
 * @param {{ children: React.ReactNode }} props
 */
const AuthWrapper = ({ children }) => {
    const navigate  = useNavigate();
    const location  = useLocation();

    // null = loading, object = has session, false = no session
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Get current session on first render
        supabase.auth.getSession().then(({ data: { session: current } }) => {
            setSession(current ?? false);
            setLoading(false);

            // If authenticated but not yet onboarded, push to /onboarding
            if (current && !current.user?.user_metadata?.onboarded) {
                // Only redirect if not already on the onboarding route
                if (location.pathname !== '/onboarding') {
                    navigate('/onboarding', { replace: true });
                }
            }
        });

        // 2. Subscribe to auth state changes (sign-in / sign-out / token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession ?? false);
            setLoading(false);

            if (newSession && !newSession.user?.user_metadata?.onboarded) {
                if (location.pathname !== '/onboarding') {
                    navigate('/onboarding', { replace: true });
                }
            }
        });

        return () => subscription?.unsubscribe();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <div style={styles.loader} aria-label="Loading">
                    <div style={styles.spinner} aria-hidden="true" />
                </div>
            </>
        );
    }

    // No active session — show the login screen
    if (!session) return <LoginPage />;

    // Has session — render the protected content
    return children;
};

export default AuthWrapper;
