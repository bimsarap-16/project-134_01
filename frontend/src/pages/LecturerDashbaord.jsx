import { useState, useEffect } from "react";
import { quizAPI, questionAPI } from "../services/api";
// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const BarChart = ({ data, label }) => {
    const max = Math.max(...(data.length ? data.map(d => d.v) : [1]));
    return (
        <div style={{ padding: "24px 28px", background: "var(--glass)", borderRadius: 24, border: "1px solid var(--glassBorder)", backdropFilter: "blur(24px) saturate(180%)", boxShadow: "0 8px 32px rgba(0,0,0,0.02)" }}>
            <p style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 120 }}>
                {data.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ width: "100%", background: `linear-gradient(180deg, ${d.c}, ${d.c}88)`, borderRadius: "6px 6px 0 0", height: `${(d.v / max) * 100}%`, minHeight: 4, transition: "height 0.8s ease" }} />
                        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{d.l}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Score Distribution ───────────────────────────────────────────────────────
const ScoreDistChart = ({ results }) => {
    const ranges = [
        { label: "0–40", color: "#f87171" },
        { label: "41–60", color: "#fb923c" },
        { label: "61–75", color: "#fbbf24" },
        { label: "76–90", color: "#34d399" },
        { label: "91–100", color: "#60a5fa" },
    ];
    const counts = ranges.map((r, i) => {
        const [lo, hi] = r.label.split("–").map(Number);
        return results.filter(s => {
            const pct = (s.score / s.totalMarks) * 100;
            return pct >= lo && pct <= hi;
        }).length;
    });
    const max = Math.max(...counts) || 1;
    return (
        <div style={{ padding: "24px 28px", background: "var(--glass)", borderRadius: 24, border: "1px solid var(--glassBorder)", backdropFilter: "blur(24px) saturate(180%)" }}>
            <p style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Score Distribution</p>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 100 }}>
                {ranges.map((r, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>{counts[i]}</span>
                        <div style={{ width: "100%", background: r.color, borderRadius: "6px 6px 0 0", height: `${(counts[i] / max) * 80}px`, minHeight: counts[i] > 0 ? 6 : 0, transition: "height 0.8s ease" }} />
                        <span style={{ fontSize: 9, color: "var(--text-muted)", fontWeight: 600 }}>{r.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ─── Pie Chart Component ─────────────────────────────────────────────────────
const PieChart = ({ percentage, color, size = 50 }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} viewBox="0 0 60 60" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="30" cy="30" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
                <circle cx="30" cy="30" r={radius} fill="none" stroke={color} strokeWidth="8"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "var(--text)" }}>
                {Math.round(percentage)}%
            </div>
        </div>
    );
};

const MultiSlicePieChart = ({ data, size = 160 }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    if (total === 0) return <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text-muted)" }}>No Data</div>;

    let current = 0;
    const slices = data.map((d) => {
        const start = current;
        const width = (d.value / total) * 100;
        current += width;
        return `${d.color} ${start}% ${current}%`;
    }).join(", ");

    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `conic-gradient(${slices})`, transform: "rotate(-90deg)", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }} />
            <div style={{ position: "absolute", inset: "25%", background: "var(--card)", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{total}</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>Total Correct</span>
            </div>
        </div>
    );
};

// -------------------- Helpers --------------------
const newQuestion = () => ({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    topic: "",
    marks: 5,
    explanation: "",
});

const inputStyle = {
    width: "100%",
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#111827",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
};

