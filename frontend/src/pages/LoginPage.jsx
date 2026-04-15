import React from "react";

const colors = {
  bg: "#0a0f1e",
  surface: "rgba(30, 41, 59, 0.4)",
  border: "rgba(255,255,255,0.08)",
  accent: "#3b82f6",
  accentHover: "#2563eb",
  secondary: "#0ea5e9",
  text: "#F8FAFC",
  textMid: "#94A3B8",
  inputBg: "rgba(255,255,255,0.05)",
  inputText: "#fff",
  inputPlaceholder: "rgba(255,255,255,0.4)",
};

export default function LoginPageUI() {
  return (
    <div style={container}>
      {/* Background */}
      <div style={blob1} />
      <div style={blob2} />

      <div style={card}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={logo}>🎓</div>
          <h1 style={title}>QuizHub</h1>
          <p style={{ color: colors.textMid }}>Sign in to your account</p>
        </div>

        {/* Form UI */}
        <form>
          <div style={group}>
            <label style={label}>Email Address</label>
            <input
              type="email"
              placeholder="you@university.edu"
              style={input}
            />
          </div>

          <div style={group}>
            <label style={label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={input}
            />
          </div>

          <button style={button}>🔑 Sign In</button>
        </form>

        {/* Footer */}
        <p style={footer}>
          Don’t have an account?{" "}
          <span style={link}>Register here</span>
        </p>
      </div>
    </div>
  );
}

/* ───── Styles ───── */

const container = {
  minHeight: "100vh",
  background: "#0a0f1e",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  fontFamily: "sans-serif",
};

const blob1 = {
  position: "fixed",
  top: "-10%",
  left: "-10%",
  width: "60%",
  height: "60%",
  background:
    "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
  filter: "blur(100px)",
};

const blob2 = {
  position: "fixed",
  bottom: "-10%",
  right: "-10%",
  width: "60%",
  height: "60%",
  background:
    "radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)",
  filter: "blur(120px)",
};

const card = {
  width: "100%",
  maxWidth: "400px",
  background: "rgba(30, 41, 59, 0.4)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "30px",
  color: "#fff",
  backdropFilter: "blur(20px)",
};

const logo = {
  width: "60px",
  height: "60px",
  borderRadius: "15px",
  background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 10px",
  fontSize: "28px",
};

const title = {
  margin: 0,
};

const group = {
  marginBottom: "15px",
};

const label = {
  fontSize: "13px",
  color: "#94a3b8",
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  marginTop: "5px",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
};

const button = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: "bold",
  marginTop: "10px",
  cursor: "pointer",
};

const footer = {
  marginTop: "15px",
  textAlign: "center",
  fontSize: "13px",
  color: "#94a3b8",
};

const link = {
  color: "#38bdf8",
  cursor: "pointer",
};