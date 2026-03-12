/**
 * onboarding_page.jsx
 *
 * Shown to first-time users immediately after Google sign-up.
 * Collects:
 *   1. Full Name
 *   2. Institution / Organization
 *
 * On submit, the data is persisted to Supabase user metadata and
 * `onboarded: true` is set so this page is never shown again.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../services/supabase_client';

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
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
    blobTop: {
        position: 'absolute', top: '-100px', right: '-80px',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.30) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    blobBottom: {
        position: 'absolute', bottom: '-120px', left: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    card: {
        position: 'relative', zIndex: 1,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '24px',
        padding: '52px 48px',
        width: '100%', maxWidth: '460px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
    },
    // Step indicator
    stepBadge: {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: 'rgba(99,102,241,0.18)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '20px',
        padding: '4px 14px',
        fontSize: '12px', fontWeight: '600',
        color: '#a5b4fc', letterSpacing: '0.4px',
        marginBottom: '24px',
    },
    logoWrapper: {
        width: '60px', height: '60px', borderRadius: '16px',
        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '20px',
        boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
    },
    logoText: { fontSize: '26px', fontWeight: '800', color: '#fff' },
    heading: {
        fontSize: '26px', fontWeight: '700', color: '#f1f5f9',
        margin: '0 0 8px', textAlign: 'center', letterSpacing: '-0.4px',
    },
    subheading: {
        fontSize: '14px', color: 'rgba(255,255,255,0.48)',
        margin: '0 0 36px', textAlign: 'center', lineHeight: '1.6',
    },
    // Form
    form: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: {
        fontSize: '13px', fontWeight: '600',
        color: 'rgba(255,255,255,0.65)', letterSpacing: '0.2px',
    },
    input: {
        width: '100%', padding: '13px 16px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.14)',
        background: 'rgba(255,255,255,0.07)',
        color: '#f1f5f9',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        caretColor: '#6366f1',
        boxSizing: 'border-box',
    },
    inputFocus: {
        borderColor: 'rgba(99,102,241,0.7)',
        boxShadow: '0 0 0 3px rgba(99,102,241,0.18)',
        background: 'rgba(255,255,255,0.09)',
    },
    submitBtn: {
        marginTop: '8px',
        width: '100%', padding: '14px',
        borderRadius: '12px', border: 'none',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#fff', fontSize: '15px', fontWeight: '700',
        cursor: 'pointer',
        transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
        letterSpacing: '0.2px',
        boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
    },
    submitBtnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
    spinner: {
        width: '16px', height: '16px',
        border: '2px solid rgba(255,255,255,0.35)',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        flexShrink: 0,
    },
    errorBox: {
        padding: '12px 16px', borderRadius: '10px',
        background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.3)',
        color: '#fca5a5', fontSize: '13px', textAlign: 'center', lineHeight: '1.5',
    },
    progressBar: {
        width: '100%', height: '4px', borderRadius: '2px',
        background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '32px',
    },
    progressFill: {
        height: '100%', width: '33%', borderRadius: '2px',
        background: 'linear-gradient(90deg, #6366f1, #ec4899)',
        transition: 'width 0.4s ease',
    },
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * OnboardingPage
 *
 * Collects basic profile info from first-time users.
 * Saves data to Supabase user metadata on submit.
 */
const OnboardingPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ fullName: '', institution: '' });
    const [focused, setFocused] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /** Update a single field in form state */
    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (error) setError(null);
    };

    /**
     * Submit handler.
     * Persists profile data to Supabase user metadata and marks the user
     * as onboarded so this page is skipped on future sign-ins.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullName    = form.fullName.trim();
        const institution = form.institution.trim();

        if (!fullName) { setError('Please enter your full name.'); return; }
        if (!institution) { setError('Please enter your institution or organisation.'); return; }

        setLoading(true);
        setError(null);

        const { error: updateError } = await supabase.auth.updateUser({
            data: {
                full_name:   fullName,
                institution: institution,
                onboarded:   true,
            },
        });

        if (updateError) {
            setError(updateError.message || 'Could not save your profile. Please try again.');
            setLoading(false);
            return;
        }

        // Success — head to the app
        navigate('/', { replace: true });
    };

    const inputStyle = (field) => ({
        ...s.input,
        ...(focused[field] ? s.inputFocus : {}),
    });

    const btnStyle = {
        ...s.submitBtn,
        ...(loading ? s.submitBtnDisabled : {}),
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { background: #0f0c29; }
                input::placeholder { color: rgba(255,255,255,0.28); }
            `}</style>

            <div style={s.page}>
                <div style={s.blobTop}  aria-hidden="true" />
                <div style={s.blobBottom} aria-hidden="true" />

                <div style={{ ...s.card, animation: 'fadeUp 0.4s ease both' }}>
                    {/* Step badge */}
                    <div style={s.stepBadge}>
                        <span>✦</span> Step 1 of 1 — Profile Setup
                    </div>

                    {/* Logo */}
                    <div style={s.logoWrapper} aria-hidden="true">
                        <span style={s.logoText}>U</span>
                    </div>

                    <h1 style={s.heading}>Let's get you set up</h1>
                    <p style={s.subheading}>
                        Just a couple of things to personalise<br />
                        your UpBring experience.
                    </p>

                    {/* Progress bar */}
                    <div style={s.progressBar} aria-hidden="true">
                        <div style={{
                            ...s.progressFill,
                            width: (form.fullName && form.institution) ? '100%' : form.fullName ? '66%' : '33%',
                        }} />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={s.form} noValidate>
                        {/* Full Name */}
                        <div style={s.fieldGroup}>
                            <label htmlFor="fullName" style={s.label}>Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                placeholder="e.g. Alex Johnson"
                                value={form.fullName}
                                onChange={handleChange('fullName')}
                                onFocus={() => setFocused((f) => ({ ...f, fullName: true }))}
                                onBlur={() => setFocused((f) => ({ ...f, fullName: false }))}
                                style={inputStyle('fullName')}
                                autoComplete="name"
                                autoFocus
                                disabled={loading}
                                aria-required="true"
                            />
                        </div>

                        {/* Institution / Organisation */}
                        <div style={s.fieldGroup}>
                            <label htmlFor="institution" style={s.label}>Institution / Organisation</label>
                            <input
                                id="institution"
                                type="text"
                                placeholder="e.g. Stanford University"
                                value={form.institution}
                                onChange={handleChange('institution')}
                                onFocus={() => setFocused((f) => ({ ...f, institution: true }))}
                                onBlur={() => setFocused((f) => ({ ...f, institution: false }))}
                                style={inputStyle('institution')}
                                autoComplete="organization"
                                disabled={loading}
                                aria-required="true"
                            />
                        </div>

                        {/* Error */}
                        {error && <div style={s.errorBox} role="alert">{error}</div>}

                        {/* Submit */}
                        <button
                            id="onboarding-submit-btn"
                            type="submit"
                            disabled={loading}
                            style={btnStyle}
                        >
                            {loading ? (
                                <>
                                    <div style={s.spinner} aria-hidden="true" />
                                    Saving…
                                </>
                            ) : (
                                'Continue to UpBring →'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default OnboardingPage;
