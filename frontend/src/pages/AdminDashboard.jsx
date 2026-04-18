import { useState, useEffect, useCallback } from "react";
import { moduleAPI, adminAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─── CSS Injection ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;0,800;1,600&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    .num { font-family: 'Calibri', sans-serif !important; }
    .stat-card { transition: all .4s cubic-bezier(0.34, 1.56, 0.64, 1); background: var(--glass) !important; backdrop-filter: blur(24px) saturate(180%); border: 1px solid var(--glassBorder) !important; border-radius: 24px !important; }
    .stat-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 32px 64px rgba(0,0,0,.15) !important; background: rgba(255,255,255,0.1) !important; }
    .btn-primary { transition: all .18s ease; }
    .btn-primary:hover { transform: translateY(-1px); filter: brightness(1.08); }
    .btn-icon { transition: all .15s ease; }
    .btn-icon:hover { transform: scale(1.1); }
    .table-row { transition: background .12s ease; }
    .table-row:hover { background: var(--row-hover) !important; }
    .tag { display:inline-flex; align-items:center; padding:2px 10px; border-radius:99px; font-size:.72rem; font-weight:600; }
    .skeleton { animation: pulse 1.4s ease infinite; background: var(--skel); border-radius:8px; }
    input:focus, select:focus, textarea:focus { outline:none; border-color:var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-glow) !important; }
    .form-err { color:#ef4444; font-size:.76rem; margin-top:4px; }
  `}</style>
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ico = ({ p, size = 18, sw = 1.8, fill = "none" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        {(Array.isArray(p) ? p : [p]).map((d, i) => <path key={i} d={d} />)}
    </svg>
);
const I = {
    dash: ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", "M9 22V12h6v10"],
    modules: ["M4 19.5A2.5 2.5 0 016.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"],
    lecturers: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2", "M9 11a4 4 0 100-8 4 4 0 000 8z", "M23 21v-2a4 4 0 00-3-3.87", "M16 3.13a4 4 0 010 7.75"],
    students: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
    bell: ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 01-3.46 0"],
    logout: ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4", "M16 17l5-5-5-5", "M21 12H9"],
    menu: "M3 12h18M3 6h18M3 18h18",
    plus: "M12 5v14M5 12h14",
    edit: ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7", "M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
    trash: ["M3 6h18", "M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"],
    search: ["M21 21l-4.35-4.35", "M17 11A6 6 0 115 11a6 6 0 0112 0z"],
    chevL: "M15 18l-6-6 6-6",
    chevR: "M9 18l6-6-6-6",
    chevD: "M6 9l6 6 6-6",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    warn: ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z", "M12 9v4", "M12 17h.01"],
    sun: ["M12 2v2", "M12 20v2", "M4.93 4.93l1.41 1.41", "M17.66 17.66l1.41 1.41", "M2 12h2", "M20 12h2", "M6.34 17.66l-1.41 1.41", "M19.07 4.93l-1.41 1.41", "M12 7a5 5 0 100 10 5 5 0 000-10z"],
    moon: "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    eye: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
    eyeOff: ["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94", "M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19", "M1 1l22 22"],
    power: ["M18.36 6.64a9 9 0 11-12.73 0", "M12 2v10"],
    grid: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
    trend: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"],
    user: ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2", "M12 11a4 4 0 100-8 4 4 0 000 8z"],
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    inbox: ["M22 12h-6l-2 3h-4l-2-3H2", "M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"],
};

// ─── Constants ───────────────────────────────────────────────────────────────
const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

// ─── Toast System ─────────────────────────────────────────────────────────────
let _tid = 0;
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const add = useCallback((msg, type = "success") => {
        const id = ++_tid;
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
    }, []);
    return { toasts, add };
};

const TOAST_CONFIG = {
    success: { bg: "linear-gradient(135deg,#064e3b,#065f46)", icon: "✓", border: "#10b98140" },
    error: { bg: "linear-gradient(135deg,#7f1d1d,#991b1b)", icon: "✕", border: "#ef444440" },
    info: { bg: "linear-gradient(135deg,#0f172a,#1e3a8a)", icon: "ℹ", border: "rgba(59,130,246,0.3)" },
    warning: { bg: "linear-gradient(135deg,#78350f,#92400e)", icon: "⚠", border: "#f59e0b40" },
};

const ToastContainer = ({ toasts }) => (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
        {toasts.map(t => {
            const c = TOAST_CONFIG[t.type] || TOAST_CONFIG.success;
            return (
                <div key={t.id} style={{ background: c.bg, border: `1px solid ${c.border}`, color: "#fff", padding: "13px 20px", borderRadius: 14, fontSize: 13.5, fontWeight: 500, boxShadow: "0 12px 40px rgba(0,0,0,.35)", display: "flex", alignItems: "center", gap: 10, minWidth: 300, animation: "toastIn .3s cubic-bezier(.22,1,.36,1) both" }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{c.icon}</span>
                    {t.msg}
                </div>
            );
        })}
    </div>
);

// ─── Modals ───────────────────────────────────────────────────────────────────
const ConfirmModal = ({ open, title, message, onConfirm, onCancel, danger = true }) => {
    const [mDown, setMDown] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (!open) return;
        const h = (e) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [open, onCancel]);

    if (!open) return null;
    return (
        <div
            className="modal-bg"
            onMouseDown={(e) => setMDown(e.target === e.currentTarget)}
            onMouseUp={(e) => { if (mDown && e.target === e.currentTarget) onCancel(); }}
            style={{ position: "fixed", inset: 0, background: dark ? "rgba(0,0,0,.7)" : "rgba(15,23,42,.4)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
            <div className="modal-box" style={{ background: "var(--glass)", borderRadius: 32, padding: 40, maxWidth: 420, width: "100%", border: "1px solid var(--glassBorder)", backdropFilter: "blur(32px) saturate(180%)", boxShadow: "0 40px 120px rgba(0,0,0,.4)" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: danger ? "#ef444420" : "#3b82f620", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: danger ? "#ef4444" : "#3b82f6" }}>
                    <Ico p={I.warn} size={26} />
                </div>
                <h3 style={{ textAlign: "center", marginBottom: 10, color: "var(--text)", fontFamily: "'Calibri', sans-serif", fontSize: "1.25rem" }}>{title}</h3>
                <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 13.5, marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Calibri', sans-serif", fontWeight: 600, fontSize: 14 }}>Cancel</button>
                    <button onClick={onConfirm} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "none", background: danger ? "#ef4444" : "#2563eb", color: "#fff", cursor: "pointer", fontFamily: "'Calibri', sans-serif", fontWeight: 700, fontSize: 14 }}>
                        {danger ? "Delete" : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FormModal = ({ open, title, onClose, children }) => {
    const [mDown, setMDown] = useState(false);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (!open) return;
        const h = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div
            className="modal-bg"
            onMouseDown={(e) => setMDown(e.target === e.currentTarget)}
            onMouseUp={(e) => { if (mDown && e.target === e.currentTarget) onClose(); }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", backdropFilter: "blur(6px)",     
  WebkitBackdropFilter: "blur(8px)",  zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
            <div className="modal-box" style={{ background: "var(--glass)", borderRadius: 32, padding: 0, maxWidth: 560, width: "100%", border: "1px solid var(--glassBorder)", backdropFilter: "blur(32px) saturate(180%)", boxShadow: "0 40px 120px rgba(0,0,0,.4)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ color: "var(--text)", fontFamily: "'Calibri', sans-serif", fontSize: "1.2rem" }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "6px 8px", cursor: "pointer", color: "var(--muted)", display: "flex" }}>
                        <Ico p={I.x} size={16} />
                    </button>
                </div>
                <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>{children}</div>
            </div>
        </div>
    );
};

// ─── UI Components ────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children }) => (
    <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 7, textTransform: "uppercase", letterSpacing: ".05em" }}>
            {label}{required && <span style={{ color: "#ef4444", marginLeft: 4 }}>*</span>}
        </label>
        {children}
        {error && <p className="form-err">{error}</p>}
    </div>
);

const inp = { width: "100%", background: "#ffffff", border: "1px solid var(--border)", borderRadius: 11, padding: "10px 14px", color: "var(--text)", fontSize: 14, fontFamily: "'Calibri', sans-serif", transition: "border .2s, box-shadow .2s" };

const StatCard = ({ label, value, icon, color, sub, delay = 0 }) => (
    <div className="stat-card" style={{ background: "var(--card)", borderRadius: 20, padding: "24px 26px", border: "1px solid var(--border)", position: "relative", overflow: "hidden", animation: `fadeUp .4s ${delay}s cubic-bezier(.22,1,.36,1) both` }}>
        <div style={{ position: "absolute", top: -24, right: -24, width: 90, height: 90, borderRadius: "50%", background: `${color}18` }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
                <p style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</p>
                <p className="num" style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.1, marginTop: 4 }}>{value}</p>
                {sub && <p style={{ fontSize: 12, color, marginTop: 5, fontWeight: 500 }}>{sub}</p>}
            </div>
            <div style={{ background: `${color}20`, borderRadius: 14, padding: 13, color, flexShrink: 0 }}>
                <Ico p={I[icon]} size={22} />
            </div>
        </div>
    </div>
);

const Badge = ({ status }) => {
    const isActive = status === true || status === "Active";
    const label = status === true ? "Active" : status === false ? "Inactive" : status;
    return (
        <span className="tag" style={{ background: isActive ? "#10b98118" : "#ef444418", color: isActive ? "#10b981" : "#ef4444", border: `1px solid ${isActive ? "#10b98130" : "#ef444430"}` }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", marginRight: 6, display: "inline-block" }} />
            {label}
        </span>
    );
};

const Search = ({ value, onChange, placeholder }) => (
    <div style={{ position: "relative", flex: 1 }}>
        <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }}>
            <Ico p={I.search} size={16} />
        </div>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search..."} style={{ ...inp, paddingLeft: 40, borderRadius: 12 }} />
    </div>
);

const Pagination = ({ page, total, perPage, onChange }) => {
    const pages = Math.ceil(total / perPage);
    if (pages <= 1) return null;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 20 }}>
            <button onClick={() => onChange(page - 1)} disabled={page === 1} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: "6px 10px", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "var(--muted)" : "var(--text)", opacity: page === 1 ? .5 : 1 }}>
                <Ico p={I.chevL} size={15} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => onChange(n)} style={{ background: n === page ? "var(--accent)" : "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: "6px 12px", cursor: "pointer", color: n === page ? "#fff" : "var(--text)", fontWeight: 500, fontSize: 13, fontFamily: "'Calibri', sans-serif" }}>{n}</button>
            ))}
            <button onClick={() => onChange(page + 1)} disabled={page === pages} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 9, padding: "6px 10px", cursor: page === pages ? "not-allowed" : "pointer", color: page === pages ? "var(--muted)" : "var(--text)", opacity: page === pages ? .5 : 1 }}>
                <Ico p={I.chevR} size={15} />
            </button>
        </div>
    );
};

// ─── Forms ────────────────────────────────────────────────────────────────────
const ModuleForm = ({ initial, onSave, onClose, loading, disabled }) => {
    const [form, setForm] = useState(initial || { moduleName: "",  moduleCode: "",semester: "", description: "" });
    const [topicsInput, setTopicsInput] = useState(Array.isArray(initial?.topics) ? initial.topics.join(", ") : "");
    const [errors, setErrors] = useState({});


    useEffect(() => {
        setForm(initial || { moduleName: "", semester: "", description: "" });
        setTopicsInput(Array.isArray(initial?.topics) ? initial.topics.join(", ") : "");
    }, [initial]);

    const validate = () => {
        const e = {};
        if (!form.moduleName.trim()) e.moduleName = "Module name is required";
        if (!form.semester) e.semester = "Please select a semester";
        if (!form.moduleCode.trim()) e.moduleCode = "Module code is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

    const handleSave = () => {
        if (validate()) {
            const topics = topicsInput.split(",").map(t => t.trim()).filter(Boolean);
            onSave({ ...form, topics });
        }
    };

    return (
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <Field label="Module Name" required error={errors.moduleName}>
                <input value={form.moduleName} onChange={e => set("moduleName", e.target.value)} placeholder="e.g. Introduction to Programming" style={inp} />
            </Field>
            <Field label="Module Code" required error={errors.moduleCode}>
                 <input value={form.moduleCode}  onChange={e => set("moduleCode", e.target.value)} placeholder="e.g. IT1010"  style={inp} /> 
            </Field>
            <Field label="Semester" required error={errors.semester}>
                <select value={form.semester} onChange={e => set("semester", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                    <option value="">-- Select Semester --</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </Field>
            <Field label="Description">
                <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of the module..." rows={3} style={{ ...inp, resize: "vertical" }} />
            </Field>
            <Field label="Lecture Topics (Comma Separated)">
                <textarea value={topicsInput} onChange={e => setTopicsInput(e.target.value)} placeholder="e.g. Hooks, Context API, Components" rows={2} style={{ ...inp, resize: "vertical" }} />
            </Field>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Calibri', sans-serif", fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={disabled} className="btn-primary" style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.7 : 1, fontFamily: "'Calibri', sans-serif", fontWeight: 700 }}>
                    {loading ? "Processing..." : (initial ? "Save Changes" : "Add Module")}
                </button>
            </div>
        </form>
    );
};

const PersonForm = ({ initial, onSave, onClose, role }) => {
    const [form, setForm] = useState(initial || { name: "", email: "", password: "", role });
    const [errors, setErrors] = useState({});
    const [showPw, setShowPw] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Full name is required";
        if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email is required";
        if (!initial) {
            if (!form.password.trim()) {
                e.password = "Password is required";
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)) {
                e.password = "Password is too weak";
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

    const isPassValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password);

    return (
        <form onSubmit={e => { e.preventDefault(); if (validate()) onSave(form); }}>
            <Field label="Full Name" required error={errors.name}>
                <input value={form.name} onChange={e => set("name", e.target.value)} placeholder={`${role} full name`} style={inp} />
            </Field>
            <Field label="Email Address" required error={errors.email}>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="name@university.edu" style={inp} />
            </Field>
            {!initial && (
                <Field label="Password" required error={errors.password}>
                    <div style={{ position: "relative" }}>
                        <input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="8+ chars, upper, lower, num, spec" style={{ ...inp, paddingRight: 44 }} />
                        <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                            <Ico p={showPw ? I.eyeOff : I.eye} size={16} />
                        </button>
                    </div>
                    {form.password && (
                        <div style={{ fontSize: 11, marginTop: 6, color: isPassValid ? "#10b981" : "#ef4444" }}>
                            {isPassValid ? '✅ Strong password' : 'Must have 8+ chars, upper, lower, number, & special char.'}
                        </div>
                    )}
                </Field>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", cursor: "pointer", fontFamily: "'Calibri', sans-serif", fontWeight: 600 }}>Cancel</button>
                <button type="submit" disabled={!initial && !isPassValid} className="btn-primary" style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: role === "lecturer" ? "#3b82f6" : "#10b981", color: "#fff", cursor: (!initial && !isPassValid) ? "not-allowed" : "pointer", opacity: (!initial && !isPassValid) ? 0.6 : 1, fontFamily: "'Calibri', sans-serif", fontWeight: 700 }}>
                    {initial ? "Save Changes" : `Add ${role}`}
                </button>
            </div>
        </form>
    );
};
