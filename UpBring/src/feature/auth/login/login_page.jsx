/**
 * login_page.jsx
 *
 * A premium login page for the UpBring app.
 * Initiates Supabase Google OAuth when the user clicks "Sign in with Google".
 * Handles loading and error states gracefully.
 */

import React, { useState } from 'react';
import supabase from '../../../services/supabase_client';

// ─── Inline styles ────────────────────────────────────────────────────────────

const styles = {
    page: {
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a4e 50%, #24243e 100%)',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
    },
    // Decorative blobs
    blobTop: {
        position: 'absolute',
        top: '-120px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blobBottom: {
        position: 'absolute',
        bottom: '-140px',
        left: '-120px',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(255, 255, 255, 0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px',
        padding: '56px 48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px',
    },
    logoWrapper: {
        width: '64px',
        height: '64px',
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(99,102,241,0.45)',
    },
    logoText: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: '-1px',
    },
    heading: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#f1f5f9',
        margin: '0 0 8px',
        textAlign: 'center',
        letterSpacing: '-0.5px',
    },
    subheading: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.5)',
        margin: '0 0 40px',
        textAlign: 'center',
        lineHeight: '1.6',
    },
    divider: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '0 0 32px',
        color: 'rgba(255,255,255,0.25)',
        fontSize: '12px',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
    },
    dividerLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(255,255,255,0.12)',
    },
    googleBtn: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '14px 24px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.08)',
        color: '#f1f5f9',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        letterSpacing: '0.2px',
        outline: 'none',
        backdropFilter: 'blur(8px)',
    },
    googleBtnHover: {
        background: 'rgba(255,255,255,0.15)',
        borderColor: 'rgba(255,255,255,0.3)',
        transform: 'translateY(-1px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    },
    googleBtnDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
        transform: 'none',
    },
    errorBox: {
        marginTop: '20px',
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.35)',
        color: '#fca5a5',
        fontSize: '13px',
        textAlign: 'center',
        lineHeight: '1.5',
    },
    footer: {
        marginTop: '36px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.28)',
        textAlign: 'center',
        lineHeight: '1.6',
    },
    spinner: {
        width: '18px',
        height: '18px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
    },
};

// ─── Google SVG icon ──────────────────────────────────────────────────────────

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.6 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.6-3-11.3-7.4L6 33.4C9.4 39.6 16.2 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.9 2.5-2.5 4.6-4.7 6l6.2 5.2C41 36.2 44 30.6 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * LoginPage
 *
 * Renders the UpBring login screen.
 * Calls Supabase Google OAuth on button click.
 */
const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);
    const [hovered, setHovered] = useState(false);

    /**
     * Initiates the Google OAuth flow via Supabase.
     * Supabase will redirect the user to Google, then back to
     * the `redirectTo` URL where the session is captured.
     */
    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (oauthError) {
            setError(oauthError.message || 'Failed to start Google sign-in. Please try again.');
            setLoading(false);
        }
        // If no error, browser will redirect — no need to setLoading(false)
    };

    const btnStyle = {
        ...styles.googleBtn,
        ...(hovered && !loading ? styles.googleBtnHover : {}),
        ...(loading ? styles.googleBtnDisabled : {}),
    };

    return (
        <>
            {/* Inject keyframe animation via a style tag */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #0f0c29; }
            `}</style>

            <div style={styles.page}>
                {/* Background blobs */}
                <div style={styles.blobTop}  aria-hidden="true" />
                <div style={styles.blobBottom} aria-hidden="true" />

                {/* Card */}
                <div style={styles.card} role="main">
                    {/* Logo */}
                    <div style={styles.logoWrapper} aria-hidden="true">
                        <span style={styles.logoText}>U</span>
                    </div>

                    <h1 style={styles.heading}>Welcome to UpBring</h1>
                    <p style={styles.subheading}>
                        Sign in to access your personalised dashboard<br />
                        and start your journey.
                    </p>

                    {/* Divider */}
                    <div style={styles.divider} aria-hidden="true">
                        <div style={styles.dividerLine} />
                        Continue with
                        <div style={styles.dividerLine} />
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        id="google-signin-btn"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={btnStyle}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        aria-label="Sign in with Google"
                    >
                        {loading ? (
                            <>
                                <div style={styles.spinner} aria-hidden="true" />
                                Redirecting to Google…
                            </>
                        ) : (
                            <>
                                <GoogleIcon />
                                Sign in with Google
                            </>
                        )}
                    </button>

                    {/* Error message */}
                    {error && (
                        <div style={styles.errorBox} role="alert">
                            {error}
                        </div>
                    )}

                    {/* Footer */}
                    <p style={styles.footer}>
                        By signing in you agree to our Terms of Service<br />
                        and Privacy Policy.
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
