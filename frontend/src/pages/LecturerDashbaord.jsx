import { useState, useEffect } from "react";
import { moduleAPI, quizAPI, questionAPI, resultAPI, announcementAPI, ticketAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─── Icons (inline SVG components) ───────────────────────────────────────────
const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none", strokeWidth = 1.8 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
    </svg>
);

const Icons = {
    dashboard: ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"],
    practice: ["M12 2L2 7l10 5 10-5-10-5", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
    exam: ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"],
    results: ["M18 20V10", "M12 20V4", "M6 20v-6"],
    bell: ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
    user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
    logout: ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"],
    plus: "M12 5v14M5 12h14",
    trash: ["M3 6h18", "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"],
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    download: ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"],
    search: ["M11 17.25A6.25 6.25 0 1117.25 11 6.26 6.26 0 0111 17.25z", "M16 16l3.5 3.5"],
    calendar: ["M8 2v4", "M16 2v4", "M3 8h18", "rect x=3 y=4 width=18 height=18 rx=2"],
    clock: ["M12 2a10 10 0 100 20 10 10 0 000-20z", "M12 6v6l4 2"],
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    warning: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
    book: ["M4 19.5A2.5 2.5 0 016.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
    menu: "M3 12h18M3 6h18M3 18h18",
    chart: ["M3 3v18h18", "M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"],
    moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    sun: ["M12 2v2", "M12 20v2", "M4.93 4.93l1.41 1.41", "M17.66 17.66l1.41 1.41", "M2 12h2", "M20 12h2", "M6.34 17.66l-1.41 1.41", "M19.07 4.93l-1.41 1.41", "M12 8a4 4 0 100 8 4 4 0 000-8z"],
    chevronDown: "M6 9l6 6 6-6",
    eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
    edit: ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
    layers: ["M12 2L2 7l10 5 10-5-10-5", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
    ticket: ["M15 5v2", "M15 11v2", "M15 17v2", "M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"],
};

const accent = "#3b82f6";

const ManageTickets = ({ toast }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responseTexts, setResponseTexts] = useState({});
    const [submitting, setSubmitting] = useState(null);

    const fetchTickets = async () => {
    setLoading(true);
    try {
        const res = await ticketAPI.getForLecturer();
        setTickets(res.data.data);
    } catch (e) {
        toast("Failed to load tickets", "error");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchTickets();
}, []);
const handleResponse = async (id) => {
    if (!responseTexts[id]) return toast("Response cannot be empty", "error");

    setSubmitting(id);
    try {
        await ticketAPI.respond(id, { response: responseTexts[id] });
        toast("Response sent & ticket resolved!", "success");
        fetchTickets();
    } catch (e) {
        toast("Failed to send response", "error");
    } finally {
        setSubmitting(null);
    }
};
if (loading) {
    return (
        <p style={{ color: "var(--text-muted)", padding: 32 }}>
            Loading tickets...
        </p>
    );
}
return (
    <div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>
            Student Tickets
        </h1>

        <p style={{ margin: "0 0 28px", fontSize: 14 }}>
            View tickets and issues raised directly to you from students.
        </p>

        {tickets.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center" }}>
                <p>No tickets assigned to you yet.</p>
            </div>
        ) : (
            <div>
                {/* ticket list comes next */}
            </div>
        )}
    </div>
);
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {tickets.map(t => (
        <div key={t._id}>
            <h3>{t.title}</h3>

            <span>{t.status}</span>

            <p>{t.description}</p>

            <div>
                <span>From: {t.studentId?.name}</span>
                <span>{new Date(t.createdAt).toLocaleString()}</span>
            </div>
        </div>
    ))}
</div>
{t.fileUrl && (
    <div>
        <a
            href={`http://localhost:5000${t.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            📎 View Attachment ({t.fileName})
        </a>
    </div>
)}
};

const ResultsAnalysis = ({ results, modules }) => {
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("");

 return (
        <div style={{ ...cssVars, position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--text)", overflow: "hidden", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes float-alt { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(20px,20px); } }
            `}</style>
            <Toast toasts={toasts} />
            
            {/* Background Blobs */}
            <div style={{ position: "fixed", top: "-15%", left: "-10%", width: "65%", height: "65%", background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0, animation: "float 12s infinite ease-in-out" }} />
            <div style={{ position: "fixed", bottom: "-20%", right: "-5%", width: "55%", height: "55%", background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", filter: "blur(120px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 18s infinite ease-in-out" }} />
            <div style={{ position: "fixed", top: "25%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0, animation: "float 14s infinite ease-in-out reverse" }} />
            <div style={{ position: "fixed", bottom: "10%", left: "5%", width: "35%", height: "35%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(70px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 22s infinite ease-in-out" }} />

            <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 1, minHeight: "100vh" }}>

                {/* Sidebar */}
                <div style={{ width: sidebarOpen ? 256 : 72, background: "var(--sidebar)", backdropFilter: "blur(24px) saturate(180%)", borderRight: "1px solid var(--glassBorder)", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", position: "relative", zIndex: 10, boxShadow: "4px 0 32px rgba(0,0,0,0.1)" }}>
                    <div style={{ padding: "32px 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#3b82f6", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0 }}>Q</div>
                        {sidebarOpen && (
                            <div style={{ animation: "fadeIn 0.3s ease both" }}>
                                <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>QuizHub</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Lecturer</div>
                            </div>
                        )}
                    </div>

                    <nav style={{ padding: "24px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                        {sidebarOpen && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 800, padding: "0 14px", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>Menu</div>}
                        {navItems.map(item => (
                            <button key={item.id} onClick={() => setPage(item.id)} style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 14, border: "none", cursor: "pointer",
                                background: page === item.id ? "rgba(255,255,255,0.15)" : "transparent", color: "#fff",
                                fontWeight: page === item.id ? 700 : 500, fontSize: 14, transition: "0.2s",
                                width: "100%", textAlign: "left", opacity: page === item.id ? 1 : 0.85
                            }}>
                                <Icon d={Icons[item.icon]} size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <header style={{ height: 64, borderBottom: "1px solid var(--border)", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--glass)", backdropFilter: "blur(20px) saturate(180%)", position: "sticky", top: 0, zIndex: 50 }}>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                            <Icon d={Icons.menu} size={22} />
                        </button>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button onClick={() => setPage("profile")} style={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text-muted)", padding: 8, cursor: "pointer" }}>
                                <Icon d={Icons.user} size={18} />
                            </button>
                            <button onClick={logout} style={{ borderRadius: 10, border: "none", background: "#f8717122", color: "#f87171", padding: 8, cursor: "pointer" }}>
                                <Icon d={Icons.logout} size={18} />
                            </button>
                        </div>
                    </header>

                    <main style={{ padding: 32 }}>
                        {page === "dashboard" && <DashboardOverview modules={modules} results={results} user={user} tickets={tickets} />}
                        {page === "practice" && <AddPracticeQuiz toast={toast} modules={modules} />}
                        {page === "exam" && <AddExamQuiz toast={toast} modules={modules} />}
                        {page === "manage" && <ManageExams toast={toast} modules={modules} />}
                        {page === "managePractice" && <ManagePracticeQuizzes toast={toast} modules={modules} />}
                        {page === "announcements" && <AddAnnouncement toast={toast} modules={modules} user={user} />}
                        {page === "tickets" && <ManageTickets toast={toast} />}
                        {page === "reports" && <ExamReports modules={modules} toast={toast} />}
                        {page === "profile" && <ProfileSettings toast={toast} user={user} />}
                    </main>
                </div>
            </div>
        </div>
    );
