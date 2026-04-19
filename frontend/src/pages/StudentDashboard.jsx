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



const StudentDashboard = () => {
   
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



 const handleDownloadReport = async (quizId) => {
        try {
            const res = await resultAPI.getPublicReport(quizId);
            const { quizTitle, moduleName, examDate, results } = res.data.data;

            const win = window.open("", "_blank");
            win.document.write(`
                <html>
                    <head>
                        <title>Exam Report - ${quizTitle}</title>
                        <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
                            .header h1 { margin: 0; color: #3b82f6; font-size: 28px; }
                            .header p { margin: 5px 0; color: #64748b; font-size: 14px; }
                            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background: #f8fafc; padding: 20px; borderRadius: 12px; }
                            .meta-item { font-size: 14px; }
                            .meta-label { font-weight: 700; color: #64748b; display: block; margin-bottom: 2px; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th { background: #3b82f6; color: white; text-align: left; padding: 12px 15px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
                            td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
                            tr:nth-child(even) { background: #f1f5f9; }
                            .rank { font-weight: 700; color: #3b82f6; width: 40px; }
                            .percentage { font-weight: 700; text-align: right; }
                            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                            @media print { .no-print { display: none; } }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>Examination Results Report</h1>
                            <p>Generated by QuizHub LMS</p>
                        </div>
                        <div class="meta">
                            <div class="meta-item"><span class="meta-label">Module</span>${moduleName}</div>
                            <div class="meta-item"><span class="meta-label">Exam Title</span>${quizTitle}</div>
                            <div class="meta-item"><span class="meta-label">Exam Date</span>${new Date(examDate).toLocaleDateString()}</div>
                            <div class="meta-item"><span class="meta-label">Generation Date</span>${new Date().toLocaleString()}</div>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th class="rank">#</th>
                                    <th>Student Name</th>
                                    <th>Score</th>
                                    <th style="text-align: right">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${results.map((r, i) => `
                                    <tr>
                                        <td class="rank">${i + 1}</td>
                                        <td>${r.studentName}</td>
                                        <td>${r.score} / ${r.totalMarks}</td>
                                        <td class="percentage">${r.percentage}%</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                        <div class="footer">
                            &copy; ${new Date().getFullYear()} QuizHub Learning Management System. All rights reserved.
                        </div>
                        <script>
                            window.onload = () => {
                                setTimeout(() => {
                                    window.print();
                                }, 500);
                            };
                        </script>
                    </body>
                </html>
            `);
            win.document.close();
        } catch (e) {
            showToast(e.response?.data?.message || "Failed to generate report", "error");
        }
    };

 

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

// ── RENDER RESULTS ─────────────────────────────────────────────────────────────
    const renderResults = () => {
        if (gradedResult) {
            if (selectedQuiz?.quizType === 'exam') {
                return (
                    <div style={{ padding: 60, textAlign: "center", maxWidth: 680, margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: colors.text }}>You submitted Exam Successfully..!!</h2>
                        <p style={{ color: colors.textMid, marginBottom: 40 }}>Your answers have been securely recorded.</p>
                        <button onClick={() => navigateTo("dashboard")} style={{ padding: "14px 32px", borderRadius: 12, background: `linear-gradient(135deg, ${colors.accent},#2563eb)`, border: "none", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Calibri', sans-serif", boxShadow: `0 4px 20px ${colors.accentGlow} ` }}>
                            Back to Dashboard
                        </button>
                    </div>
                );
            }
            const pct = parseFloat(gradedResult.percentage) || 0;
            const perf = pct >= 80 ? { label: "Excellent! 🏆", color: "#f59e0b" } : pct >= 60 ? { label: "Good Job! ✅", color: "#10b981" } : { label: "Need Improvement 📚", color: "#f43f5e" };
            return (
                <div style={{ padding: 32, maxWidth: 680, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Session Results</h2>
                    <p style={{ color: colors.textMid, marginBottom: 32 }}>Here's how you performed</p>
                    <div style={{ textAlign: "center", marginBottom: 36 }}>
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 160, height: 160, borderRadius: "50%", background: `conic-gradient(${perf.color} ${pct * 3.6}deg, ${colors.border} 0deg)`, padding: 4, marginBottom: 16 }}>
                            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: colors.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                <div style={{ fontSize: 38, fontWeight: 900, color: perf.color }}>{pct}%</div>
                                <div style={{ fontSize: 12, color: colors.textMid, fontWeight: 600 }}>SCORE</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: perf.color }}>{perf.label}</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
                        {[
                            { label: "Score", value: `${gradedResult.score}/${gradedResult.totalMarks}`, color: colors.accent, icon: "📋" },
                            { label: "Percentage", value: `${pct}%`, color: "#10b981", icon: "✅" },
                            { label: "Status", value: gradedResult.autoSubmitted ? "Auto-submitted" : "Submitted", color: gradedResult.autoSubmitted ? "#f59e0b" : "#10b981", icon: "📤" },
                        ].map((s, i) => (
                            <div key={i} style={{ background: colors.glass, border: `1px solid ${colors.glassBorder}`, borderRadius: 18, padding: 20, textAlign: "center", backdropFilter: "blur(12px)" }}>
                                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                                <div style={{ fontSize: 13, color: colors.textMid }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button onClick={() => { setGradedResult(null); openQuiz(selectedQuiz); }} style={{ flex: 1, padding: 14, borderRadius: 12, background: `linear-gradient(135deg,${colors.accent},#2563eb)`, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Calibri', sans-serif" }}>
                            Retry Quiz
                        </button>
                        <button onClick={() => navigateTo("dashboard")} style={{ flex: 1, padding: 14, borderRadius: 12, background: colors.surfaceAlt, border: `1px solid ${colors.border}`, color: colors.text, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Calibri', sans-serif" }}>
                            Dashboard
                        </button>
                    </div>

                    {selectedQuiz?.quizType !== 'exam' && attemptHistory.length > 1 && (
                        <div style={{ marginTop: 40, padding: "32px 24px", background: "#fff", borderRadius: 24, boxShadow: "0 10px 40px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", margin: 0 }}>Result Improvement 📈</h3>
                                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{attemptHistory.length} Total Attempts</div>
                            </div>

                            <div style={{ position: "relative", height: 240, padding: "0 10px 40px", display: "flex", alignItems: "stretch", justifyContent: "space-around", gap: 16 }}>
                                {[0, 25, 50, 75, 100].map(val => (
                                    <div key={val} style={{ position: "absolute", left: 0, right: 0, bottom: `${val}%`, height: 1, background: "#f1f5f9", zIndex: 0 }} />
                                ))}

                                {attemptHistory.map((att, idx) => (
                                    <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", height: "100%", zIndex: 1 }}>
                                        <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                            <div style={{
                                                width: "100%", maxWidth: 84, height: `${att.percentage}%`,
                                                background: "#facc15",
                                                borderRadius: "4px 4px 0 0", transition: "height 1s cubic-bezier(0.4, 0, 0.2, 1)",
                                                position: "relative", minHeight: 4,
                                                boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.05)"
                                            }}>
                                                <div style={{ position: "absolute", top: -26, left: "50%", transform: "translateX(-50%)", fontSize: 12, fontWeight: 900, color: "#1e293b" }}>{att.percentage}%</div>
                                                {(idx === attemptHistory.length - 1) && (
                                                    <div style={{ position: "absolute", top: -52, left: "50%", transform: "translateX(-50%)", background: "#1e293b", color: "#facc15", padding: "2px 8px", borderRadius: 4, fontSize: 9, fontWeight: 900, whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>LATEST</div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800, marginTop: 16, position: "absolute", bottom: -30 }}>Try {att.attemptNumber}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: 24, padding: "16px 20px", borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ fontSize: 24 }}>💡</div>
                                <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                                    {(() => {
                                        const first = attemptHistory[0].percentage;
                                        const last = attemptHistory[attemptHistory.length - 1].percentage;
                                        const diff = last - first;
                                        if (diff > 0) return <span>Great progress! You've improved your score by <strong>{diff}%</strong> since your first attempt. Keep it up!</span>;
                                        if (diff < 0) return <span>Focus on the areas you missed. Your first attempt was better by {Math.abs(diff)}%. Review the explanations and try again!</span>;
                                        return <span>Consistency is key. Keep practicing to reach higher scores!</span>;
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        const examResults = results.filter(r => r.quizId?.quizType === "exam");

        // History results
        return (
            <div style={{ padding: "32px", maxWidth: 720, margin: "0 auto" }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 24 }}>My Results History</h2>
                {examResults.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 60, color: colors.textMid }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
                        <div>No exam results yet. Complete a real exam to see your results here.</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {examResults.map((r, i) => {
                            const pct = (r?.totalMarks || 0) > 0 ? ((r?.score / r?.totalMarks) * 100).toFixed(1) : 0;
                            return (
                                <div key={i} style={{ background: colors.glass, border: `1px solid ${colors.glassBorder}`, borderRadius: 18, padding: "18px 24px", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `conic-gradient(${+pct >= 60 ? "#10b981" : "#f43f5e"} ${+pct * 3.6}deg,${colors.border} 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 12, background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: +pct >= 60 ? "#10b981" : "#f43f5e" }}>{pct}%</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15 }}>{r.quizId?.title || "Quiz"}</div>
                                        <div style={{ fontSize: 13, color: colors.textMid }}>{r.quizId?.moduleId?.moduleName} · {r.score}/{r.totalMarks} marks</div>
                                        <div style={{ fontSize: 12, color: colors.textFaint, marginTop: 2 }}>{new Date(r.submittedAt).toLocaleString()}</div>
                                    </div>
                                    {r.quizId?.quizType === "exam" && new Date(r.quizId?.scheduledEnd) < new Date() && (
                                        <button onClick={() => handleDownloadReport(r.quizId._id)} style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 12, padding: "8px 12px", color: colors.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} title="Download Class Report">
                                            📄 Report
                                        </button>
                                    )}
                                    <div style={{ fontSize: 12, background: r.autoSubmitted ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: r.autoSubmitted ? "#f59e0b" : "#10b981", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>
                                        {r.autoSubmitted ? "Auto" : "Submitted"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };
     const handleTicketSubmit = async () => {
        if (!ticketForm.title.trim() || !ticketForm.description.trim() || !ticketForm.lecturerId) {
            showToast("Title, description, and lecturer are required.", "error"); return;
        }
        setTicketLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", ticketForm.title);
            formData.append("description", ticketForm.description);
            formData.append("lecturerId", ticketForm.lecturerId);
            if (ticketFile) formData.append("file", ticketFile);

            await ticketAPI.create(formData);
            showToast("Ticket raised successfully!", "success");
            setTicketForm({ title: "", description: "", lecturerId: "" });
            setTicketFile(null);
            const res = await ticketAPI.getForStudent();
            setMyTickets(res.data.data || []);
            if (document.getElementById("ticket-file")) document.getElementById("ticket-file").value = "";
        } catch (e) {
            showToast(e.response?.data?.message || "Failed to raise ticket", "error");
        } finally {
            setTicketLoading(false);
        }
    };


    // ── RENDER RAISE TICKET ────────────────────────────────────────────────────────
    const handleTicketSubmit = async () => {
        if (!ticketForm.title.trim() || !ticketForm.description.trim() || !ticketForm.lecturerId) {
            showToast("Title, description, and lecturer are required.", "error"); return;
        }
        setTicketLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", ticketForm.title);
            formData.append("description", ticketForm.description);
            formData.append("lecturerId", ticketForm.lecturerId);
            if (ticketFile) formData.append("file", ticketFile);

            await ticketAPI.create(formData);
            showToast("Ticket raised successfully!", "success");
            setTicketForm({ title: "", description: "", lecturerId: "" });
            setTicketFile(null);
            const res = await ticketAPI.getForStudent();
            setMyTickets(res.data.data || []);
            if (document.getElementById("ticket-file")) document.getElementById("ticket-file").value = "";
        } catch (e) {
            showToast(e.response?.data?.message || "Failed to raise ticket", "error");
        } finally {
            setTicketLoading(false);
        }
    };

    const renderRaiseTicket = () => (
        <div style={{ padding: "32px", maxWidth: 780, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: colors.text }}>{editingTicket ? "Update Ticket" : "Raise a Ticket"}</h2>
                {editingTicket && <button onClick={() => { setEditingTicket(null); setTicketForm({ title: "", description: "", lecturerId: "" }); }} style={{ background: "transparent", border: "none", color: colors.accent, fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Cancel Edit</button>}
            </div>
            <p style={{ color: colors.textMid, marginBottom: 32 }}>{editingTicket ? "Correct your ticket details below. This is available for 1 hour after submission." : "Have a question or issue? Raise a ticket to a specific lecturer."}</p>

            <div style={{ background: colors.glass, border: `1px solid ${colors.glassBorder}`, borderRadius: 24, padding: 32, backdropFilter: "blur(12px)" }}>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: colors.textMid, marginBottom: 8 }}>SELECT LECTURER <span style={{ color: "#f43f5e" }}>*</span></label>
                    <select value={ticketForm.lecturerId} onChange={e => setTicketForm({ ...ticketForm, lecturerId: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: colors.surfaceAlt, border: `1px solid ${colors.border}`, color: colors.text, outline: "none", fontSize: 14, fontFamily: "'Calibri', sans-serif" }}>
                        <option value="">-- Choose Lecturer --</option>
                        {lecturers.map(l => <option key={l._id} value={l._id}>{l.name} ({l.email})</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: colors.textMid, marginBottom: 8 }}>TICKET TITLE <span style={{ color: "#f43f5e" }}>*</span></label>
                    <input type="text" value={ticketForm.title} onChange={e => setTicketForm({ ...ticketForm, title: e.target.value })} placeholder="e.g. Question about Module 1" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: colors.surfaceAlt, border: `1px solid ${colors.border}`, color: colors.text, outline: "none", fontSize: 14, boxSizing: "border-box", fontFamily: "'Calibri', sans-serif" }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: colors.textMid, marginBottom: 8 }}>DESCRIPTION <span style={{ color: "#f43f5e" }}>*</span></label>
                    <textarea value={ticketForm.description} onChange={e => setTicketForm({ ...ticketForm, description: e.target.value })} placeholder="Explain your issue here..." style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: colors.surfaceAlt, border: `1px solid ${colors.border}`, color: colors.text, outline: "none", fontSize: 14, boxSizing: "border-box", minHeight: 120, resize: "vertical", fontFamily: "'Calibri', sans-serif" }} />
                </div>
                <div style={{ marginBottom: 32 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: colors.textMid, marginBottom: 8 }}>ATTACHMENT (OPTIONAL)</label>
                    <input id="ticket-file" type="file" onChange={e => setTicketFile(e.target.files[0])} style={{ color: colors.text, fontSize: 14, fontFamily: "'Calibri', sans-serif" }} />
                </div>
                <button onClick={handleTicketSubmit} disabled={ticketLoading} style={{ width: "100%", padding: "14px", borderRadius: 12, background: `linear-gradient(135deg,${colors.accent},#2563eb)`, border: "none", color: "#fff", fontWeight: 700, fontSize: 15, cursor: ticketLoading ? "not-allowed" : "pointer", boxShadow: `0 4px 20px ${colors.accentGlow}`, fontFamily: "'Calibri', sans-serif" }}>
                    {ticketLoading ? (editingTicket ? "Updating..." : "Submitting...") : (editingTicket ? "Update Ticket Details" : "Submit Ticket")}
                </button>
            </div>

            <div style={{ marginTop: 48 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: colors.accent }}>
                        <Icon name="ticket" size={20} />
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: colors.text }}>My Ticket History</h3>
                    {myTickets.length > 0 && <div style={{ marginLeft: "auto", background: colors.surfaceAlt, color: colors.textMid, fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 20 }}>{myTickets.length} TOTAL</div>}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {myTickets.length === 0 ? (
                        <div style={{ padding: "60px 40px", textAlign: "center", background: colors.glass, borderRadius: 24, border: `1px solid ${colors.glassBorder}`, backdropFilter: "blur(8px)" }}>
                            <div style={{ fontSize: 40, marginBottom: 16 }}>📨</div>
                            <h4 style={{ fontSize: 16, fontWeight: 750, color: colors.text, margin: "0 0 4px" }}>No tickets yet</h4>
                            <p style={{ fontSize: 13, color: colors.textMid, margin: 0 }}>Any tickets you raise will appear here with their status updates.</p>
                        </div>
                    ) : myTickets.map(t => (
                        <div key={t._id} style={{ background: colors.glass, border: `1px solid ${colors.glassBorder}`, borderRadius: 24, padding: "24px", backdropFilter: "blur(12px)", transition: "all 0.2s ease" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 17, fontWeight: 800, color: colors.text, marginBottom: 6 }}>{t.title}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ fontSize: 12, color: colors.textMid, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                                <div style={{ width: 22, height: 22, borderRadius: "50%", background: colors.accent + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>👨‍🏫</div>
                                                {t.lecturerId?.name || "Lecturer"}
                                            </div>
                                            <div style={{ width: 4, height: 4, borderRadius: "50%", background: colors.border }} />
                                            <div style={{ fontSize: 12, color: colors.textMid, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                                                <Icon name="clock" size={14} />
                                                {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                        <div style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 800, textTransform: "uppercase", background: t.status === "resolved" ? "#10b98122" : "#f59e0b22", color: t.status === "resolved" ? "#10b981" : "#f59e0b", border: `1px solid ${t.status === "resolved" ? "#10b98144" : "#f59e0b44"}`, display: "flex", alignItems: "center", gap: 6 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.status === "resolved" ? "#10b981" : "#f59e0b" }} />
                                            {t.status}
                                        </div>
                                        {t.status === "open" && (now - new Date(t.createdAt)) < 3600000 && (
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                                                <button onClick={() => {
                                                    setEditingTicket(t);
                                                    setTicketForm({ title: t.title, description: t.description, lecturerId: t.lecturerId?._id || t.lecturerId });
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }} style={{ padding: "6px 12px", borderRadius: 8, background: colors.accent, border: "none", color: "#fff", fontSize: 11, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: `0 4px 12px ${colors.accent}44` }}>
                                                    ✎ Edit Ticket
                                                </button>
                                                <div style={{ fontSize: 10, color: colors.textMid, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Icon name="clock" size={10} />
                                                    {(() => {
                                                        const diff = 3600000 - (now - new Date(t.createdAt));
                                                        const m = Math.floor(diff / 60000);
                                                        const s = Math.floor((diff % 60000) / 1000);
                                                        return `${m}m ${s}s left to edit`;
                                                    })()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            <div style={{ fontSize: 14, color: colors.textMid, lineHeight: 1.6, paddingBottom: t.fileUrl ? 16 : 0, borderBottom: t.fileUrl ? `1px solid ${colors.border}` : "none" }}>{t.description}</div>
                            {t.fileUrl && (
                                <a href={t.fileUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13, color: colors.accent, fontWeight: 700, textDecoration: "none", transition: "opacity 0.2s" }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                                    <div style={{ padding: 6, borderRadius: 8, background: colors.accent + "11" }}>📎</div>
                                    View Attached Document
                                </a>
                            )}

                            {t.response && (
                                <div style={{ marginTop: 20, padding: 20, borderRadius: 16, background: colors.accent + "08", borderLeft: `4px solid ${colors.accent}`, animation: "fadeIn 0.5s ease" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: colors.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>💬</div>
                                        <div style={{ fontSize: 13, fontWeight: 800, color: colors.accent, letterSpacing: "0.02em" }}>LECTURER RESPONSE</div>
                                    </div>
                                    <div style={{ fontSize: 14, color: colors.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{t.response}</div>
                                    <div style={{ marginTop: 10, fontSize: 11, color: colors.textMid, fontWeight: 600 }}>Resolved on {new Date(t.respondedAt).toLocaleString()}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );



const sidebarLinks = [
        { id: "dashboard", label: "Dashboard", icon: "dashboard" },
        { id: "practiceList", label: "Practice Quizzes", icon: "practice" },
        { id: "examList", label: "Real Quizzes", icon: "trophy" },
        { id: "results", label: "Results", icon: "trophy" },
        { id: "ticket", label: "Raise Ticket", icon: "ticket" },
    ];


    return (
        <div style={{ padding: "32px", maxWidth: 820, margin: "0 auto" }}>
            <button
                onClick={() => navigateTo("dashboard")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "none",
                    color: colors.textMid,
                    cursor: "pointer",
                    fontFamily: "'Calibri', sans-serif",
                    marginBottom: 24,
                    fontSize: 14
                }}
            >
                <Icon name="chevronLeft" size={16} />
                Back to Dashboard
            </button>

            <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px", color: colors.text }}>
                    {type === "exam" ? "Real Quizzes" : "Practice Quizzes"}
                </h2>
                <p style={{ margin: 0, color: colors.textMid, fontSize: 14 }}>
                    {type === "exam"
                        ? "Take officially scheduled exams in a secure environment."
                        : "Sharpen your skills with practice quizzes."}
                </p>
            </div>

            {pageLoading ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: 40,
                        color: colors.textMid,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12
                    }}
                >
                    <Spinner />
                    Loading quizzes...
                </div>
            ) : filteredQuizzes.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: colors.textMid }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>
                        No {type === "exam" ? "real exams" : "practice quizzes"} available yet
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {filteredQuizzes
                        .filter((quiz) => quiz.quizType === type)
                        .map((quiz) => {

                            
                            const now = new Date();
                            const start = quiz.scheduledStart ? new Date(quiz.scheduledStart) : null;
                            const end = quiz.scheduledEnd ? new Date(quiz.scheduledEnd) : null;

                            let status = {
                                label: "AVAILABLE NOW",
                                color: "#10b981",
                                disabled: false
                            };

                            if (quiz.quizType === "exam") {
                                if (start && now < start) {
                                    status = {
                                        label: "COMING SOON",
                                        color: "#f59e0b",
                                        disabled: true
                                    };
                                } else if (end && now > end) {
                                    status = {
                                        label: "CLOSED",
                                        color: "#ef4444",
                                        disabled: true
                                    };
                                }
                            }
                            

                            return (
                                <div
                                    key={quiz._id}
                                    style={{
                                        background: colors.glass,
                                        border: `1px solid ${colors.glassBorder}`,
                                        borderRadius: 18,
                                        padding: "20px 24px",
                                        backdropFilter: "blur(12px)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                                            {quiz.title}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: colors.textMid,
                                                display: "flex",
                                                gap: 12,
                                                flexWrap: "wrap",
                                                marginBottom: 8
                                            }}
                                        >
                                            <span
                                                style={{
                                                    background:
                                                        quiz.quizType === "exam"
                                                            ? "rgba(244,63,94,0.15)"
                                                            : "rgba(16,185,129,0.15)",
                                                    color:
                                                        quiz.quizType === "exam"
                                                            ? "#f43f5e"
                                                            : "#10b981",
                                                    padding: "2px 10px",
                                                    borderRadius: 20,
                                                    fontWeight: 600,
                                                    fontSize: 12
                                                }}
                                            >
                                                {quiz.quizType === "exam" ? "📋 Exam" : "✏️ Practice"}
                                            </span>

                                            <span>⏱ {quiz.duration} min</span>

                                            {/* 🔥 4th COMMIT — TIME PREVIEW */}
                                            {quiz.quizType === "exam" && quiz.scheduledEnd && (
                                                <span style={{ color: "#ef4444", fontWeight: 700 }}>
                                                    ⌛ Ends: {new Date(quiz.scheduledEnd).toLocaleTimeString()}
                                                </span>
                                            )}

                                            {quiz.quizType === "exam" && quiz.scheduledStart && (
                                                <span>🕐 {new Date(quiz.scheduledStart).toLocaleString()}</span>
                                            )}
                                        </div>

                                        {/* Status Indicator */}
                                        {quiz.quizType === "exam" && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: status.color
                                                    }}
                                                />
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        color: colors.textFaint,
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    {status.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => openQuiz(quiz)}
                                        disabled={quiz.quizType === "exam" ? status.disabled : loading}
                                        style={{
                                            padding: "10px 22px",
                                            borderRadius: 12,
                                            border: "none",
                                            background:
                                                quiz.quizType === "exam" && status.disabled
                                                    ? colors.surfaceAlt
                                                    : "linear-gradient(135deg,#3b82f6,#2563eb)",
                                            color:
                                                quiz.quizType === "exam" && status.disabled
                                                    ? colors.textFaint
                                                    : "#fff",
                                            fontWeight: 700,
                                            fontSize: 14,
                                            cursor:
                                                quiz.quizType === "exam" && status.disabled
                                                    ? "not-allowed"
                                                    : "pointer"
                                        }}
                                    >
                                        {quiz.quizType === "exam"
                                            ? status.label === "CLOSED"
                                                ? "EXPIRED"
                                                : status.label === "COMING SOON"
                                                ? "NOT YET"
                                                : "START →"
                                            : "START →"}
                                    </button>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};
