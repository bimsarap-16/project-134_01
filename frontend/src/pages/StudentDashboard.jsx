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