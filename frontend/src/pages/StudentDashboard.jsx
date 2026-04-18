import { useState, useEffect, useRef } from "react";
import {
    moduleAPI,
    quizAPI,
    questionAPI,
    attemptAPI,
    resultAPI,
    chatbotAPI,
    announcementAPI,
    userAPI,
    ticketAPI
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Chatbot from "../components/Chatbot";

const Icon = ({ name, size = 20 }) => {
    const icons = {
        dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
        practice: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
        trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="8 21 12 21 16 21" /><line x1="12" y1="17" x2="12" y2="21" /><path d="M7 4H17L17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11V4Z" /><path d="M5 9H3V7a2 2 0 0 1 2-2" /><path d="M19 9h2V7a2 2 0 0 0-2-2" /></svg>,
        search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
        bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
        sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /></svg>,
        moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
        check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>,
        x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
        chevronLeft: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>,
        chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>,
        send: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
        menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
        close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
        sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>,
        lightbulb: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></svg>,
        logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
        ticket: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5v2" /><path d="M15 11v2" /><path d="M15 17v2" /><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" /></svg>,
        clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    };
    return icons[name] || null;
};

export default function StudentDashboard() {
    const { user, setUser, logout } = useAuth();

    // your states
    const [dark, setDark] = useState(false);
    const [page, setPage] = useState("dashboard");
    const [modules, setModules] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [results, setResults] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [activeAttempt, setActiveAttempt] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState({});
    const [gradedResult, setGradedResult] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
    const [search, setSearch] = useState("");
    const [announcements, setAnnouncements] = useState([]);
    const [showAnnouncements, setShowAnnouncements] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [ticketForm, setTicketForm] = useState({ title: "", description: "", lecturerId: "" });
    const [ticketLoading, setTicketLoading] = useState(false);
    const [ticketFile, setTicketFile] = useState(null);
    const [settingsForm, setSettingsForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        confirmPassword: ""
    });
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [violations, setViolations] = useState(0);
    const [myTickets, setMyTickets] = useState([]);
    const [editingTicket, setEditingTicket] = useState(null);
    const [now, setNow] = useState(new Date());
    const [attemptHistory, setAttemptHistory] = useState([]);

    // you already have these helpers in your full file
    // keep your existing makeColors and showToast
    const colors = makeColors(dark);

    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    };

    const navigateTo = (p) => setPage(p);

    // ===============================
    // 2nd COMMIT — LOAD REAL EXAMS ONLY
    // ===============================
    useEffect(() => {
        if (page === "examList") {
            setPageLoading(true);

            quizAPI.getAll({
                quizType: "exam",
                limit: 100
            })
                .then((r) => setFilteredQuizzes(r.data.data.data || []))
                .catch(() => showToast("Failed to load real exams", "error"))
                .finally(() => setPageLoading(false));
        }
    }, [page]);
    // ===============================

    const sidebarLinks = [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "practiceList", label: "Practice Quizzes", icon: "practice" },
        { id: "examList", label: "Real Quizzes", icon: "trophy" },
        { id: "results", label: "Results", icon: "trophy" },
        { id: "ticket", label: "Raise Ticket", icon: "ticket" },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes float-alt { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(20px,20px); } }
            `}</style>

            <Toast {...toast} />

            <div
                style={{
                    minHeight: "100vh",
                    background: dark ? "#0a0f1e" : "#f0f7ff",
                    fontFamily: "'Outfit', sans-serif",
                    color: colors.text,
                    display: "flex",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                <div style={{ position: "fixed", top: "-15%", left: "-10%", width: "65%", height: "65%", background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0, animation: "float 12s infinite ease-in-out" }} />
                <div style={{ position: "fixed", bottom: "-20%", right: "-5%", width: "55%", height: "55%", background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", filter: "blur(120px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 18s infinite ease-in-out" }} />
                <div style={{ position: "fixed", top: "25%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0, animation: "float 14s infinite ease-in-out reverse" }} />
                <div style={{ position: "fixed", bottom: "10%", left: "5%", width: "35%", height: "35%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(70px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 22s infinite ease-in-out" }} />

                <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 1 }}>
                    {!(page === "practice" && selectedQuiz?.quizType === "exam") && (
                        <div style={{ width: 240, minHeight: "100vh", flexShrink: 0, background: colors.sidebarGlass, backdropFilter: "blur(24px) saturate(180%)", borderRight: `1px solid ${colors.glassBorder}`, display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100, boxShadow: "4px 0 32px rgba(0,0,0,0.1)" }}>
                            <div style={{ padding: "32px 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>Q</div>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>QuizHub</div>
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Student</div>
                                    </div>
                                </div>
                            </div>

                            <nav style={{ padding: "24px 12px", flex: 1 }}>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 800, padding: "0 14px", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>Menu</div>
                                {sidebarLinks.map((link) => (
                                    <div
                                        key={link.id}
                                        onClick={() => navigateTo(link.id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: "12px 14px",
                                            borderRadius: 12,
                                            marginBottom: 4,
                                            background: page === link.id ? "rgba(255,255,255,0.15)" : "transparent",
                                            color: "#fff",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                            fontWeight: page === link.id ? 700 : 500,
                                            fontSize: 14,
                                            opacity: page === link.id ? 1 : 0.85
                                        }}
                                    >
                                        <Icon name={link.icon} size={18} />
                                        {link.label}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    )}

                    <div style={{ flex: 1, marginLeft: (page === "practice" && selectedQuiz?.quizType === "exam") ? 0 : 240, minHeight: "100vh" }}>
                        {!(page === "practice" && selectedQuiz?.quizType === "exam") && (
                            <div style={{ position: "sticky", top: 0, zIndex: 50, background: colors.glass, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `1px solid ${colors.glassBorder}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>
                                    {page === "dashboard"
                                        ? "All Modules"
                                        : page === "practiceList"
                                        ? "Practice Quizzes"
                                        : page === "examList"
                                        ? "Real Quizzes"
                                        : page === "quizList"
                                        ? selectedModule?.moduleName || "Quizzes"
                                        : page === "practice"
                                        ? selectedQuiz?.title || "Practice"
                                        : page === "ticket"
                                        ? "Raise Ticket"
                                        : "Results"}
                                </div>
                            </div>
                        )}

                        {page === "dashboard" && renderDashboard()}
                        {page === "quizList" && renderQuizList()}
                        {page === "practice" && renderPractice()}
                        {page === "results" && renderResults()}
                        {page === "ticket" && renderRaiseTicket()}
                        {page === "practiceList" && renderFilteredQuizzes("practice")}
                        {page === "examList" && renderFilteredQuizzes("exam")}
                        {page === "settings" && renderSettings()}
                    </div>
                </div>
            </div>

            <Chatbot dark={dark} colors={makeColors(dark)} />
        </>
    );
}