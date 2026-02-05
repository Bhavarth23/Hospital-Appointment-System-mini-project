import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

type ToastType = "success" | "error";

type LoginProps = {
  showToast: (message: string, type?: ToastType) => void;
  setIsLoggedIn: (value: boolean) => void;
};

const Login = ({ showToast, setIsLoggedIn }: LoginProps) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);

      // Store user details for the session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);

      // Update global state in App.tsx
      setIsLoggedIn(true);

      showToast(`Welcome back, ${res.data.name || "User"}!`, "success");
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Invalid Credentials";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-cyan-300/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-emerald-300/30 blur-3xl"></div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_26px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]"></div>

          <div className="relative">
            {/* Header Section */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3l8 4v10l-8 4-8-4V7z" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Sign in to manage appointments and consults.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16v16H4z" />
                      <path d="M4 6l8 6 8-6" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-white/70 bg-white/60 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-300/60 focus:bg-white focus:ring-4 focus:ring-cyan-200/30"
                    placeholder="doctor@healthlink.com"
                    required
                    onChange={(e) =>
                      setCredentials({ ...credentials, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[9px] font-semibold uppercase text-cyan-700 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="4" y="10" width="16" height="10" rx="2" />
                      <path d="M8 10V7a4 4 0 018 0v3" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-white/70 bg-white/60 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-300/60 focus:bg-white focus:ring-4 focus:ring-cyan-200/30"
                    placeholder="********"
                    required
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full overflow-hidden rounded-2xl bg-slate-900 py-3.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-white shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span
                  className={`flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                >
                  Sign In
                  <span className="text-lg">{'>'}</span>
                </span>

                {/* Loading Spinner */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  </div>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <p className="mt-7 text-center text-xs font-semibold text-slate-500">
              New here?{" "}
              <Link to="/register" className="text-cyan-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


