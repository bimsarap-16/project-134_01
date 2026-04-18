import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#0a0f1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 20,
                fontFamily: "'Outfit', sans-serif",
                color: '#94a3b8',
                position: 'relative'
            }}>
                <div style={{ position: "fixed", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 50%)", zIndex: 0 }} />
                <div style={{
                    width: 56, height: 56,
                    border: '4px solid rgba(59,130,246,0.1)',
                    borderTopColor: '#3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                    zIndex: 1,
                    boxShadow: '0 0 30px rgba(59,130,246,0.2)'
                }} />
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '0.05em', zIndex: 1, textTransform: 'uppercase' }}>Loading QuizHub...</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) return <LoginPage />;

    // Route by role
    if (user.role === 'student') return <StudentDashboard />;
    if (user.role === 'lecturer') return <LecturerDashboard />;
    if (user.role === 'admin') return <AdminDashboard />;

    return (
        <div style={{
            minHeight: '100vh', background: '#0a0f1e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16, fontFamily: "'Outfit', sans-serif",
            color: '#94a3b8'
        }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🚧</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Unknown Role: {user.role}
            </div>
            <div style={{ fontSize: 14 }}>Please contact the QuizHub administrator.</div>
            <button
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                style={{ marginTop: 20, padding: '12px 32px', borderRadius: 14, background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 800, cursor: 'pointer', boxShadow: '0 8px 24px rgba(59,130,246,0.3)', transition: '0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
                Logout & Reset
            </button>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
