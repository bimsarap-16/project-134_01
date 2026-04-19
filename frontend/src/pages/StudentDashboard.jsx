import { useState, useEffect, useRef } from "react";
import { moduleAPI, quizAPI, questionAPI, attemptAPI, resultAPI, chatbotAPI, announcementAPI, userAPI, ticketAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Chatbot from "../components/Chatbot";

const renderDashboard = () => (
    <div style={{ padding: "40px 40px 100px" }}>
        <div style={{ marginBottom: 36, animation: "fadeIn 0.6s ease both" }}>
            <div
                style={{
                    fontSize: 12,
                    color: colors.accent,
                    fontWeight: 800,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 10
                }}
            >
                Welcome Back, {user?.name}
            </div>

            <h1
                style={{
                    fontSize: 26,
                    fontWeight: 900,
                    margin: 0,
                    background: `linear-gradient(135deg, ${colors.text}, ${colors.textMid})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}
            >
                Your Learning Journey
            </h1>

            <p
                style={{
                    color: colors.textMid,
                    marginTop: 6,
                    fontSize: 14.5,
                    maxWidth: 540,
                    lineHeight: 1.5
                }}
            >
                Track your progress, practice concepts, and excel in your exams with AI-powered insights.
            </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 44 }}>
            {[
                {
                    id: "practiceList",
                    title: "Practice Quizzes",
                    text: "Sharpen your skills with un-timed practice sessions and instant feedback.",
                    icon: "practice",
                    color: "#3b82f6"
                },
                {
                    id: "examList",
                    title: "Real Quizzes",
                    text: "Take officially scheduled exams and earn your grades in a secure environment.",
                    icon: "trophy",
                    color: "#2563eb"
                }
            ].map((card, idx) => (
                <div
                    key={card.id}
                    onClick={() => navigateTo(card.id)}
                    style={{
                        position: "relative",
                        background: colors.glass,
                        border: `1px solid ${colors.glassBorder}`,
                        borderRadius: 28,
                        padding: "36px 30px",
                        color: colors.text,
                        cursor: "pointer",
                        transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        backdropFilter: "blur(32px) saturate(180%)",
                        overflow: "hidden",
                        animation: `fadeIn 0.6s ease both ${idx * 0.1}s`
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-10px) scale(1.01)";
                        e.currentTarget.style.boxShadow = `0 32px 64px ${card.color}20`;
                        e.currentTarget.style.background = dark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(255,255,255,0.6)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.02)";
                        e.currentTarget.style.background = colors.glass;
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: -30,
                            right: -30,
                            width: 110,
                            height: 110,
                            borderRadius: "50%",
                            background: card.color,
                            opacity: 0.15,
                            filter: "blur(32px)"
                        }}
                    />
                    <div
                        style={{
                            background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
                            width: 52,
                            height: 52,
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 20,
                            boxShadow: `0 10px 24px ${card.color}30`,
                            color: "#fff"
                        }}
                    >
                        <Icon name={card.icon} size={26} />
                    </div>

                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 8px", color: colors.text }}>
                        {card.title}
                    </h3>

                    <p style={{ fontSize: 13.5, color: colors.textMid, lineHeight: 1.5, margin: 0 }}>
                        {card.text}
                    </p>
                </div>
            ))}
        </div>

        {/* Recent Announcements */}
        <div style={{ animation: "fadeIn 0.6s ease both 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                    style={{
                        width: 42,
                        height: 42,
                        borderRadius: 12,
                        background: "rgba(245,158,11,0.15)",
                        color: "#f59e0b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(245,158,11,0.2)"
                    }}
                >
                    <Icon name="bell" size={20} />
                </div>

                <h3
                    style={{
                        margin: 0,
                        fontSize: 19,
                        fontWeight: 800,
                        color: colors.text
                    }}
                >
                    Recent Announcements
                </h3>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
                {announcements.length === 0 ? (
                    <div
                        style={{
                            padding: "48px 24px",
                            textAlign: "center",
                            background: colors.glass,
                            borderRadius: 24,
                            border: `1px solid ${colors.glassBorder}`,
                            borderStyle: "dashed"
                        }}
                    >
                        <p style={{ margin: 0, color: colors.textMid, fontSize: 14 }}>
                            No recent announcements yet.
                        </p>
                    </div>
                ) : (
                    announcements.slice(0, 3).map((a) => (
                        <div
                            key={a._id}
                            style={{
                                background: colors.glass,
                                padding: "20px 24px",
                                borderRadius: 20,
                                border: `1px solid ${colors.glassBorder}`,
                                backdropFilter: "blur(24px) saturate(180%)",
                                transition: "all 0.3s ease",
                                position: "relative",
                                overflow: "hidden"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = dark
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(255,255,255,0.6)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = colors.glass;
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: 8
                                }}
                            >
                                <div>
                                    <h4
                                        style={{
                                            margin: "0 0 4px",
                                            fontSize: 15.5,
                                            fontWeight: 700,
                                            color: colors.text
                                        }}
                                    >
                                        {a.title}
                                    </h4>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: 12,
                                            fontSize: 12,
                                            color: colors.textMid,
                                            fontWeight: 500,
                                            flexWrap: "wrap"
                                        }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <Icon name="clock" size={14} />
                                            {new Date(a.createdAt).toLocaleDateString()}
                                        </span>

                                        <span style={{ color: colors.accent, fontWeight: 700 }}>
                                            {a.moduleId?.moduleName || "General Announcement"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 13.5,
                                    color: colors.textMid,
                                    lineHeight: 1.55
                                }}
                            >
                                {a.description}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    </div>
);

const renderPractice = () => {
    if (!selectedQuiz || questions.length === 0) {
        return (
            <div style={{ padding: 60, textAlign: "center", color: colors.textMid }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: colors.text }}>No questions found</div>
                <button
                    onClick={() => navigateTo("quizList")}
                    style={{
                        marginTop: 20,
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: `linear-gradient(135deg,${colors.accent},#2563eb)`,
                        border: "none",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "'Calibri', sans-serif"
                    }}
                >
                    Go Back
                </button>
            </div>
        );
    }


    const q = questions[currentQ];
    const isSubmitted = submitted[currentQ];
    const selectedAns = answers[currentQ];
    const progress = ((currentQ + 1) / questions.length) * 100;


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
        <div style={{ padding: "32px", maxWidth: 780, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: `${selectedModule?.color || "#3b82f6"}22`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22
                    }}
                >
                    📝
                </div>

                <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedQuiz?.title}</div>
                    <div style={{ fontSize: 13, color: colors.textMid }}>{selectedModule?.moduleName}</div>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
                    {selectedQuiz?.quizType === "exam" && timeLeft !== null && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "6px 12px",
                                borderRadius: 10,
                                background: timeLeft < 60 ? "#f43f5e22" : "rgba(59,130,246,0.1)",
                                border: `1px solid ${timeLeft < 60 ? "#f43f5e44" : "rgba(59,130,246,0.2)"}`,
                                color: timeLeft < 60 ? "#f43f5e" : colors.accent,
                                fontWeight: 800,
                                fontSize: 13
                            }}
                        >
                            <Icon name="clock" size={16} />
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                        </div>
                    )}

                    <div style={{ fontSize: 13, fontWeight: 700, color: colors.accent }}>
                        Q {currentQ + 1} / {questions.length}
                    </div>
                </div>
            </div>

            <div
                style={{
                    background: colors.border,
                    borderRadius: 100,
                    height: 6,
                    marginBottom: 32,
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress}%`,
                        borderRadius: 100,
                        background: `linear-gradient(90deg,${selectedModule?.color || "#3b82f6"},${colors.accent})`,
                        transition: "width 0.5s ease"
                    }}
                />
            </div>

            <div
                style={{
                    background: colors.glass,
                    border: `1px solid ${colors.glassBorder}`,
                    borderRadius: 24,
                    padding: 32,
                    backdropFilter: "blur(16px)",
                    marginBottom: 20
                }}
            >
                <div
                    style={{
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: colors.accent,
                        marginBottom: 16
                    }}
                >
                    Question {currentQ + 1}
                </div>

                <div
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        lineHeight: 1.5,
                        marginBottom: 28,
                        color: colors.text
                    }}
                >
                    {q.questionText}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {(q.options || []).map((opt, oi) => {
                        let bg = colors.surfaceAlt;
                        let border = colors.border;
                        let textC = colors.text;
                        let icon = null;

                        if (isSubmitted) {
                            if (oi === q.correctAnswer) {
                                bg = "rgba(16,185,129,0.15)";
                                border = "#10b981";
                                textC = "#10b981";
                                icon = <Icon name="check" size={16} />;
                            } else if (oi === selectedAns) {
                                bg = "rgba(244,63,94,0.12)";
                                border = "#f43f5e";
                                textC = "#f43f5e";
                                icon = <Icon name="x" size={16} />;
                            }
                        } else if (oi === selectedAns) {
                            bg = `${colors.accent}22`;
                            border = colors.accent;
                            textC = dark ? "#93c5fd" : "#2563eb";
                        }

                        return (
                            <div
                                key={oi}
                                onClick={() => handleAnswer(oi)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    padding: "14px 18px",
                                    borderRadius: 14,
                                    background: bg,
                                    border: `1.5px solid ${border}`,
                                    cursor: isSubmitted ? "default" : "pointer",
                                    transition: "all 0.2s ease",
                                    color: textC,
                                    fontWeight: oi === selectedAns || (isSubmitted && oi === q.correctAnswer) ? 600 : 400
                                }}
                            >
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 8,
                                        border: `1.5px solid ${border}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 13,
                                        fontWeight: 700,
                                        flexShrink: 0,
                                        background: oi === selectedAns || (isSubmitted && oi === q.correctAnswer) ? border : "transparent",
                                        color: oi === selectedAns || (isSubmitted && oi === q.correctAnswer) ? "#fff" : textC
                                    }}
                                >
                                    {icon || String.fromCharCode(65 + oi)}
                                </div>
                                {opt}
                            </div>
                        );
                    })}
                </div>
            </div>

            {isSubmitted && q.explanation && (
                <div
                    style={{
                        background: dark ? "rgba(59,130,246,0.1)" : "rgba(59,130,246,0.06)",
                        border: `1px solid ${dark ? "rgba(59,130,246,0.3)" : "rgba(59,130,246,0.2)"}`,
                        borderRadius: 16,
                        padding: "20px 24px",
                        marginBottom: 20,
                        animation: "fadeIn 0.4s ease"
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, marginBottom: 10, color: colors.accent }}>
                        <Icon name="lightbulb" size={16} />
                        Explanation
                    </div>
                    <div style={{ fontSize: 14, lineHeight: 1.7, color: colors.textMid }}>
                        {q.explanation}
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
                <button
                    onClick={() => setCurrentQ((v) => Math.max(0, v - 1))}
                    disabled={currentQ === 0}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "12px 20px",
                        borderRadius: 12,
                        background: colors.surfaceAlt,
                        border: `1px solid ${colors.border}`,
                        color: currentQ === 0 ? colors.textFaint : colors.text,
                        cursor: currentQ === 0 ? "not-allowed" : "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: "'Calibri', sans-serif",
                        transition: "all 0.2s"
                    }}
                >
                    <Icon name="chevronLeft" size={16} />
                    Prev
                </button>

                {!isSubmitted && selectedQuiz?.quizType !== "exam" ? (
                    <button
                        onClick={handleSubmitAnswer}
                        style={{
                            flex: 1,
                            padding: "13px 24px",
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${colors.accent},#2563eb)`,
                            border: "none",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: "pointer",
                            fontFamily: "'Calibri', sans-serif",
                            boxShadow: `0 4px 20px ${colors.accentGlow}`
                        }}
                    >
                        Submit Answer
                    </button>
                ) : (
                    <div style={{ flex: 1 }} />
                )}

                <button
                    onClick={() => {
                        if (currentQ === questions.length - 1) handleFinalSubmit();
                        else setCurrentQ((v) => v + 1);
                    }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "12px 20px",
                        borderRadius: 12,
                        background: currentQ === questions.length - 1
                            ? "linear-gradient(135deg,#10b981,#059669)"
                            : colors.surfaceAlt,
                        border: `1px solid ${currentQ === questions.length - 1 ? "#10b981" : colors.border}`,
                        color: currentQ === questions.length - 1 ? "#fff" : colors.text,
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14,
                        fontFamily: "'Calibri', sans-serif",
                        transition: "all 0.2s"
                    }}
                >
                    {loading ? "..." : currentQ === questions.length - 1 ? "Finish" : "Next"}
                    <Icon name="chevronRight" size={16} />
                </button>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                {questions.map((_, i) => {
                    const hasAns = answers[i] !== undefined;
                    const isAns = submitted[i];
                    const isRight = isAns && questions[i].correctAnswer === answers[i];

                    let bubbleBg = colors.surfaceAlt;
                    let bubbleText = colors.textMid;

                    if (i === currentQ) {
                        bubbleBg = colors.accent;
                        bubbleText = "#fff";
                    } else if (selectedQuiz?.quizType === "exam") {
                        if (hasAns) {
                            bubbleBg = "rgba(59,130,246,0.2)";
                            bubbleText = colors.accent;
                        }
                    } else if (isAns) {
                        bubbleBg = isRight ? "#10b981" : "#f43f5e";
                        bubbleText = "#fff";
                    }

                    return (
                        <div
                            key={i}
                            onClick={() => setCurrentQ(i)}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: "pointer",
                                background: bubbleBg,
                                color: bubbleText,
                                border: `1.5px solid ${i === currentQ ? colors.accent : colors.border}`,
                                transition: "all 0.2s"
                            }}
                        >
                            {i + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};