const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
};


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
if (loading) 
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
             tickets.map((t) => (
                    <div key={t._id} style={{ marginBottom: 20, padding: 16, border: "1px solid #ccc" }}>
                        
                        <h3>{t.title}</h3>
                        <p>{t.description}</p>

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
{t.status === "open" ? (
    <div>
        <textarea
            value={responseTexts[t._id] || ""}
            onChange={e =>
                setResponseTexts({
                    ...responseTexts,
                    [t._id]: e.target.value
                })
            }
            placeholder="Type your response here..."
        />

        <button
            onClick={() => handleResponse(t._id)}
            disabled={submitting === t._id}
        >
            {submitting === t._id ? "Sending..." : "Send Response"}
        </button>
    </div>
) : (
    <div>
        <p>Resolved response shown below</p>
        <p>{t.response}</p>
    </div>
)}
             
             </div>

             ))
            )}
            </div>
);
////results my part
    const ResultsAnalysis = ({ results, modules }) => {
    const [search, setSearch] = useState("");
    const [moduleFilter, setModuleFilter] = useState("");

    const filtered = (results || []).filter(r =>
        (!moduleFilter || r?.quizId?.moduleId?._id === moduleFilter) &&
        (!search || (r?.studentId?.name || "").toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Results Analysis</h1>
            <p style={{ margin: "0 0 28px", color: "var(--text-muted)", fontSize: 14 }}>Analyze student performance across modules and quizzes.</p>

            <div style={{ background: "var(--card)", borderRadius: 24, padding: 28, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." style={{ ...inputStyle, flex: 1 }} />
                    <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                        <option value="">All Modules</option>
                        {modules.map(m => <option key={m._id} value={m._id}>{m.moduleCode}</option>)}
                    </select>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                {["Student", "Module", "Quiz", "Score", "%", "Status"].map(h => (
                                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((r, i) => {
                                const pct = Math.round((r.score / r.totalMarks) * 100);
                                return (
                                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "12px 14px", color: "var(--text)", fontWeight: 600 }}>{r.studentId?.name}</td>
                                        <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{r.quizId?.moduleId?.moduleCode}</td>
                                        <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{r.quizId?.title}</td>
                                        <td style={{ padding: "12px 14px", color: "var(--text)" }}>{r.score}/{r.totalMarks}</td>
                                        <td style={{ padding: "12px 14px", fontWeight: 700, color: pct >= 50 ? "#34d399" : "#f87171" }}>{pct}%</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, background: r.autoSubmitted ? "#fbbf2422" : "#34d39922", color: r.autoSubmitted ? "#fbbf24" : "#34d399" }}>
                                                {r.autoSubmitted ? "Auto" : "Normal"}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ─── Manage Tickets ───────────────────────────────────────────────────────────
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

    useEffect(() => {
        fetchTickets();
    }, []);

    if (loading) return <p style={{ color: "var(--text-muted)", padding: 32 }}>Loading tickets...</p>;

    return (
        <div>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Student Tickets</h1>
            <p style={{ margin: "0 0 28px", color: "var(--text-muted)", fontSize: 14 }}>View tickets and issues raised directly to you from students.</p>
            {tickets.length === 0 ? (
                <div style={{ background: "var(--card)", padding: 32, borderRadius: 24, textAlign: "center", border: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: 15 }}>No tickets assigned to you yet.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {tickets.map(t => (
                        <div key={t._id} style={{ background: "var(--card)", padding: 24, borderRadius: 16, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h3 style={{ margin: 0, fontSize: 18, color: "var(--text)" }}>{t.title}</h3>
                                <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, background: t.status === "open" ? "#3b82f622" : "#10b98122", color: t.status === "open" ? "#3b82f6" : "#10b981", fontWeight: 700, textTransform: "uppercase" }}>{t.status}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>{t.description}</p>
                            <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
                                <span>From: <strong style={{ color: "var(--text)" }}>{t.studentId?.name}</strong></span>
                                <span>|</span>
                                <span>{new Date(t.createdAt).toLocaleString()}</span>
                            </div>
                            {t.fileUrl && (
                                <div style={{ marginTop: 8 }}>
                                    <a href={`http://localhost:5000${t.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                        📎 View Attachment ({t.fileName})
                                    </a>
                                </div>
                            )}

                            {t.status === "open" ? (
                                <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                                    <p style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.05em" }}>SUBMIT RESPONSE</p>
                                    <textarea
                                        value={responseTexts[t._id] || ""}
                                        onChange={e => setResponseTexts({ ...responseTexts, [t._id]: e.target.value })}
                                        placeholder="Type your response here to help the student..."
                                        style={{ width: "100%", minHeight: 120, padding: "14px 18px", borderRadius: 14, background: "var(--card-nested)", border: "1px solid var(--border)", borderLeft: `4px solid ${accent}`, color: "var(--text)", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "'Calibri', sans-serif" }}
                                    />
                                    <button
                                        onClick={() => handleResponse(t._id)}
                                        disabled={submitting === t._id}
                                        style={{ marginTop: 12, width: "100%", padding: "12px", borderRadius: 12, background: accent, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: (submitting === t._id) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "0.2s" }}
                                    >
                                        <Icon d={Icons.send} size={16} stroke="#fff" />
                                        {submitting === t._id ? "Sending..." : "Send Response & Resolve"}
                                    </button>
                                </div>
                            ) : (
                                <div style={{ marginTop: 16, padding: "20px", background: "var(--glass)", borderRadius: 24, border: "1px solid var(--glassBorder)", backdropFilter: "blur(24px) saturate(180%)", boxShadow: "0 8px 32px rgba(0,0,0,0.03)", animation: "fadeIn 0.3s ease" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "#10b981", display: "flex", alignItems: "center", gap: 8 }}>
                                            <Icon d={Icons.check} size={14} stroke="#10b981" /> THE RESPONSE
                                        </p>
                                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>Resolved on {new Date(t.respondedAt).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 14, color: "var(--text)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.response}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// ─── Exam Reports ─────────────────────────────────────────────────────────────
const ExamReports = ({ modules, toast }) => {
    const [selectedModule, setSelectedModule] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedModule) return;
        const fetchQuizzes = async () => {
            try {
                const res = await quizAPI.getByModule(selectedModule);
                const modQuizzes = res.data?.data?.data || res.data?.data || [];
                setQuizzes(modQuizzes.filter(q => q.quizType === 'exam'));
            } catch (e) {
                toast("Failed to load quizzes", "error");
            }
        };
        fetchQuizzes();
        setSelectedQuiz("");
        setReport(null);
    }, [selectedModule]);

    useEffect(() => {
        if (!selectedQuiz) return;
        const fetchReport = async () => {
            setLoading(true);
            try {
                const res = await resultAPI.getReport(selectedQuiz);
                setReport(res.data?.data);
            } catch (e) {
                toast("Failed to load report", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [selectedQuiz]);

    return (
        <div>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Real Exam Reports</h1>
            <p style={{ margin: "0 0 28px", color: "var(--text-muted)", fontSize: 14 }}>View detailed module-wise reports and student rankings for real exams.</p>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)} style={{ ...selectStyle, flex: 1 }}>
                    <option value="">-- Select Module --</option>
                    {modules.map(m => <option key={m._id} value={m._id}>{m.moduleCode} - {m.moduleName}</option>)}
                </select>
                <select value={selectedQuiz} onChange={e => setSelectedQuiz(e.target.value)} disabled={!selectedModule} style={{ ...selectStyle, flex: 1 }}>
                    <option value="">-- Select Exam --</option>
                    {quizzes.map(q => <option key={q._id} value={q._id}>{q.title}</option>)}
                </select>
            </div>

            {loading && <p style={{ color: "var(--text-muted)" }}>Loading report data...</p>}

            {!loading && report && !report.attempts?.length && (
                <div style={{ background: "var(--card)", padding: 32, borderRadius: 24, textAlign: "center", border: "1px solid var(--border)" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: 15 }}>No attempts found for this exam yet.</p>
                </div>
            )}

            {!loading && report && report.attempts?.length > 0 && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 24 }}>
                        <StatCard label="Total Attempts" value={report.aggregate.totalAttempts} icon="users" color="#60a5fa" />
                        <StatCard label="Pass Rate" value={`${report.aggregate.passRate}%`} icon="check" color="#34d399" />
                        <StatCard label="Fail Rate" value={`${report.aggregate.failRate}%`} icon="x" color="#f87171" />
                    </div>

                    <div style={{ padding: "24px 28px", background: "var(--glass)", borderRadius: 24, border: "1px solid var(--glassBorder)", backdropFilter: "blur(24px) saturate(180%)", marginBottom: 24 }}>
                        <p style={{ margin: "0 0 20px", fontSize: 14, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Grade Distribution</p>
                        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 120 }}>
                            {Object.entries(report.aggregate.gradeDistribution).map(([grade, count], i) => {
                                const max = Math.max(...Object.values(report.aggregate.gradeDistribution)) || 1;
                                const heightPct = (count / max) * 100;
                                const color = ["#10b981", "#34d399", "#6ee7b7", "#3b82f6", "#60a5fa", "#93c5fd", "#f59e0b", "#fbbf24", "#ef4444"][i];
                                return (
                                    <div key={grade} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                        <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>{count}</span>
                                        <div style={{ width: "100%", background: color, borderRadius: "6px 6px 0 0", height: `${heightPct}%`, minHeight: count > 0 ? 6 : 0, transition: "height 0.8s ease" }} />
                                        <span style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 600 }}>{grade}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ background: "var(--card)", borderRadius: 24, padding: 28, border: "1px solid var(--border)", overflowX: "auto" }}>
                        <h3 style={{ margin: "0 0 20px", color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>Student Ranking based on Marks</h3>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    {["Rank", "Student", "Answered", "Correct", "Wrong", "Score", "%", "Grade", "Status"].map(h => (
                                        <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {report.attempts.map((att, i) => (
                                    <tr key={att.attemptId} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "12px 14px", fontWeight: 800, color: att.rank === 1 ? "#fbbf24" : att.rank === 2 ? "#94a3b8" : att.rank === 3 ? "#b45309" : "var(--text-muted)" }}>
                                            #{att.rank}
                                        </td>
                                        <td style={{ padding: "12px 14px", color: "var(--text)", fontWeight: 600 }}>{att.studentId?.name || "Unknown"}</td>
                                        <td style={{ padding: "12px 14px", color: "var(--text-muted)" }}>{att.answeredCount}/{att.totalQuestions}</td>
                                        <td style={{ padding: "12px 14px", color: "#34d399", fontWeight: 600 }}>{att.correctCount} ({att.answeredCount ? Math.round((att.correctCount / att.answeredCount) * 100) : 0}%)</td>
                                        <td style={{ padding: "12px 14px", color: "#f87171", fontWeight: 600 }}>{att.wrongCount} ({att.answeredCount ? Math.round((att.wrongCount / att.answeredCount) * 100) : 0}%)</td>
                                        <td style={{ padding: "12px 14px", color: "var(--text)", fontWeight: 700 }}>{att.score}/{att.totalMarks}</td>
                                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text)" }}>{att.percentage}%</td>
                                        <td style={{ padding: "12px 14px", fontWeight: 800, color: att.isPass ? "#10b981" : "#ef4444" }}>{att.grade}</td>
                                        <td style={{ padding: "12px 14px" }}>
                                            <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, background: att.isPass ? "#34d39922" : "#f8717122", color: att.isPass ? "#34d399" : "#f87171", fontWeight: 700 }}>
                                                {att.isPass ? "PASS" : "FAIL"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {report.aggregate.topicStats && report.aggregate.topicStats.length > 0 && (
                        <div style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", marginTop: 24 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                                <h3 style={{ margin: 0, color: "var(--text)", fontSize: 20, fontWeight: 800, fontFamily: "'Calibri', sans-serif" }}>Lecture Topic Analysis</h3>
                                <div style={{ fontSize: 12, background: "var(--border)", color: "var(--text-muted)", padding: "4px 12px", borderRadius: 20, fontWeight: 700 }}>{report.aggregate.topicStats.length} TOPICS COVERED</div>
                            </div>
                            
                            <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap", justifyContent: "center", padding: "20px 0" }}>
                                <MultiSlicePieChart 
                                    data={report.aggregate.topicStats.map((ts, i) => ({
                                        label: ts.topic,
                                        value: ts.correctAnswers,
                                        color: ["#3b82f6", "#0ea5e9", "#14b8a6", "#2dd4bf", "#60a5fa", "#06b6d4", "#0891b2"][i % 7]
                                    }))} 
                                    size={180} 
                                />

                                <div style={{ flex: 1, minWidth: 300 }}>
                                    <div style={{ display: "grid", gap: 12 }}>
                                        {report.aggregate.topicStats.map((ts, i) => {
                                            const color = ["#3b82f6", "#0ea5e9", "#14b8a6", "#2dd4bf", "#60a5fa", "#06b6d4", "#0891b2"][i % 7];
                                            return (
                                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--card-nested)", borderRadius: 12, border: "1px solid var(--border)" }}>
                                                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }} />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{ts.topic}</span>
                                                            <span style={{ fontSize: 13, fontWeight: 800, color }}>{ts.percentage}% Success</span>
                                                        </div>
                                                        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                                                            <span>Questions: {ts.totalQuestions}</span>
                                                            <span>•</span>
                                                            <span>Correct: {ts.correctAnswers}</span>
                                                            <span>•</span>
                                                            <span>Attempts: {ts.totalAttempts}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                </>
            )}
        </div>
    );
};

///end results analysis
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



const QuestionItem = ({ q, idx, onChange, onRemove, topics = [] }) => {
    const update = (field, value) => onChange(idx, { ...q, [field]: value });

    return (
        <div
            style={{
                background: "#f9fafb",
                borderRadius: 16,
                padding: 20,
                border: "1px solid #e5e7eb",
                marginBottom: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <span
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#2563eb",
                        background: "#dbeafe",
                        padding: "4px 12px",
                        borderRadius: 20,
                    }}
                >
                    Question {idx + 1}
                </span>

                <button
                    type="button"
                    onClick={() => onRemove(idx)}
                    style={{
                        background: "#fee2e2",
                        border: "none",
                        borderRadius: 10,
                        padding: "6px 10px",
                        cursor: "pointer",
                        color: "#dc2626",
                    }}
                >
                    Remove
                </button>
            </div>

            <textarea
                value={q.questionText}
                onChange={(e) => update("questionText", e.target.value)}
                placeholder="Enter question text..."
                style={{ ...inputStyle, minHeight: 80, resize: "vertical", marginBottom: 12 }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                {[0, 1, 2, 3].map((oi) => (
                    <div key={oi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, width: 16 }}>
                            {String.fromCharCode(65 + oi)}.
                        </span>
                        <input
                            value={q.options[oi] || ""}
                            onChange={(e) => {
                                const opts = [...q.options];
                                opts[oi] = e.target.value;
                                update("options", opts);
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            style={{
                                ...inputStyle,
                                border:
                                    q.correctAnswer === oi
                                        ? "1px solid #2563eb"
                                        : "1px solid #d1d5db",
                                padding: "10px 12px",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => update("correctAnswer", oi)}
                            style={{
                                background: q.correctAnswer === oi ? "#2563eb" : "#f3f4f6",
                                color: q.correctAnswer === oi ? "#fff" : "#111827",
                                border: "none",
                                borderRadius: 8,
                                width: 32,
                                height: 32,
                                cursor: "pointer",
                                fontWeight: 700,
                            }}
                            title="Mark as correct"
                        >
                            ✓
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginBottom: 12 }}>
                <select
                    value={q.topic || ""}
                    onChange={(e) => update("topic", e.target.value)}
                    style={selectStyle}
                >
                    <option value="">-- Select Lecture Topic --</option>
                    {topics.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <textarea
                value={q.explanation || ""}
                onChange={(e) => update("explanation", e.target.value)}
                placeholder="Explanation (optional)"
                style={{ ...inputStyle, minHeight: 60, resize: "vertical", marginBottom: 12 }}
            />

            <input
                type="number"
                min="1"
                value={q.marks}
                onChange={(e) => update("marks", Number(e.target.value))}
                placeholder="Marks"
                style={inputStyle}
            />
        </div>
    );


};

// -------------------- Add Exam --------------------
const AddExamQuiz = ({ toast, modules }) => {
    const [form, setForm] = useState({
        moduleId: "",
        title: "",
        duration: "",
        scheduledStart: "",
        scheduledEnd: "",
        attemptsAllowed: 1,
    });
    const [questions, setQuestions] = useState([newQuestion()]);
    const [loading, setLoading] = useState(false);

    const updateQ = (i, q) => setQuestions((qs) => qs.map((x, xi) => (xi === i ? q : x)));
    const removeQ = (i) => setQuestions((qs) => qs.filter((_, xi) => xi !== i));
    const addQ = () => setQuestions((qs) => [...qs, newQuestion()]);

    const validate = () => {
        if (!form.moduleId || !form.title || !form.duration || !form.scheduledStart || !form.scheduledEnd) {
            toast("Please fill all required fields.", "error");
            return false;
        }
        if (parseInt(form.duration) <= 0) {
            toast("Duration must be a positive number.", "error");
            return false;
        }
        if (new Date(form.scheduledStart) >= new Date(form.scheduledEnd)) {
            toast("Start time must be before end time.", "error");
            return false;
        }
        if (questions.some((q) => !q.questionText.trim())) {
            toast("All questions must have text.", "error");
            return false;
        }
        return true;
    };

    const handlePublish = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await quizAPI.create({ ...form, quizType: "exam" });
            const quizId = res.data.data._id;

            for (const q of questions) {
                await questionAPI.create({ ...q, quizId });
            }

            toast("Exam published successfully!", "success");
            setForm({
                moduleId: "",
                title: "",
                duration: "",
                scheduledStart: "",
                scheduledEnd: "",
                attemptsAllowed: 1,
            });
            setQuestions([newQuestion()]);
        } catch (e) {
            toast(e.response?.data?.message || "Failed to publish exam", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>Add Real-Time Exam</h1>
            <p style={{ margin: "0 0 32px", color: "#6b7280", fontSize: 14 }}>
                Schedule a timed exam and add questions.
            </p>

            <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #e5e7eb", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px" }}>Exam Configuration</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <FormField label="Select Module" required>
                        <select
                            value={form.moduleId}
                            onChange={(e) => setForm((f) => ({ ...f, moduleId: e.target.value }))}
                            style={selectStyle}
                        >
                            <option value="">-- Choose Module --</option>
                            {modules.map((m) => (
                                <option key={m._id} value={m._id}>
                                    {m.moduleName}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Exam Title" required>
                        <input
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="e.g. CS201 Midterm Exam"
                            style={inputStyle}
                        />
                    </FormField>

                    <FormField label="Scheduled Start" required>
                        <input
                            type="datetime-local"
                            value={form.scheduledStart}
                            onChange={(e) => setForm((f) => ({ ...f, scheduledStart: e.target.value }))}
                            style={inputStyle}
                        />
                    </FormField>

                    <FormField label="Scheduled End" required>
                        <input
                            type="datetime-local"
                            value={form.scheduledEnd}
                            onChange={(e) => setForm((f) => ({ ...f, scheduledEnd: e.target.value }))}
                            style={inputStyle}
                        />
                    </FormField>

                    <FormField label="Duration (minutes)" required>
                        <input
                            type="number"
                            min="1"
                            value={form.duration}
                            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                            placeholder="90"
                            style={inputStyle}
                        />
                    </FormField>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #e5e7eb", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px" }}>Questions ({questions.length})</h3>
                {questions.map((q, i) => (
                    <QuestionItem
                        key={i}
                        q={q}
                        idx={i}
                        onChange={updateQ}
                        onRemove={removeQ}
                        topics={modules.find((m) => m._id === form.moduleId)?.topics || []}
                    />
                ))}
                <button
                    type="button"
                    onClick={addQ}
                    style={{
                        width: "100%",
                        padding: "14px",
                        border: "2px dashed #cbd5e1",
                        borderRadius: 16,
                        background: "transparent",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    Add Another Question
                </button>
            </div>

            <button
                type="button"
                onClick={handlePublish}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 14,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                }}
            >
                {loading ? "Publishing..." : "Schedule & Publish Exam"}
            </button>
        </div>
    );
};

// -------------------- Edit Exam --------------------
const EditExamQuiz = ({ quiz, modules, onBack, toast }) => {
    const formatDt = (dt) => {
        if (!dt) return "";
        const d = new Date(dt);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    const [form, setForm] = useState({
        moduleId: quiz.moduleId?._id || quiz.moduleId,
        title: quiz.title || "",
        duration: quiz.duration || "",
        scheduledStart: formatDt(quiz.scheduledStart),
        scheduledEnd: formatDt(quiz.scheduledEnd),
        attemptsAllowed: quiz.attemptsAllowed || 1,
    });

    const [questions, setQuestions] = useState([]);
    const [deletedQuestions, setDeletedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchQs = async () => {
            try {
                const res = await questionAPI.getByQuiz(quiz._id);
                setQuestions(res.data?.data || []);
            } catch (e) {
                toast("Failed to load questions", "error");
            }
        };
        fetchQs();
    }, [quiz._id, toast]);

    const updateQ = (i, q) => setQuestions((qs) => qs.map((x, xi) => (xi === i ? q : x)));
    const removeQ = (i) => {
        const qToDelete = questions[i];
        if (qToDelete._id) {
            setDeletedQuestions((prev) => [...prev, qToDelete._id]);
        }
        setQuestions((qs) => qs.filter((_, xi) => xi !== i));
    };

    const addQ = () => setQuestions((qs) => [...qs, newQuestion()]);

    const validate = () => {
        if (!form.moduleId || !form.title || !form.duration || !form.scheduledStart || !form.scheduledEnd) {
            toast("Please fill all required fields.", "error");
            return false;
        }
        if (parseInt(form.duration) <= 0) {
            toast("Duration must be a positive number.", "error");
            return false;
        }
        if (new Date(form.scheduledStart) >= new Date(form.scheduledEnd)) {
            toast("Start time must be before end time.", "error");
            return false;
        }
        if (questions.some((q) => !q.questionText?.trim())) {
            toast("All questions must have text.", "error");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await quizAPI.update(quiz._id, form);

            for (const dqId of deletedQuestions) {
                await questionAPI.delete(dqId).catch(() => {});
            }

            for (const q of questions) {
                if (q._id) {
                    await questionAPI.update(q._id, q).catch(() => {});
                } else {
                    await questionAPI.create({ ...q, quizId: quiz._id }).catch(() => {});
                }
            }

            toast("Exam updated successfully!", "success");
            onBack();
        } catch (e) {
            toast(e.response?.data?.message || "Failed to update exam", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900 }}>
            <button
                type="button"
                onClick={onBack}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "#6b7280",
                    cursor: "pointer",
                    marginBottom: 16,
                    fontWeight: 600,
                }}
            >
                ← Back to Exams
            </button>

            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>Edit Exam</h1>
            <p style={{ margin: "0 0 32px", color: "#6b7280", fontSize: 14 }}>
                Update scheduled exam details and questions.
            </p>

            <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #e5e7eb", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px" }}>Exam Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <FormField label="Select Module" required>
                        <select
                            value={form.moduleId}
                            onChange={(e) => setForm((f) => ({ ...f, moduleId: e.target.value }))}
                            style={selectStyle}
                        >
                            <option value="">-- Choose Module --</option>
                            {modules.map((m) => (
                                <option key={m._id} value={m._id}>
                                    {m.moduleName}
                                </option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="Exam Title" required>
                        <input
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            style={inputStyle}
                        />
                    </FormField>

                    <FormField label="Scheduled Start" required>
                        <input
                            type="datetime-local"
                            value={form.scheduledStart}
                            onChange={(e) => setForm((f) => ({ ...f, scheduledStart: e.target.value }))}
                            style={inputStyle}
                        />
                    </FormField>

                    <FormField label="Scheduled End" required>
                        <input
                            type="datetime-local"
                            value={form.scheduledEnd}
                            onChange={(e) => setForm((f) => ({ ...f, scheduledEnd: e.target.value }))}
                            style={inputStyle}
                        />
                    </FormField>

                    <FormField label="Duration (minutes)" required>
                        <input
                            type="number"
                            min="1"
                            value={form.duration}
                            onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                            style={inputStyle}
                        />
                    </FormField>
                </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #e5e7eb", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px" }}>Questions ({questions.length})</h3>
                {questions.map((q, i) => (
                    <QuestionItem
                        key={q._id || i}
                        q={q}
                        idx={i}
                        onChange={updateQ}
                        onRemove={removeQ}
                        topics={modules.find((m) => m._id === form.moduleId)?.topics || []}
                    />
                ))}
                <button
                    type="button"
                    onClick={addQ}
                    style={{
                        width: "100%",
                        padding: "14px",
                        border: "2px dashed #cbd5e1",
                        borderRadius: 16,
                        background: "transparent",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    Add Another Question
                </button>
            </div>

            <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 14,
                    border: "none",
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                }}
            >
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
};

// -------------------- Manage Exams --------------------
const ManageExams = ({ toast, modules }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingQuiz, setEditingQuiz] = useState(null);

    const fetchExams = async () => {
        try {
            setLoading(true);
            const res = await quizAPI.getAll({ quizType: "exam" });
            setQuizzes(res.data?.data?.items || res.data?.data || []);
        } catch (e) {
            toast("Failed to load exams", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    if (editingQuiz) {
        return (
            <EditExamQuiz
                quiz={editingQuiz}
                modules={modules}
                toast={toast}
                onBack={() => {
                    setEditingQuiz(null);
                    fetchExams();
                }}
            />
        );
    }

    return (
        <div style={{ maxWidth: 1000 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800 }}>Manage Exams</h1>
            <p style={{ margin: "0 0 32px", color: "#6b7280", fontSize: 14 }}>
                View and edit scheduled exams.
            </p>

            {loading ? (
                <p>Loading exams...</p>
            ) : quizzes.length === 0 ? (
                <div
                    style={{
                        padding: "40px",
                        border: "1px dashed #cbd5e1",
                        borderRadius: 20,
                        background: "#fff",
                        textAlign: "center",
                    }}
                >
                    No exams found.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 16 }}>
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            style={{
                                background: "#fff",
                                padding: 24,
                                borderRadius: 20,
                                border: "1px solid #e5e7eb",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 16,
                                }}
                            >
                                <div>
                                    <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700 }}>
                                        {quiz.title}
                                    </h3>
                                    <p style={{ margin: "0 0 6px", color: "#6b7280", fontSize: 14 }}>
                                        Module: {quiz.moduleId?.moduleName || "N/A"}
                                    </p>
                                    <p style={{ margin: "0 0 6px", color: "#6b7280", fontSize: 14 }}>
                                        Start: {quiz.scheduledStart ? new Date(quiz.scheduledStart).toLocaleString() : "N/A"}
                                    </p>
                                    <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
                                        End: {quiz.scheduledEnd ? new Date(quiz.scheduledEnd).toLocaleString() : "N/A"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setEditingQuiz(quiz)}
                                    style={{
                                        padding: "10px 16px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: "#2563eb",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


}

