import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const Register = ({ showToast }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Patient",
    specialization: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/register", formData);
      showToast("Account created! Please login to continue.", "success");
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 animate-in fade-in zoom-in duration-500">
      <div className="bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] w-full max-w-lg border border-white group">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-3xl mb-4 group-hover:rotate-6 transition-transform duration-500">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Join HealthLink to manage your appointments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              Full Name
            </label>
            <div className="relative group/input">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                👤
              </span>
              <input
                type="text"
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-transparent border-2 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                placeholder="John Doe"
                required
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
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
                placeholder="john@healthlink.com"
                required
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Role & Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Register As
              </label>
              <select
                value={formData.role}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent border-2 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                    specialization: "",
                  })
                }
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent border-2 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Conditional Specialization */}
          {formData.role === "Doctor" && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Medical Specialization
              </label>
              <div className="relative group/input">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors">
                  🩺
                </span>
                <input
                  type="text"
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 border-transparent border-2 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-medium text-slate-700"
                  placeholder="e.g. Cardiology, Pediatrics"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full overflow-hidden bg-slate-900 text-white py-4 mt-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className={isLoading ? "opacity-0" : "opacity-100"}>
              Create Account <span>→</span>
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {/* Login Footer Link */}
        <p className="text-center mt-8 text-sm font-bold text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
