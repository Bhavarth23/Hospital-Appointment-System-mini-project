import React, { useState, useEffect } from "react";
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
import Toast from "./components/Toast";

// Helper component to handle scroll-to-top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "User",
  );

  useEffect(() => {
    if (isLoggedIn) {
      setUserName(localStorage.getItem("userName") || "User");
    }
  }, [isLoggedIn]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    showToast("Logged out successfully", "success");
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50 selection:bg-blue-100">
        {/* Animated Toast Notification */}
        {toast.show && (
          <div className="fixed top-20 right-5 z-[100] animate-in fade-in slide-in-from-right-10 duration-300">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          </div>
        )}

        {/* Professional Glassmorphism Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 px-[5%] py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
              <span className="text-white text-xl">🏥</span>
            </div>
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent"
            >
              HealthLink
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end leading-none border-r border-slate-200 pr-6">
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">
                    Portal Access
                  </span>
                  <span className="text-slate-800 font-black text-sm">
                    {userName}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  className="text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-lg text-xs font-black hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                >
                  Logout
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Global Page Transition Wrapper */}
        <main className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Routes>
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
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>

        {/* Minimalist Footer for Recruiters */}
        <footer className="py-10 text-center border-t border-slate-100 mt-20">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">
            &copy; 2026 HealthLink Portal • Optimized for Mxpertz Infolabs
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
