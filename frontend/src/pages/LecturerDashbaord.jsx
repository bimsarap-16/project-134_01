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

// ─── Pages ────────────────────────────────────────────────────────────────────
const DashboardOverview = ({ modules, results, user, tickets = [] }) => {
    const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--text)", fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.01em" }}>Welcome Back, <span style={{ color: "var(--accent)" }}>{user?.name}</span></h1>
                <p style={{ margin: "6px 0 0", color: "var(--text-muted)", fontSize: 14 }}>Here's what's happening with your modules today.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 24 }}>
                <StatCard label="Modules Assigned" value={modules.length} icon="book" color="#60a5fa" />
                <StatCard label="Total Results" value={results.length} icon="results" color="#34d399" />
                <StatCard label="Avg. Score" value={results.length ? `${Math.round(results.reduce((a, b) => a + (b.score / b.totalMarks) * 100, 0) / results.length)}%` : "0%"} icon="chart" color="#fb923c" />
            </div>

            {/* Recent Tickets Section */}
            <div style={{ maxWidth: 800 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ background: "var(--accent)22", color: "var(--accent)", padding: 8, borderRadius: 10 }}>
                        <Icon d={Icons.ticket} size={20} />
                    </div>
                    <h3 style={{ margin: 0, color: "var(--text)", fontSize: 20, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Recent Tickets</h3>
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                    {recentTickets.length === 0 ? (
                        <div style={{ padding: "40px", textAlign: "center", background: "var(--glass)", borderRadius: 20, border: "1px solid var(--glassBorder)", backdropFilter: "blur(24px) saturate(180%)", borderStyle: "dashed" }}>
                            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>No support tickets found.</p>
                        </div>
                    ) : recentTickets.map(t => (
                        <div key={t._id} style={{ background: "var(--glass)", padding: "16px 20px", borderRadius: 18, border: "1px solid var(--glassBorder)", backdropFilter: "blur(24px) saturate(180%)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--card-nested)", display: "flex", alignItems: "center", justifyContent: "center", color: t.status === 'resolved' ? "#10b981" : "#fb923c", fontWeight: 800, fontSize: 14 }}>
                                    {t.studentId?.name?.charAt(0) || "S"}
                                </div>
                                <div>
                                    <h4 style={{ margin: "0 0 4px", fontSize: 15, color: "var(--text)", fontWeight: 700 }}>{t.subject}</h4>
                                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>From: {t.studentId?.name} • {new Date(t.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em", background: t.status === 'resolved' ? "#10b98115" : "#fb923c15", color: t.status === 'resolved' ? "#10b981" : "#fb923c", border: `1px solid ${t.status === 'resolved' ? "#10b98122" : "#fb923c22"}` }}>
                                {t.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AddPracticeQuiz = ({ toast, modules }) => {
    const [form, setForm] = useState({ moduleId: "", title: "", duration: "" });
    const [questions, setQuestions] = useState([newQuestion()]);
    const [loading, setLoading] = useState(false);

    const updateQ = (i, q) => setQuestions(qs => qs.map((x, xi) => xi === i ? q : x));
    const removeQ = (i) => setQuestions(qs => qs.filter((_, xi) => xi !== i));
    const addQ = () => setQuestions(qs => [...qs, newQuestion()]);

    const validate = () => {
        if (!form.moduleId || !form.title || !form.duration) { toast("Please fill all required fields.", "error"); return false; }
        if (parseInt(form.duration) <= 0) { toast("Duration must be a positive number.", "error"); return false; }
        if (questions.some(q => !q.questionText.trim())) { toast("All questions must have text.", "error"); return false; }
        return true;
    };

    const handlePublish = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await quizAPI.create({ ...form, quizType: "practice" });
            const quizId = res.data.data._id;
            // Sequential for simplicity or Promise.all
            for (const q of questions) {
                await questionAPI.create({ ...q, quizId });
            }
            toast("Practice quiz published successfully!");
            setForm({ moduleId: "", title: "", duration: "" });
            setQuestions([newQuestion()]);
        } catch (e) {
            toast(e.response?.data?.message || "Failed to publish quiz", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 860 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Add Practice Quiz</h1>
            <p style={{ margin: "0 0 32px", color: "var(--text-muted)", fontSize: 14 }}>Create a module-based practice quiz for students.</p>

            <div style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px", color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Quiz Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <FormField label="Select Module" required>
                        <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} style={selectStyle}>
                            <option value="">-- Choose Module --</option>
                            {modules.map(m => <option key={m._id} value={m._id}>{m.moduleName}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Quiz Title" required>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Week 4 Variables Quiz" style={inputStyle} />
                    </FormField>
                    <FormField label="Duration (minutes)" required>
                        <input type="number" min="1" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="30" style={inputStyle} />
                    </FormField>
                </div>
            </div>

            <div style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px", color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Questions ({questions.length})</h3>
                {questions.map((q, i) => <QuestionItem key={i} q={q} idx={i} onChange={updateQ} onRemove={removeQ} topics={modules.find(m => m._id === form.moduleId)?.topics || []} />)}
                <button onClick={addQ} style={{ width: "100%", padding: "14px", border: "2px dashed var(--border)", borderRadius: 16, background: "transparent", color: "var(--accent)", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Icon d={Icons.plus} size={18} /> Add Another Question
                </button>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
                <button onClick={handlePublish} disabled={loading} style={{ flex: 1, padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, var(--accent), #0891b2)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                    {loading ? "Publishing..." : "Publish Quiz →"}
                </button>
            </div>
        </div>
    );
};


const ManagePracticeQuizzes = ({ toast, modules }) => {
    const [selectedModule, setSelectedModule] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);

    useEffect(() => {
        if (!selectedModule) { setQuizzes([]); return; }
        const fetchQuizzes = async () => {
            setLoading(true);
            try {
                const res = await quizAPI.getByModule(selectedModule, { limit: 100 });
                const modQuizzes = res.data?.data?.data || res.data?.data || [];
                setQuizzes(modQuizzes.filter(q => q.quizType === "practice"));
            } catch (e) { toast("Failed to load quizzes", "error"); } finally { setLoading(false); }
        };
        fetchQuizzes();
    }, [selectedModule]);

    if (editingQuiz) return (
        <EditPracticeQuiz 
            quiz={editingQuiz} 
            modules={modules} 
            onBack={() => { setEditingQuiz(null); setSelectedModule(""); }} 
            toast={toast} 
        />
    );

    return (
        <div style={{ maxWidth: 860 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Manage Practice Quizzes</h1>
            <p style={{ margin: "0 0 24px", color: "var(--text-muted)", fontSize: 14 }}>Select a module to view and edit practice quizzes.</p>
            <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
                <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                    <option value="">-- Select Module --</option>
                    {modules.map(m => <option key={m._id} value={m._id}>{m.moduleName}</option>)}
                </select>
            </div>
            {loading ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {quizzes.length === 0 && selectedModule && <p style={{ color: "var(--text-muted)", background: "var(--card)", padding: 24, borderRadius: 16, textAlign: "center", border: "1px solid var(--border)" }}>No practice quizzes found for this module.</p>}
                    {quizzes.map(q => (
                        <div key={q._id} style={{ background: "var(--card)", padding: 20, borderRadius: 16, border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h4 style={{ margin: "0 0 4px", fontSize: 16, color: "var(--text)" }}>{q.title}</h4>
                                <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)" }}>Questions: {q.questionCount || 'N/A'}</p>
                            </div>
                            <button onClick={() => setEditingQuiz(q)} style={{ padding: "8px 16px", borderRadius: 10, border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", cursor: "pointer", fontWeight: 600 }}>Edit Quiz</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Edit Practice Quiz ────────────────────────────────────────────────────────
const EditPracticeQuiz = ({ quiz, modules, onBack, toast }) => {
    const [form, setForm] = useState({
        moduleId: quiz.moduleId?._id || quiz.moduleId,
        title: quiz.title,
        description: quiz.description || ""
    });
    const [questions, setQuestions] = useState([]);
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        const fetchQs = async () => {
            try {
                const res = await questionAPI.getByQuiz(quiz._id);
                setQuestions(res.data?.data || []);
            } catch (e) { toast("Failed to load questions", "error"); }
        };
        fetchQs();
    }, [quiz._id]);

    const updateQ = (i, q) => setQuestions(qs => qs.map((x, xi) => xi === i ? q : x));
    const removeQ = (i) => {
        const qToDelete = questions[i];
        if (qToDelete._id) setDeletedQuestions(prev => [...prev, qToDelete._id]);
        setQuestions(qs => qs.filter((_, xi) => xi !== i));
    };

    const validate = () => {
        if (!form.moduleId || !form.title) { toast("Please fill all required fields.", "error"); return false; }
        if (questions.some(q => !q.questionText.trim())) { toast("All questions must have text.", "error"); return false; }
        return true;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await quizAPI.update(quiz._id, { ...form, quizType: "practice" });
            for (const dqId of deletedQuestions) {
                await questionAPI.delete(dqId).catch(() => { });
            }
            for (const q of questions) {
                if (q._id) {
                    await questionAPI.update(q._id, q).catch(() => { });
                } else {
                    await questionAPI.create({ ...q, quizId: quiz._id }).catch(() => { });
                }
            }
            toast("Practice quiz updated successfully!");
            setModal(false);
            onBack();
        } catch (e) {
            toast(e.response?.data?.message || "Failed to update quiz", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: "100%", background: "var(--input)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", color: "var(--text)", fontSize: 14, fontFamily: "'Calibri', sans-serif" };
    const selectStyle = { ...inputStyle, cursor: "pointer" };

    return (
        <div style={{ maxWidth: 860 }}>
            <Modal open={modal} title="Save Changes?" message="Are you sure you want to save the modifications to this practice quiz?" onConfirm={handleSave} onCancel={() => setModal(false)} loading={loading} />
            <button onClick={onBack} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontWeight: 600 }}>← Back to Practice Quizzes</button>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Edit Practice Quiz: {quiz.title}</h1>
            
            <div style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px", color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Quiz Configuration</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <FormField label="Select Module" required>
                        <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} style={selectStyle}>
                            <option value="">-- Choose Module --</option>
                            {modules.map(m => <option key={m._id} value={m._id}>{m.moduleName}</option>)}
                        </select>
                    </FormField>
                    <FormField label="Quiz Title" required>
                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} />
                    </FormField>
                </div>
            </div>

            <div style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px", color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Questions ({questions.length})</h3>
                {questions.map((q, i) => <QuestionItem key={i} q={q} idx={i} onChange={updateQ} onRemove={removeQ} topics={modules.find(m => m._id === form.moduleId)?.topics || []} />)}
                <button onClick={() => setQuestions(qs => [...qs, { questionText: "", options: ["", "", "", ""], correctAnswer: 0, topic: "", explanation: "" }])} style={{ width: "100%", padding: "14px", border: "2px dashed var(--border)", borderRadius: 16, background: "transparent", color: "var(--accent)", cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Icon d={Icons.plus} size={18} /> Add Another Question
                </button>
            </div>

            <button onClick={() => setModal(true)} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, var(--accent), #2563eb)", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
                Save Changes →
            </button>
        </div>
    );
};

// ─── Profile Settings ─────────────────────────────────────────────────────────
const ProfileSettings = ({ toast, user }) => {
    const { setUser } = useAuth();
    const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email) return toast("Name and Email are required", "error");
        if (form.password && form.password.length < 8) return toast("Password must be at least 8 characters long", "error");
        if (form.password && form.password !== form.confirmPassword) return toast("Passwords do not match", "error");

        setLoading(true);
        try {
            const res = await userAPI.updateProfile(form);
            const updatedUser = res.data.data;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            toast("Profile updated successfully! ✨");
        } catch (err) {
            toast(err.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: "100%", background: "var(--input)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", color: "var(--text)", fontSize: 14, fontFamily: "'Calibri', sans-serif" };

    return (
        <div style={{ maxWidth: 640 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Profile Settings</h1>
            <p style={{ margin: "0 0 28px", color: "var(--text-muted)", fontSize: 14 }}>Manage your account details and security settings.</p>

            <form onSubmit={handleSubmit} style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Enter your full name" />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Email Address</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="Enter your email" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>New Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} placeholder="••••••••" />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Confirm Password</label>
                        <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={inputStyle} placeholder="••••••••" />
                    </div>
                </div>
                <button type="submit" disabled={loading} style={{ marginTop: 12, width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, var(--accent), #2563eb)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700 }}>
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};
 
// ─── Main App ─────────────────────────────────────────────────────────────────
export default function LecturerDashboard() {
    const { user, logout } = useAuth();
    const [page, setPage] = useState("dashboard");
    const [dark, setDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { toasts, add: toast } = useToasts();

    const [modules, setModules] = useState([]);
    const [results, setResults] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [modRes, resRes, tickRes] = await Promise.all([
                    moduleAPI.getAll({ limit: 100 }),
                    resultAPI.getAll({ limit: 100 }),
                    ticketAPI.getForLecturer()
                ]);
                const m = modRes?.data?.data?.data || [];
                const r = resRes?.data?.data?.data || [];
                const t = tickRes?.data?.data || [];
                setModules(m);
                setResults(r);
                setTickets(t);
            } catch (e) {
                toast("Failed to load dashboard data", "error");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page]);

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "practice", label: "Add Practice Quiz", icon: "practice" },
        { id: "exam", label: "Add Real Exam", icon: "exam" },
        { id: "manage", label: "Manage Exams", icon: "edit" },
        { id: "managePractice", label: "Manage practice Quiz", icon: "book" },
        { id: "announcements", label: "Announcements", icon: "bell" },
        { id: "tickets", label: "Tickets", icon: "ticket" },
        { id: "reports", label: "Exam Reports", icon: "chart" },
        { id: "profile", label: "Manage Profile", icon: "user" },
    ];

    const cssVars = dark ? {
        "--bg": "#0a0f1e", "--sidebar": "rgba(30, 41, 59, 0.8)", "--card": "rgba(15, 23, 42, 0.4)", "--card-nested": "rgba(15, 23, 42, 0.3)",
        "--border": "rgba(255, 255, 255, 0.06)", "--text": "#f8fafc", "--text-muted": "#94a3b8", "--input": "rgba(30, 41, 59, 0.6)", "--accent": accent,
        "--glass": "rgba(15, 23, 42, 0.4)", "--glassBorder": "rgba(255, 255, 255, 0.08)",
    } : {
        "--bg": "#f0f7ff", "--sidebar": "rgba(59, 130, 246, 0.85)", "--card": "rgba(255, 255, 255, 0.4)", "--card-nested": "rgba(241, 245, 249, 0.3)",
        "--border": "rgba(0,0,0,0.05)", "--text": "#0f172a", "--text-muted": "#64748b", "--input": "rgba(255, 255, 255, 0.6)", "--accent": "#3b82f6",
        "--glass": "rgba(255, 255, 255, 0.4)", "--glassBorder": "rgba(255, 255, 255, 0.5)",
    };

    if (loading) return (
        <div style={{ ...cssVars, background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p>Loading Dashboard...</p>
        </div>
    );

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
}