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