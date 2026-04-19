import { useState, useEffect } from "react";
import { quizAPI, questionAPI, announcementAPI } from "../services/api";
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





const FormField = ({ label, children, required }) => (
    <div style={{ marginBottom: 20 }}>
        <label
            style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#6b7280",
                marginBottom: 8,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
            }}
        >
            {label}
            {required && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
        </label>
        {children}
    </div>
);


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
        if (!responseTexts[id]) {
            return toast("Response cannot be empty", "error");
        }

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
                tickets.map((t) => (
                    <div
                        key={t._id}
                        style={{ marginBottom: 20, padding: 16, border: "1px solid #ccc" }}
                    >
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
                                    onChange={(e) =>
                                        setResponseTexts({
                                            ...responseTexts,
                                            [t._id]: e.target.value,
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

    const updateQ = (i, q) =>
        setQuestions((qs) => qs.map((x, xi) => (xi === i ? q : x)));

    const removeQ = (i) =>
        setQuestions((qs) => qs.filter((_, xi) => xi !== i));

    const addQ = () =>
        setQuestions((qs) => [...qs, newQuestion()]);

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

    const updateQ = (i, q) =>
        setQuestions((qs) => qs.map((x, xi) => (xi === i ? q : x)));

    const removeQ = (i) => {
        const qToDelete = questions[i];
        if (qToDelete._id) {
            setDeletedQuestions((prev) => [...prev, qToDelete._id]);
        }
        setQuestions((qs) => qs.filter((_, xi) => xi !== i));
    };

    const addQ = () =>
        setQuestions((qs) => [...qs, newQuestion()]);

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
const AddAnnouncement = ({ toast, user }) => {
    const [form, setForm] = useState({
        title: "",
        description: "",
    });
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            const res = await announcementAPI.getForLecturer();
            const items = res.data?.data || [];
            setAnnouncements(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (e) {
            toast("Failed to load announcements", "error");
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const validate = () => {
        if (!form.title.trim() || !form.description.trim()) {
            toast("Title and description are required.", "error");
            return false;
        }
        return true;
    };

    const handlePublish = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            await announcementAPI.create({
                title: form.title,
                description: form.description,
            });

            toast("Announcement published successfully!");
            setForm({ title: "", description: "" });
            fetchAnnouncements();
        } catch (e) {
            toast(e.response?.data?.message || "Failed to publish announcement", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this announcement?")) return;

        try {
            await announcementAPI.delete(id);
            toast("Announcement deleted successfully!");
            fetchAnnouncements();
        } catch (e) {
            toast(e.response?.data?.message || "Failed to delete announcement", "error");
        }
    };

    const canDelete = (announcement) => {
        if (!user) return false;
        return (announcement.createdBy?._id || announcement.createdBy) === user._id;
    };

    return (
        <div style={{ maxWidth: 860 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>
                Add Announcement
            </h1>
            <p style={{ margin: "0 0 32px", color: "var(--text-muted)", fontSize: 14 }}>
                Create a new announcement notice for students.
            </p>

            <div style={{ background: "var(--card)", borderRadius: 24, padding: 32, border: "1px solid var(--border)", marginBottom: 24 }}>
                <h3 style={{ margin: "0 0 24px", color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>
                    Announcement Details
                </h3>

                <FormField label="Announcement Title" required>
                    <input
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="e.g. Midterm Information"
                        style={inputStyle}
                    />
                </FormField>

                <FormField label="Description" required>
                    <textarea
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="Enter your announcement here..."
                        style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                    />
                </FormField>
            </div>

            <button
                onClick={handlePublish}
                disabled={loading}
                style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, var(--accent), #0891b2)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                }}
            >
                {loading ? "Publishing..." : "Publish Announcement →"}
            </button>

            <div style={{ marginTop: 40 }}>
                <h3 style={{ marginBottom: 20, color: "var(--text)", fontFamily: "'Calibri', sans-serif" }}>
                    Recent Announcements
                </h3>

                {announcements.length === 0 ? (
                    <div
                        style={{
                            padding: 24,
                            borderRadius: 16,
                            background: "var(--card)",
                            border: "1px solid var(--border)",
                            textAlign: "center",
                            color: "var(--text-muted)",
                        }}
                    >
                        No announcements found.
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: 16 }}>
                        {announcements.map((a) => (
                            <div
                                key={a._id}
                                style={{
                                    background: "var(--card)",
                                    padding: 20,
                                    borderRadius: 16,
                                    border: "1px solid var(--border)",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
                                            {a.title}
                                        </h4>
                                        <p
                                            style={{
                                                margin: "0 0 10px",
                                                color: "var(--text-muted)",
                                                lineHeight: 1.6,
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {a.description}
                                        </p>
                                        <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
                                            {new Date(a.createdAt).toLocaleString()}
                                        </p>
                                    </div>

                                    {canDelete(a) && (
                                        <button
                                            onClick={() => handleDelete(a._id)}
                                            style={{
                                                height: "fit-content",
                                                padding: "8px 12px",
                                                borderRadius: 10,
                                                border: "none",
                                                background: "#dc2626",
                                                color: "#fff",
                                                cursor: "pointer",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// -------------------- Use inside LecturerDashboard main --------------------
//
// {page === "exam" && <AddExamQuiz toast={toast} modules={modules} />}

// {page === "manage" && <ManageExams toast={toast} modules={modules} />}



// {page === "manage" && <ManageExams toast={toast} modules={modules} />}

