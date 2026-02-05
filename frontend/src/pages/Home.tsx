import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            HealthLink Portal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Modern care, effortlessly scheduled.
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Book appointments, manage consults, and keep your health journey on
            track with a calm, premium experience.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="rounded-full bg-slate-900 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_16px_36px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-full border border-slate-200 bg-white/80 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-[0_26px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Today
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  3 appointments
                </p>
              </div>
              <span className="rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Active
              </span>
            </div>
            <div className="space-y-3">
              {["Dermatology", "Cardiology", "Physiotherapy"].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-xs text-slate-600"
                >
                  <span className="font-semibold text-slate-700">{label}</span>
                  <span className="text-[9px] uppercase tracking-[0.28em] text-slate-400">
                    10:00 AM
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white">
              Fully synced with your doctor
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Smart Booking",
            text: "Find specialists quickly with clear availability windows.",
          },
          {
            title: "Visit Timeline",
            text: "Keep a clean history of consults and upcoming sessions.",
          },
          {
            title: "Doctor Workspace",
            text: "Manage hours, blocked dates, and patient flow.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-[1.75rem] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="mt-2 text-xs font-medium text-slate-500">
              {card.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
