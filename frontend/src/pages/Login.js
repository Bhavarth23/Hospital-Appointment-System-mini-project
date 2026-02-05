import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ showToast, setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", credentials);

      // Store user details for the session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("userName", res.data.name);

      // Update global state in App.js
      setIsLoggedIn(true);

      showToast(`Welcome back, ${res.data.name || "User"}!`, "success");
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid Credentials";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] w-full max-w-md border border-white hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] transition-all duration-500 group">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-3xl mb-4 group-hover:scale-110 transition-transform duration-500">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Enter your credentials to access your portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group/input">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                ✉️
              </span>
              <input
                type="email"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-transparent border-2 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
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
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-black uppercase text-blue-600 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group/input">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                🔒
              </span>
              <input
                type="password"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-transparent border-2 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
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
            className="relative w-full overflow-hidden bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group/btn"
          >
            <span
              className={`flex items-center justify-center gap-2 ${isLoading ? "opacity-0" : "opacity-100"}`}
            >
              Sign In <span>→</span>
            </span>

            {/* Loading Spinner */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center mt-8 text-sm font-bold text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
