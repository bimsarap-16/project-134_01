import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}import LoginPageUI from "./pages/LoginPageUI";
import RegisterPageUI from "./pages/RegisterPageUI";

export default function App() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0f1e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Outfit', sans-serif"
    }}>
      
      {/* Show Login UI */}
      <LoginPageUI />

      {/* OR show Register UI */}
      {/* <RegisterPageUI /> */}

    </div>
  );
}