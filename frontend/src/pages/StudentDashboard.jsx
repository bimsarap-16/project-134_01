import { useState, useEffect, useRef } from "react";
import { moduleAPI, quizAPI, questionAPI, attemptAPI, resultAPI, chatbotAPI, announcementAPI, userAPI, ticketAPI } from "../services/api";
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



 // Load filtered quizzes
    useEffect(() => {
        if (page === "practiceList" || page === "examList") {
            setPageLoading(true);
            quizAPI.getAll({ quizType: page === "practiceList" ? "practice" : "exam", limit: 100 })
                .then(r => setFilteredQuizzes(r.data.data.data || []))
                .catch(() => showToast("Failed to load quizzes", "error"))
                .finally(() => setPageLoading(false));
        }
    }, [page]);

// ── RENDER PRACTICE ────────────────────────────────────────────────────────────
    const renderPractice = () => {
        if (!selectedQuiz || questions.length === 0) return (
            <div style={{ padding: 60, textAlign: "center", color: colors.textMid }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>No questions found</div>
                <button onClick={() => navigateTo("quizList")} style={{ marginTop: 20, padding: "12px 24px", borderRadius: 12, background: `linear-gradient(135deg,${colors.accent},#2563eb)`, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontFamily: "'Calibri', sans-serif" }}>Go Back</button>
            </div>
        );
         

        const q = questions[currentQ];
        const isSubmitted = submitted[currentQ];
        const selectedAns = answers[currentQ];
        const progress = ((currentQ + 1) / questions.length) * 100;
        return (
            <div style={{ padding: "32px", maxWidth: 780, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${selectedModule?.color || "#3b82f6"}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📝</div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedQuiz?.title}</div>
                        <div style={{ fontSize: 13, color: colors.textMid }}>{selectedModule?.moduleName}</div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
                        {selectedQuiz?.quizType === 'exam' && timeLeft !== null && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 10, background: timeLeft < 60 ? "#f43f5e22" : "rgba(59,130,246,0.1)", border: `1px solid ${timeLeft < 60 ? "#f43f5e44" : "rgba(59,130,246,0.2)"}`, color: timeLeft < 60 ? "#f43f5e" : colors.accent, fontWeight: 800, fontSize: 13 }}>
                                <Icon name="clock" size={16} />
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </div>
                        )}
                        <div style={{ fontSize: 13, fontWeight: 700, color: colors.accent }}>Q {currentQ + 1} / {questions.length}</div>
                    </div>
                </div>

                <div style={{ background: colors.border, borderRadius: 100, height: 6, marginBottom: 32, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, borderRadius: 100, background: `linear-gradient(90deg,${selectedModule?.color || "#3b82f6"},${colors.accent})`, transition: "width 0.5s ease" }} />
                </div>

                <div style={{ background: colors.glass, border: `1px solid ${colors.glassBorder}`, borderRadius: 24, padding: 32, backdropFilter: "blur(16px)", marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: colors.accent, marginBottom: 16 }}>Question {currentQ + 1}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.5, marginBottom: 28, color: colors.text }}>{q.questionText}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {(q.options || []).map((opt, oi) => {
                            let bg = colors.surfaceAlt, border = colors.border, textC = colors.text, icon = null;
                            if (isSubmitted) {
                                if (oi === q.correctAnswer) { bg = "rgba(16,185,129,0.15)"; border = "#10b981"; textC = "#10b981"; icon = <Icon name="check" size={16} />; }
                                else if (oi === selectedAns) { bg = "rgba(244,63,94,0.12)"; border = "#f43f5e"; textC = "#f43f5e"; icon = <Icon name="x" size={16} />; }
                            } else if (oi === selectedAns) { bg = `${colors.accent} 22`; border = colors.accent; textC = dark ? "#93c5fd" : "#2563eb"; }
                            return (
                                <div key={oi} onClick={() => handleAnswer(oi)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, background: bg, border: `1.5px solid ${border} `, cursor: isSubmitted ? "default" : "pointer", transition: "all 0.2s ease", color: textC, fontWeight: oi === selectedAns || (isSubmitted && oi === q.correctAnswer) ? 600 : 400 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, border: `1.5px solid ${border} `, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, background: oi === selectedAns || (isSubmitted && oi === q.correctAnswer) ? border : "transparent", color: oi === selectedAns || (isSubmitted && oi === q.correctAnswer) ? "#fff" : textC }}>
                                        {icon || String.fromCharCode(65 + oi)}
                                    </div>
                                    {opt}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isSubmitted && q.explanation && (
                    <div style={{ background: dark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.06)", border: `1px solid ${dark ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)"} `, borderRadius: 16, padding: "20px 24px", marginBottom: 20, animation: "fadeIn 0.4s ease" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 10, color: colors.accent }}>
                            <Icon name="lightbulb" size={16} />Explanation
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 1.7, color: colors.textMid }}>{q.explanation}</div>
                    </div>
                )}

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
                    <button onClick={() => setCurrentQ(q => Math.max(0, q - 1))} disabled={currentQ === 0} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 12, background: colors.surfaceAlt, border: `1px solid ${colors.border} `, color: currentQ === 0 ? colors.textFaint : colors.text, cursor: currentQ === 0 ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'Calibri', sans-serif", transition: "all 0.2s" }}>
                        <Icon name="chevronLeft" size={16} />Prev
                    </button>
                    {!isSubmitted && selectedQuiz?.quizType !== 'exam' ? (
                        <button onClick={handleSubmitAnswer} style={{ flex: 1, padding: "13px 24px", borderRadius: 12, background: `linear-gradient(135deg, ${colors.accent},#2563eb)`, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Calibri', sans-serif", boxShadow: `0 4px 20px ${colors.accentGlow} ` }}>
                            Submit Answer
                        </button>
                    ) : (
                        <div style={{ flex: 1 }} />
                    )}
                    <button onClick={() => { if (currentQ === questions.length - 1) handleFinalSubmit(); else setCurrentQ(q => q + 1); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", borderRadius: 12, background: currentQ === questions.length - 1 ? "linear-gradient(135deg,#10b981,#059669)" : colors.surfaceAlt, border: `1px solid ${currentQ === questions.length - 1 ? "#10b981" : colors.border} `, color: currentQ === questions.length - 1 ? "#fff" : colors.text, cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'Calibri', sans-serif", transition: "all 0.2s" }}>
                        {loading ? <Spinner /> : (currentQ === questions.length - 1 ? "Finish" : "Next")}<Icon name="chevronRight" size={16} />
                    </button>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {questions.map((_, i) => {
                        const hasAns = answers[i] !== undefined;
                        const isAns = submitted[i];
                        const isRight = isAns && questions[i].correctAnswer === answers[i];
                        let bubbleBg = colors.surfaceAlt;
                        let bubbleText = colors.textMid;
                        if (i === currentQ) { bubbleBg = colors.accent; bubbleText = "#fff"; }
                        else if (selectedQuiz?.quizType === 'exam') {
                            if (hasAns) { bubbleBg = "rgba(59,130,246,0.2)"; bubbleText = colors.accent; }
                        } else if (isAns) {
                            bubbleBg = isRight ? "#10b981" : "#f43f5e"; bubbleText = "#fff";
                        }
                        return (
                            <div key={i} onClick={() => setCurrentQ(i)} style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", background: bubbleBg, color: bubbleText, border: `1.5px solid ${i === currentQ ? colors.accent : colors.border} `, transition: "all 0.2s" }}>
                                {i + 1}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    
    };





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
            <div style={{ 
                minHeight: "100vh", 
                background: dark ? "#0a0f1e" : "#f0f7ff", 
                fontFamily: "'Outfit', sans-serif", 
                color: colors.text, 
                display: "flex",
                position: "relative",
                overflow: "hidden"
            }}>
                {/* Background Liquid Blobs */}
                <div style={{ position: "fixed", top: "-15%", left: "-10%", width: "65%", height: "65%", background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)", filter: "blur(100px)", borderRadius: "50%", zIndex: 0, animation: "float 12s infinite ease-in-out" }} />
                <div style={{ position: "fixed", bottom: "-20%", right: "-5%", width: "55%", height: "55%", background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)", filter: "blur(120px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 18s infinite ease-in-out" }} />
                <div style={{ position: "fixed", top: "25%", right: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)", filter: "blur(80px)", borderRadius: "50%", zIndex: 0, animation: "float 14s infinite ease-in-out reverse" }} />
                <div style={{ position: "fixed", bottom: "10%", left: "5%", width: "35%", height: "35%", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)", filter: "blur(70px)", borderRadius: "50%", zIndex: 0, animation: "float-alt 22s infinite ease-in-out" }} />

                <div style={{ display: "flex", width: "100%", position: "relative", zIndex: 1 }}>

                {/* SIDEBAR - HIDDEN DURING EXAMS */}
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
                        {sidebarLinks.map(link => (
                            <div key={link.id} onClick={() => navigateTo(link.id)} style={{ 
                                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, marginBottom: 4, 
                                background: page === link.id ? "rgba(255,255,255,0.15)" : "transparent", 
                                color: "#fff", cursor: "pointer", transition: "all 0.2s ease", 
                                fontWeight: page === link.id ? 700 : 500, fontSize: 14,
                                opacity: page === link.id ? 1 : 0.85
                            }} onMouseEnter={e => e.currentTarget.style.background = page === link.id ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)"} onMouseLeave={e => e.currentTarget.style.background = page === link.id ? "rgba(255,255,255,0.15)" : "transparent"}>
                                <Icon name={link.icon} size={18} />{link.label}
                            </div>
                        ))}
                    </nav>
                    <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, background: "rgba(0,0,0,0.05)" }}>
                            <div onClick={() => { navigateTo("settings"); setSettingsForm({ name: user?.name, email: user?.email, password: "", confirmPassword: "" }); }} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", flex: 1 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👤</div>
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user?.name || "Student"}</div>
                                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Student</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 6, marginLeft: 8 }}>
                                <div onClick={logout} style={{ cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 4 }}><Icon name="logout" size={18} /></div>
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* MAIN */}
                <div style={{ flex: 1, marginLeft: (page === "practice" && selectedQuiz?.quizType === "exam") ? 0 : 240, minHeight: "100vh" }}>
                    {!(page === "practice" && selectedQuiz?.quizType === "exam") && (
                        <div style={{ position: "sticky", top: 0, zIndex: 50, background: colors.glass, backdropFilter: "blur(20px) saturate(180%)", borderBottom: `1px solid ${colors.glassBorder}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>
                                {page === "dashboard" ? "All Modules" : page === "practiceList" ? "Practice Quizzes" : page === "examList" ? "Real Quizzes" : page === "quizList" ? selectedModule?.moduleName || "Quizzes" : page === "practice" ? selectedQuiz?.title || "Practice" : page === "ticket" ? "Raise Ticket" : "Results"}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ position: "relative", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => setShowAnnouncements(!showAnnouncements)}>
                                    <Icon name="bell" size={20} />
                                    {announcements.length > 0 && <span style={{ position: "absolute", top: -2, right: -4, background: "#f43f5e", width: 8, height: 8, borderRadius: "50%" }} />}
                                    {showAnnouncements && (
                                        <div style={{ position: "absolute", top: 36, right: -10, width: 360, maxHeight: 480, overflowY: "auto", background: dark ? "rgba(17,24,39,0.95)" : "rgba(255,255,255,0.95)", border: `1px solid ${colors.glassBorder}`, borderRadius: 20, padding: 0, boxShadow: "0 20px 40px rgba(0,0,0,0.3)", zIndex: 100, textAlign: "left", cursor: "default", backdropFilter: "blur(20px) saturate(180%)", animation: "fadeIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
                                            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.border}`, background: dark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#2563eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Icon name="bell" size={16} /></div>
                                                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: colors.text, fontFamily: "'Calibri', sans-serif" }}>Latest Announcements</h4>
                                                {announcements.length > 0 && <div style={{ marginLeft: "auto", background: colors.accent, color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 12 }}>{announcements.length} NEW</div>}
                                            </div>
                                            <div style={{ padding: "12px" }}>
                                                {announcements.length === 0 ? (
                                                    <div style={{ padding: "40px 20px", textAlign: "center" }}>
                                                        <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>📭</div>
                                                        <p style={{ fontSize: 14, color: colors.textMid, margin: 0, fontWeight: 600 }}>You're all caught up!</p>
                                                        <p style={{ fontSize: 12, color: colors.textFaint, margin: "4px 0 0" }}>Check back later for updates.</p>
                                                    </div>
                                                ) : announcements.map(a => (
                                                    <div key={a._id} style={{ padding: "16px", borderRadius: 14, transition: "background 0.2s, transform 0.2s", cursor: "pointer", position: "relative" }} onMouseEnter={e => { e.currentTarget.style.background = `${colors.accent}11`; e.currentTarget.style.transform = "scale(1.01)"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "scale(1)"; }}>
                                                        <div style={{ fontSize: 15, fontWeight: 800, color: colors.text, marginBottom: 4 }}>{a.title}</div>
                                                        <div style={{ fontSize: 13, color: colors.textMid, margin: "0 0 8px", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{a.description}</div>
                                                        <div style={{ fontSize: 11, color: colors.textFaint, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: colors.accent, opacity: 0.5 }} />
                                                            {new Date(a.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: colors.textMid, background: colors.surfaceAlt, padding: "6px 14px", borderRadius: 20, border: `1px solid ${colors.border}` }}>
                                    {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                </div>
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

