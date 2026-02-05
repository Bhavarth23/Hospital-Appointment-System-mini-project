import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

type ToastType = "success" | "error";

type RegisterProps = {
  showToast: (message: string, type?: ToastType) => void;
};

const Register = ({ showToast }: RegisterProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/register", formData);
      showToast("Account created! Please login to continue.", "success");
      navigate("/login");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      showToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <div className="relative w-full max-w-xl">
        <div className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-sky-300/30 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-16 -bottom-12 h-36 w-36 rounded-full bg-teal-300/30 blur-3xl"></div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_26px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_60%)]"></div>

          <div className="relative">
            {/* Header Section */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-emerald-600 text-white shadow-lg">
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
                  <path d="M12 3l7 4v10l-7 4-7-4V7z" />
                  <path d="M12 7v10" />
                  <path d="M8 11h8" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Join HealthLink to manage your care seamlessly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Full Name
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
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-white/70 bg-white/60 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-300/60 focus:bg-white focus:ring-4 focus:ring-cyan-200/30"
                    placeholder="Jordan Park"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="jordan@healthlink.com"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Role & Password Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Register As
                  </label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      className="w-full appearance-none rounded-2xl border border-white/70 bg-white/60 px-5 py-3.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-cyan-300/60 focus:bg-white focus:ring-4 focus:ring-cyan-200/30"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value,
                          specialization: "",
                        })
                      }
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-2xl border border-white/70 bg-white/60 px-5 py-3.5 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-300/60 focus:bg-white focus:ring-4 focus:ring-cyan-200/30"
                    placeholder="********"
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Conditional Specialization */}
              {formData.role === "doctor" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Medical Specialization
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
                        <path d="M12 2v20" />
                        <path d="M5 9h14" />
                        <path d="M7 7h10" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="w-full rounded-2xl border border-white/70 bg-white/60 py-3.5 pl-11 pr-4 text-xs font-medium text-slate-700 outline-none transition focus:border-cyan-300/60 focus:bg-white focus:ring-4 focus:ring-cyan-200/30"
                      placeholder="Cardiology, Pediatrics"
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
                className="relative w-full overflow-hidden rounded-2xl bg-slate-900 py-3.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-white shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className={isLoading ? "opacity-0" : "opacity-100"}>
                  Create Account <span className="text-lg">{'>'}</span>
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                  </div>
                )}
              </button>
            </form>

            {/* Login Footer Link */}
            <p className="mt-7 text-center text-xs font-semibold text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



