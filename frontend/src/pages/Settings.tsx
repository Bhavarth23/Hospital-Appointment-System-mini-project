import React, { useMemo, useState } from "react";

type SettingsProps = {
  userName: string;
  setUserName: (value: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
};

const Settings = ({ userName, setUserName, showToast }: SettingsProps) => {
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const roleLabel = useMemo(
    () => (localStorage.getItem("role") || "user").toUpperCase(),
    [],
  );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }
    if (!email.trim()) {
      showToast("Email cannot be empty", "error");
      return;
    }

    localStorage.setItem("userName", name.trim());
    localStorage.setItem("userEmail", email.trim().toLowerCase());
    setUserName(name.trim());
    showToast("Settings updated", "success");
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Settings
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          General
        </h1>
        <p className="mt-2 text-xs font-medium text-slate-500">
          Update your profile details and preferences.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Full Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-200/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@healthlink.com"
              className="w-full rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-200/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Role
            </label>
            <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              {roleLabel}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">
              Password
            </label>
            <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-xs font-medium text-slate-400">
              Use account recovery to change password
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
