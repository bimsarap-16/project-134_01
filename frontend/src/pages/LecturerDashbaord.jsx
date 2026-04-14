import React from "react";

/* ─── Icon (UI only) ─── */
const Icon = ({ children }) => (
  <span style={{ fontSize: 18 }}>{children}</span>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value }) => (
  <div style={{
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    flex: 1
  }}>
    <p style={{ color: "#94a3b8", margin: 0 }}>{label}</p>
    <h2 style={{ marginTop: 8 }}>{value}</h2>
  </div>
);

/* ─── Main UI ─── */
export default function LecturerDashboardUI() {
  return (
    <div style={layout}>
      
      {/* Sidebar */}
      <div style={sidebar}>
        <h2 style={logo}>QuizHub</h2>

        <div style={menu}>
          <MenuItem label="Dashboard" active />
          <MenuItem label="Practice Quiz" />
          <MenuItem label="Exams" />
          <MenuItem label="Results" />
          <MenuItem label="Announcements" />
        </div>

        <div style={userBox}>
          <Icon>👤</Icon> Lecturer
        </div>
      </div>

      {/* Main Content */}
      <div style={main}>
        
        {/* Top Bar */}
        <div style={topbar}>
          <h2>Lecturer Dashboard</h2>

          <div style={topRight}>
            <Icon>🔔</Icon>
            <div style={profile}>👤</div>
          </div>
        </div>

        {/* Stats */}
        <div style={stats}>
          <StatCard label="Modules" value="5" />
          <StatCard label="Quizzes" value="12" />
          <StatCard label="Students" value="120" />
          <StatCard label="Results" value="340" />
        </div>

      </div>
    </div>
  );
}

/* ─── Menu Item ─── */
function MenuItem({ label, active }) {
  return (
    <div style={{
      padding: "12px",
      borderRadius: "10px",
      background: active ? "#3b82f6" : "transparent",
      color: active ? "#fff" : "#94a3b8",
      cursor: "pointer"
    }}>
      {label}
    </div>
  );
}

/* ─── Styles ─── */

const layout = {
  display: "flex",
  minHeight: "100vh",
  background: "#0a0f1e",
  color: "#fff",
  fontFamily: "sans-serif"
};

const sidebar = {
  width: "240px",
  background: "#1e293b",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between"
};

const logo = {
  marginBottom: "20px"
};

const menu = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const userBox = {
  padding: "10px",
  background: "#0f172a",
  borderRadius: "10px",
  textAlign: "center"
};

const main = {
  flex: 1,
  padding: "20px"
};

const topbar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px"
};

const topRight = {
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const profile = {
  background: "#1e293b",
  padding: "8px 12px",
  borderRadius: "10px"
};

const stats = {
  display: "flex",
  gap: "15px"
};