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

// ─── Pages ────────────────────────────────────────────────────────────────────
const Overview = ({ stats }) => (
    <div className="page-enter">
        <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.625rem", color: "var(--text)", fontWeight: 800, letterSpacing: "-.02em" }}>
                System <span style={{ color: "var(--accent)" }}>Overview</span>
            </h1>
            <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 14 }}>Welcome Back, Administrator. Here's today's summary.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 18, marginBottom: 28 }}>
            <StatCard label="Total Modules" value={stats.modules} icon="modules" color="#3b82f6" sub="Active modules" delay={0} />
            <StatCard label="Total Lecturers" value={stats.lecturers} icon="lecturers" color="#3b82f6" sub="Faculty members" delay={0.06} />
            <StatCard label="Total Students" value={stats.students} icon="students" color="#10b981" sub="Enrolled students" delay={0.12} />
            <StatCard label="Pending Tasks" value="0" icon="bell" color="#f59e0b" sub="Action items" delay={0.18} />
        </div>
    </div>
);

const ModulesPage = ({ modules, setModules, toast }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [saving, setSaving] = useState(false);

    const PER_PAGE = 5;

    const filtered = (modules || []).filter((m) =>
        (m?.moduleName || "").toLowerCase().includes(search.toLowerCase())
    );

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleSave = async (form) => {
        if (saving) return;
        setSaving(true);

        try {
            console.log("Sending module:", form); // DEBUG

            if (editing) {
                await moduleAPI.update(editing._id, form);
                toast("Module updated!");
            } else {
                await moduleAPI.create(form);
                toast("Module created!");
            }

            setFormOpen(false);
            setEditing(null);

            const res = await moduleAPI.getAll({ limit: 100 });
            setModules(res.data.data.data);

        } catch (e) {
            const msg = e.response?.data?.message || e.message || "Error saving module";
            toast(msg, "error");
            console.error("Save error:", e.response?.data || e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (saving) return;
        setSaving(true);

        try {
            await moduleAPI.delete(deleting._id);
            toast("Module deleted", "info");

            setDeleting(null);

            const res = await moduleAPI.getAll({ limit: 100 });
            setModules(res.data.data.data);

        } catch (e) {
            toast(e.response?.data?.message || e.message || "Error deleting module", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-enter">
            <ConfirmModal
                open={!!deleting}
                title="Delete Module?"
                message={`Delete "${deleting?.moduleName}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleting(null)}
            />

            <FormModal
                open={formOpen || !!editing}
                title={editing ? "Edit Module" : "Add Module"}
                onClose={() => {
                    setFormOpen(false);
                    setEditing(null);
                }}
            >
                <ModuleForm
                    key={editing ? editing._id : "new"}   // ✅ IMPORTANT FIX
                    initial={editing}
                    onSave={handleSave}
                    onClose={() => {
                        setFormOpen(false);
                        setEditing(null);
                    }}
                    loading={saving}
                    disabled={saving}
                />
            </FormModal>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Calibri', sans-serif", fontSize: "1.8rem" }}>
                    Modules
                </h1>

                <button
                    onClick={() => {
                        setEditing(null);
                        setFormOpen(true);
                    }}
                    className="btn-primary"
                    style={{
                        padding: "10px 20px",
                        background: "var(--accent)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        fontWeight: 700,
                        cursor: "pointer"
                    }}
                >
                    Add Module
                </button>
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20 }}>
                <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
                    <Search
                        value={search}
                        onChange={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                    />
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
                            <th style={{ textAlign: "left", padding: 20 }}>Name</th>
                            <th style={{ textAlign: "left", padding: 20 }}>Semester</th>
                            <th style={{ textAlign: "left", padding: 20 }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginated.map((m) => (
                            <tr key={m._id} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: 20, fontWeight: 600 }}>{m.moduleName}</td>

                                <td style={{ padding: 20 }}>
                                    <span className="tag" style={{ background: "#3b82f618", color: "#3b82f6" }}>
                                        {m.moduleCode}
                                    </span>
                                </td>

                                <td style={{ padding: 20, color: "var(--muted)" }}>{m.semester}</td>

                                <td style={{ padding: 20 }}>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            onClick={() => {
                                                setEditing(m);
                                                setFormOpen(false);
                                            }}
                                            style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}
                                        >
                                            <Ico p={I.edit} />
                                        </button>

                                        <button
                                            onClick={() => setDeleting(m)}
                                            style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}
                                        >
                                            <Ico p={I.trash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ padding: 20 }}>
                    <Pagination
                        page={page}
                        total={filtered.length}
                        perPage={PER_PAGE}
                        onChange={setPage}
                    />
                </div>
            </div>
        </div>
    );
};

const UsersPage = ({ users, role, setUsers, toast }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const PER_PAGE = 5;

    const filtered = (users || []).filter(u =>
        (u?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u?.email || "").toLowerCase().includes(search.toLowerCase())
    );
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const handleCreate = async (form) => {
        try {
            await adminAPI.createUser(form);
            toast(`${role} created!`);
            setFormOpen(false);
            const res = await adminAPI.getUsers({ role, limit: 100 });
            setUsers(res.data.data.data);
        } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
    };

    const handleDelete = async () => {
        try {
            await adminAPI.deleteUser(deleting._id);
            toast("User deleted", "info");
            setDeleting(null);
            const res = await adminAPI.getUsers({ role, limit: 100 });
            setUsers(res.data.data.data);
        } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
    };

    return (
        <div className="page-enter">
            <ConfirmModal open={!!deleting} title="Remove User?" message={`Remove ${deleting?.name}?`} onConfirm={handleDelete} onCancel={() => setDeleting(null)} />
            <FormModal open={formOpen} title={`Add ${role}`} onClose={() => setFormOpen(false)}>
                <PersonForm onSave={handleCreate} onClose={() => setFormOpen(false)} role={role} />
            </FormModal>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Calibri', sans-serif", fontSize: "1.8rem" }}>{role === "lecturer" ? "Lecturers" : "Students"}</h1>
                {role !== "student" && (
                    <button onClick={() => setFormOpen(true)} className="btn-primary" style={{ padding: "10px 20px", background: role === "lecturer" ? "#3b82f6" : "#10b981", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
                        Add {role}
                    </button>
                )}
            </div>

            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20 }}>
                <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}><Search value={search} onChange={v => { setSearch(v); setPage(1); }} /></div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textTransform: "uppercase" }}>
                            <th style={{ textAlign: "left", padding: 20 }}>Name</th>
                            <th style={{ textAlign: "left", padding: 20 }}>Email</th>
                            <th style={{ textAlign: "left", padding: 20 }}>Status</th>
                            <th style={{ textAlign: "left", padding: 20 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map(u => (
                            <tr key={u._id} style={{ borderBottom: "1px solid var(--border)" }}>
                                <td style={{ padding: 20, fontWeight: 600 }}>{u.name}</td>
                                <td style={{ padding: 20, color: "var(--muted)" }}>{u.email}</td>
                                <td style={{ padding: 20 }}><Badge status={u.isActive !== false} /></td>
                                <td style={{ padding: 20 }}>
                                    <button onClick={() => setDeleting(u)} style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}><Ico p={I.trash} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ padding: 20 }}>
                    <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
                </div>
            </div>
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

    const inputStyle = { width: "100%", background: "var(--input)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 16px", color: "var(--text)", fontSize: 13.5, fontFamily: "'Calibri', sans-serif" };

    return (
        <div style={{ maxWidth: 640 }}>
            <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: "var(--text)" }}>Profile Settings</h1>
            <p style={{ margin: "0 0 28px", color: "var(--text-muted)", fontSize: 13.5 }}>Manage your account details and security settings.</p>

            <form onSubmit={handleSubmit} style={{ background: "var(--card)", borderRadius: 20, padding: 32, border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Enter your full name" />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Email Address</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} placeholder="Enter your email" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>New Password</label>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} placeholder="••••••••" />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" }}>Confirm Password</label>
                        <input type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} style={inputStyle} placeholder="••••••••" />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: 12, width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "var(--accent)", color: "#fff", cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700 }}>
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [page, setPage] = useState("dashboard");
    const [dark, setDark] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [stats, setStats] = useState({ modules: 0, lecturers: 0, students: 0 });
    const [modules, setModules] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [students, setStudents] = useState([]);
    const { toasts, add: toast } = useToast();

    useEffect(() => {
        const load = async () => {
            try {
                const [modRes, lecRes, stuRes] = await Promise.all([
                    moduleAPI.getAll({ limit: 100 }),
                    adminAPI.getUsers({ role: 'lecturer', limit: 100 }),
                    adminAPI.getUsers({ role: 'student', limit: 100 })
                ]);
                const m = modRes?.data?.data?.data || [];
                const l = lecRes?.data?.data?.data || [];
                const s = stuRes?.data?.data?.data || [];
                setModules(m);
                setLecturers(l);
                setStudents(s);
                setStats({ modules: m.length, lecturers: l.length, students: s.length });
            } catch (e) {
                console.error("Dashboard load error:", e);
                toast("Failed to load dashboard data", "error");
            }
        };
        load();
    }, [page]);

    const accent = "#3b82f6";
    const cssVars = dark ? {
        "--bg": "#0a0f1e", "--sidebar": "rgba(30, 41, 59, 0.8)", "--card": "rgba(15, 23, 42, 0.4)", "--card-nested": "rgba(15, 23, 42, 0.3)",
        "--border": "rgba(255, 255, 255, 0.06)", "--text": "#f8fafc", "--text-muted": "#94a3b8", "--input": "rgba(30, 41, 59, 0.6)", "--accent": accent,
        "--glass": "rgba(15, 23, 42, 0.4)", "--glassBorder": "rgba(255, 255, 255, 0.08)",
    } : {
        "--bg": "#f0f7ff", "--sidebar": "rgba(59, 130, 246, 0.85)", "--surface": "rgba(255, 255, 255, 0.4)",
        "--card": "rgba(255, 255, 255, 0.4)", "--card-nested": "rgba(241, 245, 249, 0.3)",
        "--border": "rgba(0,0,0,0.05)", "--text": "#0f172a", "--muted": "#64748b", "--row-hover": "rgba(59,130,246,0.05)", "--skel": "#e2e8f0", "--accent": accent, "--accent-glow": "rgba(59,130,246,0.15)",
        "--glass": "rgba(255, 255, 255, 0.4)", "--glassBorder": "rgba(255, 255, 255, 0.5)",
    };

    const nav = [
        { id: "dashboard", label: "Dashboard", icon: "dash", color: "#2563eb" },
        { id: "modules", label: "Modules", icon: "modules", color: "#3b82f6" },
        { id: "lecturers", label: "Lecturers", icon: "lecturers", color: "#3b82f6" },
        { id: "students", label: "Students", icon: "students", color: "#10b981" },
        { id: "profile", label: "Manage Profile", icon: "user", color: "#2563eb" },
    ];

    return (
        <div style={{ ...cssVars, position: "relative", minHeight: "100vh", background: "var(--bg)", color: "var(--text)", overflow: "hidden", fontFamily: "'Outfit', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes float-alt { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(20px,20px); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            <GlobalStyles />
            <ToastContainer toasts={toasts} />
            
            {/* Background Blobs */}
            <div style={{ position: "fixed", top: "-15%", left: "-10%", width: "65%", height: "65%", background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0, animation: "float 12s infinite ease-in-out" }} />
            <div style={{ position: "fixed", bottom: "-20%", right: "-5%", width: "55%", height: "55%", background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", filter: "blur(120px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 18s infinite ease-in-out" }} />
            <div style={{ position: "fixed", top: "25%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0, animation: "float 14s infinite ease-in-out reverse" }} />
            <div style={{ position: "fixed", bottom: "10%", left: "5%", width: "35%", height: "35%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(70px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 22s infinite ease-in-out" }} />

            <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 1, minHeight: "100vh" }}>
                <aside style={{ width: collapsed ? 70 : 248, background: "var(--sidebar)", backdropFilter: "blur(24px) saturate(180%)", borderRight: "1px solid var(--glassBorder)", display: "flex", flexDirection: "column", transition: "width .28s", position: "sticky", top: 0, height: "100vh", zIndex: 10, boxShadow: "4px 0 32px rgba(0,0,0,0.1)" }}>
                    <div style={{ padding: "32px 24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#3b82f6", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0 }}>Q</div>
                        {!collapsed && (
                            <div style={{ animation: "fadeIn 0.3s ease both" }}>
                                <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-0.02em" }}>QuizHub</div>
                                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Administrator</div>
                            </div>
                        )}
                    </div>

                    <nav style={{ padding: "24px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                        {!collapsed && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 800, padding: "0 14px", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1.5 }}>Menu</div>}
                        {nav.map(n => (
                            <div key={n.id} onClick={() => setPage(n.id)} style={{
                                display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderRadius: 14, cursor: "pointer",
                                background: page === n.id ? "rgba(255,255,255,0.15)" : "transparent", color: "#fff",
                                fontWeight: page === n.id ? 700 : 500, fontSize: 14, transition: "0.2s",
                                opacity: page === n.id ? 1 : 0.85
                            }} onMouseEnter={e => e.currentTarget.style.background = page === n.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background = page === n.id ? "rgba(255,255,255,0.15)" : "transparent"}>
                                <Ico name={n.icon} size={20} />
                                {!collapsed && <span>{n.label}</span>}
                            </div>
                        ))}
                    </nav>
                </aside>

                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <header style={{ height: 62, borderBottom: "1px solid var(--border)", background: "var(--glass)", backdropFilter: "blur(24px) saturate(180%)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 5 }}>
                        <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}><Ico p={I.menu} /></button>
                        <div style={{ display: "flex", gap: 12 }}>
                            <button onClick={() => setPage("profile")} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 10, padding: 8, cursor: "pointer", color: "var(--muted)" }}><Ico p={I.user} /></button>
                            <button onClick={logout} style={{ padding: "8px 16px", background: "#ef444415", border: "1px solid #ef444430", borderRadius: 10, color: "#ef4444", cursor: "pointer", fontWeight: 600 }}>Logout</button>
                        </div>
                    </header>

                    <main style={{ padding: 32, overflowY: "auto" }}>
                        {page === "dashboard" && <Overview stats={stats} />}
                        {page === "modules" && <ModulesPage modules={modules} setModules={setModules} toast={toast} />}
                        {page === "lecturers" && <UsersPage users={lecturers} setUsers={setLecturers} role="lecturer" toast={toast} />}
                        {page === "students" && <UsersPage users={students} setUsers={setStudents} role="student" toast={toast} />}
                        {page === "profile" && <ProfileSettings toast={toast} user={user} />}
                    </main>
                </div>
            </div>
        </div>
    );
}
