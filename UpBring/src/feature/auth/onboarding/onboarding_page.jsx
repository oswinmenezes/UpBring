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

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../../services/supabase_client';
import { extractResumeText } from '../../../services/ocr_service';
import { analyzeAndSaveProfile } from '../../../services/profileAnalysis';
import GitHubAuthButton from '../github_auth/auth_button';

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
    divider: {
        width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '20px 0',
    },
    resumeSection: {
        width: '100%', display: 'flex', flexDirection: 'column', gap: '12px',
    },
    resumeSectionLabel: {
        fontSize: '12px', fontWeight: '600',
        color: 'rgba(255,255,255,0.65)', letterSpacing: '0.2px',
        textTransform: 'uppercase',
    },
    resumeUploadBtn: {
        width: '100%', padding: '12px 16px',
        borderRadius: '12px', border: '1px solid rgba(99,102,241,0.35)',
        background: 'rgba(99,102,241,0.12)',
        color: '#a5b4fc', fontSize: '14px', fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    },
    resumeUploadBtnHover: {
        background: 'rgba(99,102,241,0.22)',
        borderColor: 'rgba(99,102,241,0.6)',
    },
    hiddenFileInput: { display: 'none' },
    resumeFileInfo: {
        padding: '10px 12px', borderRadius: '8px',
        background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
        color: '#86efac', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px',
    },
    dialogOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
    },
    dialog: {
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '400px', width: '90%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    },
    dialogSpinner: {
        width: '48px', height: '48px',
        border: '3px solid rgba(255,255,255,0.25)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 20px',
    },
    dialogTitle: {
        fontSize: '18px', fontWeight: '700', color: '#f1f5f9', margin: '0 0 8px',
    },
    dialogSubtitle: {
        fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0,
    },
    githubSuccessBox: {
        padding: '10px 14px', borderRadius: '10px',
        background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
        color: '#86efac', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
        justifyContent: 'center',
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
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({ fullName: '', institution: '' });
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeText, setResumeText] = useState(null);
    const [focused, setFocused] = useState({});
    const [loading, setLoading] = useState(false);
    const [resumeLoading, setResumeLoading] = useState(false);
    const [error, setError] = useState(null);
    const [resumeError, setResumeError] = useState(null);

    /**
     * Unified profile data combining form, resume, and GitHub data
     * Structure: {
     *   fullName: string,
     *   institution: string,
     *   resumeText: string | null,
     *   resumeFile: File | null,
     *   githubRepos: Array<{id, name, private, description, readme}>,
     *   githubAccessToken: string | null,
     * }
     */
    const [profileData, setProfileData] = useState({
        fullName: '',
        institution: '',
        resumeText: null,
        resumeFile: null,
        githubRepos: [],
        githubAccessToken: null,
    });

    // Load GitHub data from sessionStorage on component mount
    React.useEffect(() => {
        try {
            const storedRepos = sessionStorage.getItem('githubRepos');
            const storedToken = sessionStorage.getItem('githubAccessToken');
            
            if (storedRepos || storedToken) {
                setProfileData(prev => ({
                    ...prev,
                    githubRepos: storedRepos ? JSON.parse(storedRepos) : [],
                    githubAccessToken: storedToken || null,
                }));
            }
        } catch (err) {
            console.error('Error loading GitHub data from sessionStorage:', err);
        }
    }, []);

    /** Update a single field in form state */
    const handleChange = (field) => (e) => {
        const value = e.target.value;
        setForm((prev) => ({ ...prev, [field]: value }));
        setProfileData((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    /**
     * Submit handler.
     * Persists profile data to Supabase user metadata, sends data to Gemini for analysis,
     * and marks the user as onboarded so this page is skipped on future sign-ins.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullName    = form.fullName.trim();
        const institution = form.institution.trim();

        if (!fullName) { setError('Please enter your full name.'); return; }
        if (!institution) { setError('Please enter your institution or organisation.'); return; }

        setLoading(true);
        setError(null);

        try {
            // First, update Supabase with basic profile data
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

            // Analyze profile and save results to Supabase
            const analysisResult = await analyzeAndSaveProfile({
                fullName,
                institution,
                resumeText: profileData.resumeText,
                githubRepos: profileData.githubRepos,
            });

            // Store the analysis result in sessionStorage for later use
            if (analysisResult) {
                sessionStorage.setItem('candidateAnalysis', JSON.stringify(analysisResult));
                console.log('Onboarding successful. Analysis saved to session.');
            }

            // Clear GitHub data from sessionStorage after successful submission
            sessionStorage.removeItem('githubRepos');
            sessionStorage.removeItem('githubAccessToken');

            // Success — head to the app
            navigate('/', { replace: true });

        } catch (err) {
            console.error('Error during onboarding submission:', err);
            
            // Handle specific Gemini API errors
            if (err.message === 'API_LIMIT') {
                setError('API rate limit exceeded. Please wait a moment and try again.');
            } else if (err.message?.includes('Could not save')) {
                setError('Could not save your profile analysis. Please try again.');
            } else {
                setError(err.message || 'An error occurred. Please try again.');
            }
            setLoading(false);
        }
    };

    /** Handle resume file selection */
    const handleResumeFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setResumeError(null);
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setResumeError('Invalid file type. Please upload: JPG, PNG, GIF, BMP, or WebP');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setResumeError('File size exceeds 10MB limit. Please choose a smaller file.');
            return;
        }

        setResumeFile(file);
        setProfileData((prev) => ({ ...prev, resumeFile: file }));
    };

    /** Handle resume extraction */
    const handleExtractResume = async () => {
        if (!resumeFile) return;

        setResumeLoading(true);
        setResumeError(null);

        try {
            const result = await extractResumeText(resumeFile);
            setResumeText(result.extractedText);
            setProfileData((prev) => ({ ...prev, resumeText: result.extractedText }));
            console.log('Extracted Resume Text:', result.extractedText);
            console.log('Updated Profile Data:', { ...profileData, resumeText: result.extractedText });
        } catch (err) {
            console.error('Error extracting resume:', err);
            setResumeError(err.message || 'Failed to extract text from resume.');
        } finally {
            setResumeLoading(false);
        }
    };

    /** Clear resume */
    const handleClearResume = () => {
        setResumeFile(null);
        setResumeText(null);
        setResumeError(null);
        setProfileData((prev) => ({ ...prev, resumeFile: null, resumeText: null }));
        if (fileInputRef.current) fileInputRef.current.value = '';
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
                        <span>✦</span> Step 1 of 1 — Complete Your Profile
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
                            width: (form.fullName && form.institution && resumeText) ? '100%' : (form.fullName && form.institution) ? '75%' : form.fullName ? '40%' : '20%',
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

                        {/* GitHub Auth Button */}
                        <div style={{ width: '100%', marginBottom: '20px' }}>
                            <GitHubAuthButton />
                        </div>

                        {/* GitHub Connected Success Message */}
                        {profileData.githubRepos && profileData.githubRepos.length > 0 && (
                            <div style={s.githubSuccessBox}>
                                ✓ GitHub connected ({profileData.githubRepos.length} repos)
                            </div>
                        )}

                        {/* Resume Upload Section */}
                        <div style={s.divider} />
                        <div style={s.resumeSection}>
                            <div style={s.resumeSectionLabel}>📄 Resume OCR (Optional)</div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={s.resumeUploadBtn}
                                disabled={loading || resumeLoading}
                                onMouseEnter={(e) => {
                                    if (!loading && !resumeLoading) {
                                        Object.assign(e.target.style, s.resumeUploadBtnHover);
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    Object.assign(e.target.style, {
                                        background: s.resumeUploadBtn.background,
                                        borderColor: s.resumeUploadBtn.borderColor,
                                    });
                                }}
                            >
                                {resumeLoading ? (
                                    <>
                                        <div style={s.spinner} />
                                        Extracting...
                                    </>
                                ) : resumeFile ? (
                                    <>📤 {resumeFile.name.slice(0, 20)}...</>
                                ) : (
                                    <>📤 Upload Resume</>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                style={s.hiddenFileInput}
                                onChange={handleResumeFileChange}
                                accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
                                aria-hidden="true"
                                disabled={loading || resumeLoading}
                            />
                            {resumeFile && (
                                <button
                                    type="button"
                                    onClick={handleExtractResume}
                                    disabled={loading || resumeLoading}
                                    style={{
                                        ...s.submitBtn,
                                        marginTop: '0',
                                        width: '100%',
                                        background: 'rgba(99,102,241,0.3)',
                                        opacity: resumeLoading ? 0.6 : 1,
                                        cursor: resumeLoading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {resumeLoading ? 'Extracting...' : '✨ Extract Text'}
                                </button>
                            )}
                            {resumeFile && (
                                <button
                                    type="button"
                                    onClick={handleClearResume}
                                    disabled={loading || resumeLoading}
                                    style={{
                                        ...s.resumeUploadBtn,
                                        background: 'rgba(239,68,68,0.12)',
                                        borderColor: 'rgba(239,68,68,0.35)',
                                        color: '#fca5a5',
                                    }}
                                >
                                    ✕ Clear Resume
                                </button>
                            )}
                            {resumeText && (
                                <div style={s.resumeFileInfo}>
                                    ✓ Text extracted successfully!
                                </div>
                            )}
                            {resumeError && (
                                <div style={s.errorBox}>{resumeError}</div>
                            )}
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

            {/* Loading Dialog */}
            {loading && (
                <div style={s.dialogOverlay}>
                    <div style={s.dialog}>
                        <div style={s.dialogSpinner} aria-hidden="true" />
                        <h2 style={s.dialogTitle}>Analyzing Your Profile</h2>
                        <p style={s.dialogSubtitle}>Processing your resume and GitHub data...</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default OnboardingPage;
