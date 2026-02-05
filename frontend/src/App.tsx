import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Toast from "./components/Toast";

type ToastType = "success" | "error";

type ToastState = {
  show: boolean;
  message: string;
  type: ToastType;
};

// Helper component to handle scroll-to-top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User",
  );

  useEffect(() => {
    if (isLoggedIn) {
      setUserName(localStorage.getItem("userName") || "User");
    }
  }, [isLoggedIn]);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    showToast("Logged out successfully", "success");
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 text-slate-900 relative overflow-hidden">
        {/* Ambient background */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.22),_rgba(14,165,233,0.04),_transparent_70%)] blur-2xl"></div>
        <div className="pointer-events-none absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.2),_rgba(125,211,252,0.06),_transparent_70%)] blur-2xl"></div>
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.14),_rgba(20,184,166,0.04),_transparent_70%)] blur-2xl"></div>

        {/* Animated Toast Notification */}
        {toast.show && (
          <div className="fixed top-16 right-5 z-[100] animate-in fade-in slide-in-from-right-10 duration-300">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          </div>
        )}

        {/* Glass Navbar */}
        <nav className="sticky top-0 z-50 border-b border-slate-900/10 bg-slate-950/80 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 via-sky-600 to-teal-600 text-white shadow-[0_10px_24px_rgba(2,132,199,0.26)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10H7z" />
                  <path d="M12 4v16" />
                  <path d="M4 12h16" />
                </svg>
              </div>
              <Link
                to="/"
                className="text-lg font-semibold tracking-tight text-white"
              >
                HealthLink
              </Link>
            </div>

            <div className="flex items-center gap-5">
              {!isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-5">
                  <div className="hidden sm:flex flex-col items-end leading-none border-r border-white/15 pr-5">
                    <span className="text-[9px] uppercase tracking-[0.35em] text-slate-400 font-semibold mb-1">
                      Session
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {userName}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="text-xs font-semibold text-slate-200 transition hover:text-white"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/appointments"
                    className="text-xs font-semibold text-slate-200 transition hover:text-white"
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/settings"
                    className="text-xs font-semibold text-slate-200 transition hover:text-white"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="group flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-200 transition hover:bg-rose-600 hover:text-white"
                  >
                    Logout
                    <span className="text-xs transition-transform group-hover:translate-x-1">
                      {">"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Global Page Transition Wrapper */}
        <main className="relative mx-auto max-w-7xl px-6 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route
              path="/register"
              element={
                !isLoggedIn ? (
                  <Register showToast={showToast} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/login"
              element={
                !isLoggedIn ? (
                  <Login showToast={showToast} setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? (
                  <Dashboard showToast={showToast} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/appointments"
              element={
                isLoggedIn ? (
                  <Appointments showToast={showToast} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn ? (
                  <Settings
                    userName={userName}
                    setUserName={setUserName}
                    showToast={showToast}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/"
              element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="relative border-t border-slate-900/10 bg-slate-950/90 py-10">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 text-xs text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                HealthLink
              </p>
              <p className="text-xs font-medium text-slate-500">
                A modern portal for appointments, patient flow, and doctor
                availability management.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Platform
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
                <Link to="/appointments" className="hover:text-white">
                  Appointments
                </Link>
                <Link to="/settings" className="hover:text-white">
                  Settings
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Support
              </p>
              <div className="flex flex-col gap-2">
                <span>help@healthlink.com</span>
                <span>+1 (555) 010-2026</span>
                <span>Mon-Fri · 9:00-18:00</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Compliance
              </p>
              <div className="flex flex-col gap-2">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Security Practices</span>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-7xl flex-col items-start justify-between gap-3 px-6 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400 sm:flex-row sm:items-center">
            <span>(c) 2026 HealthLink Portal</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

