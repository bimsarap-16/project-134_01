import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const colors = {
    bg: '#0a0f1e',
    surface: 'rgba(30, 41, 59, 0.4)', border: 'rgba(255,255,255,0.08)',
    accent: '#3b82f6', accentHover: '#2563eb', accentGlow: 'rgba(59,130,246,0.3)',
    secondary: '#0ea5e9', secondaryHover: '#0284c7',
    text: '#F8FAFC', textMid: '#94A3B8', textMuted: '#64748B',
    inputBg: 'rgba(255,255,255,0.05)', inputText: '#fff', inputPlaceholder: 'rgba(255,255,255,0.4)',
    inputFocus: '#3b82f6',
    success: '#10b981', warning: '#f59e0b', error: '#ef4444'
};

export default function LoginPage() {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', otp: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [regStep, setRegStep] = useState(1); // 1: details, 2: otp

    const handleSubmit = async (e) => {
        if (loading) return;
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                await login(form.email, form.password);
            } else if (mode === 'register') {
                if (regStep === 1) {
                    // Password Validation
                    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                    if (!passwordRegex.test(form.password)) {
                        setError('Password must be at least 8 characters long and include: uppercase, lowercase, and number.');
                        setLoading(false);
                        return;
                    }
                    await authAPI.sendOTP(form.email);
                    setRegStep(2);
                } else {
                    await register(form.name, form.email, form.password, form.role, form.otp);
                }
            } else if (mode === 'forgot') {
                if (regStep === 1) {
                    await authAPI.forgotPassword(form.email);
                    setRegStep(2);
                } else {
                    await authAPI.resetPassword({ email: form.email, otp: form.otp, password: form.password });
                    setMode('login');
                    setRegStep(1);
                    setError('');
                    // Feedback to user
                    alert('Password reset successful! Please login with your new password.');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: colors.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif", padding: 20,
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background Liquid Blobs */}
            <div style={{ position: "fixed", top: "-15%", left: "-10%", width: "65%", height: "65%", background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0, animation: "float 12s infinite ease-in-out" }} />
            <div style={{ position: "fixed", bottom: "-20%", right: "-5%", width: "55%", height: "55%", background: "radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)", filter: "blur(120px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 18s infinite ease-in-out" }} />
            <div style={{ position: "fixed", top: "25%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0, animation: "float 14s infinite ease-in-out reverse" }} />
            <div style={{ position: "fixed", bottom: "10%", left: "5%", width: "35%", height: "35%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", filter: "blur(70px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 22s infinite ease-in-out" }} />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes float-alt { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(20px,20px); } }
                input:focus, select:focus { 
                    border-color: ${colors.inputFocus} !important; 
                    box-shadow: 0 0 10px ${colors.inputFocus}44 !important; 
                }
                input::placeholder { color: ${colors.inputPlaceholder}; opacity: 0.7; }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
                    20%, 40%, 60%, 80% { transform: translateX(6px); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div style={{
                width: '100%', maxWidth: 440,
                background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: 28, padding: '40px 36px', backdropFilter: 'blur(32px) saturate(200%)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
                animation: 'fadeIn 0.5s ease',
                position: 'relative', zIndex: 1
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: 20,
                        background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 30, margin: '0 auto 14px', boxShadow: `0 8px 32px rgba(59,130,246,0.3)`
                    }}>🎓</div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: colors.text, marginBottom: 6, letterSpacing: '-0.03em' }}>
                        QuizHub
                    </h1>
                    <p style={{ color: colors.textMid, fontSize: 14 }}>
                        {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>

                {/* Tab switcher */}
                {mode !== 'forgot' && (
                    <div style={{
                        display: 'flex', background: 'rgba(255,255,255,0.04)',
                        borderRadius: 14, padding: 4, marginBottom: 28, border: `1px solid ${colors.border}`
                    }}>
                        {['login', 'register'].map(m => (
                            <button key={m} type="button" onClick={() => { setMode(m); setError(''); setRegStep(1); }} style={{
                                flex: 1, padding: '10px', borderRadius: 11, border: 'none',
                                background: mode === m ? `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})` : 'transparent',
                                color: mode === m ? '#fff' : colors.textMid,
                                fontWeight: mode === m ? 700 : 500, fontSize: 14,
                                cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Calibri', sans-serif", boxShadow: mode === m ? `0 4px 16px ${colors.accent}33` : 'none'
                            }}>
                                {m === 'login' ? 'Sign In' : 'Register'}
                            </button>
                        ))}
                    </div>
                )}

                {mode === 'forgot' && (
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.text, textAlign: 'center', marginBottom: 24 }}>Reset Password</h2>
                )}

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        regStep === 1 ? (
                            <>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        Full Name
                                    </label>
                                    <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        Email Address
                                    </label>
                                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.edu" style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        Password
                                    </label>
                                    <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
                                    {mode === 'register' && form.password && (
                                        <div style={{ fontSize: 11, marginTop: 6, color: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password) ? '#10b981' : colors.textMid }}>
                                            {/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password)
                                                ? '✅ Strong password'
                                                : 'Must have 8+ chars, upper, lower, and number.'}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginBottom: 24 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        Role
                                    </label>
                                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle}>
                                        <option value="student">Student</option>
                                        <option value="lecturer">Lecturer</option>
                                    </select>
                                </div>
                            </>
                        ) : (
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ background: 'rgba(59,130,246,0.1)', padding: '14px', borderRadius: 12, marginBottom: 20, border: '1px solid rgba(59,130,246,0.2)' }}>
                                    <p style={{ margin: 0, fontSize: 13, color: colors.text, fontWeight: 600, textAlign: 'center' }}>
                                        📩 Verification code sent to {form.email}
                                    </p>
                                </div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                    Verification Code
                                </label>
                                <input type="text" required value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value }))} placeholder="6-digit code" maxLength="6" style={{ ...inputStyle, textAlign: 'center', fontSize: 20, letterSpacing: 4, fontWeight: 800 }} />
                                <button type="button" onClick={() => setRegStep(1)} style={{ background: 'none', border: 'none', color: colors.accent, fontSize: 12, marginTop: 10, cursor: 'pointer', fontWeight: 600 }}>← Back to details</button>
                            </div>
                        )
                    )}

                    {mode === 'login' && (
                        <>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                    Email Address
                                </label>
                                <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.edu" style={inputStyle} />
                            </div>
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: colors.textMid }}>
                                        Password
                                    </label>
                                    <span onClick={() => { setMode('forgot'); setRegStep(1); setError(''); }} style={{ fontSize: 12, color: colors.secondary, fontWeight: 600, cursor: 'pointer' }}>
                                        Forgot Password?
                                    </span>
                                </div>
                                <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
                            </div>
                        </>
                    )}

                    {mode === 'forgot' && (
                        regStep === 1 ? (
                            <div style={{ marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
                                <p style={{ color: colors.textMid, fontSize: 14, marginBottom: 20, textAlign: 'center' }}>
                                    No worries! Enter your email and we'll send you a password reset code.
                                </p>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        Email Address
                                    </label>
                                    <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.edu" style={inputStyle} />
                                </div>
                                <button type="button" onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: colors.textMid, fontSize: 12, cursor: 'pointer' }}>← Back to login</button>
                            </div>
                        ) : (
                            <div style={{ marginBottom: 24, animation: 'fadeIn 0.3s ease' }}>
                                <div style={{ background: 'rgba(59,130,246,0.1)', padding: '14px', borderRadius: 12, marginBottom: 20, border: '1px solid rgba(59,130,246,0.2)' }}>
                                    <p style={{ margin: 0, fontSize: 13, color: colors.text, fontWeight: 600, textAlign: 'center' }}>
                                        📩 Reset code sent to {form.email}
                                    </p>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        Verification Code
                                    </label>
                                    <input type="text" required value={form.otp} onChange={e => setForm(f => ({ ...f, otp: e.target.value }))} placeholder="6-digit code" maxLength="6" style={{ ...inputStyle, textAlign: 'center', fontSize: 20, letterSpacing: 4, fontWeight: 800 }} />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.textMid, marginBottom: 8 }}>
                                        New Password
                                    </label>
                                    <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" style={inputStyle} />
                                </div>
                                <button type="button" onClick={() => setRegStep(1)} style={{ background: 'none', border: 'none', color: colors.textMid, fontSize: 12, cursor: 'pointer' }}>← Change email</button>
                            </div>
                        )
                    )}

                    {error && (
                        <div style={{
                            background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)',
                            borderRadius: 12, padding: '12px 16px', marginBottom: 20,
                            color: '#f43f5e', fontSize: 13, fontWeight: 500,
                            animation: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both'
                        }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading || (mode === 'register' && regStep === 1 && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))} style={{
                        width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                        background: (loading || (mode === 'register' && regStep === 1 && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))) ? `${colors.accent}66` : `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})`,
                        color: '#fff', fontWeight: 800, fontSize: 16, cursor: (loading || (mode === 'register' && regStep === 1 && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(form.password))) ? 'not-allowed' : 'pointer',
                        fontFamily: "'Calibri', sans-serif", boxShadow: `0 4px 24px ${colors.accent}44`,
                        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                    }}>
                        {loading ? (
                            <>
                                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                {mode === 'login' ? 'Signing in...' : mode === 'register' ? (regStep === 1 ? 'Sending Code...' : 'Verifying...') : (regStep === 1 ? 'Sending Reset Code...' : 'Resetting Password...')}
                            </>
                        ) : (
                            mode === 'login' ? '🔑 Sign In' : mode === 'register' ? (regStep === 1 ? '📩 Send Verification Code' : '✅ Verify & Register') : (regStep === 1 ? '📩 Send Reset Code' : '🔐 Reset Password')
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: colors.textMid }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
                        style={{ color: colors.secondary, fontWeight: 700, cursor: 'pointer' }}>
                        {mode === 'login' ? 'Register here' : 'Sign in'}
                    </span>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: colors.inputBg, border: `1px solid ${colors.border}`,
    color: colors.inputText, fontSize: 14, outline: 'none', fontFamily: "'Calibri', sans-serif", transition: 'all 0.2s',
};
