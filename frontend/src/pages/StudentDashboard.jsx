const renderFilteredQuizzes = (type) => {
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
                            // ===============================
                            // 3rd COMMIT — EXAM STATUS LOGIC
                            // ===============================
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
                            // ===============================

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

                                            {quiz.quizType === "exam" && quiz.scheduledStart && (
                                                <span>🕐 {new Date(quiz.scheduledStart).toLocaleString()}</span>
                                            )}
                                        </div>

                                        {/* 3rd commit status indicator */}
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
                                                    : "pointer",
                                            transition: "all 0.2s",
                                            boxShadow:
                                                quiz.quizType === "exam" && status.disabled
                                                    ? "none"
                                                    : "0 4px 12px rgba(59,130,246,0.2)",
                                            fontFamily: "'Calibri', sans-serif",
                                            whiteSpace: "nowrap"
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