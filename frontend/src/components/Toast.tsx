import React, { useEffect } from "react";

type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
  onClose: () => void;
};

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";
  const typeStyles = isSuccess
    ? "from-emerald-500/15 via-emerald-400/10 to-sky-400/10 border-emerald-300/30 text-emerald-950"
    : "from-rose-500/15 via-rose-400/10 to-amber-400/10 border-rose-300/30 text-rose-950";

  return (
    <div
      className={`group fixed top-6 right-6 z-[9999] w-[340px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[1.5rem] border bg-gradient-to-br ${typeStyles} shadow-[0_24px_50px_rgba(16,24,40,0.12)] backdrop-blur-2xl animate-in fade-in slide-in-from-right-6 duration-500`}
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-white/25 blur-3xl"></div>
      <div className="pointer-events-none absolute -left-10 -bottom-12 h-24 w-24 rounded-full bg-white/20 blur-3xl"></div>

      <div className="relative flex items-start gap-3 px-5 py-4">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-white/60 text-lg shadow-[0_8px_18px_rgba(0,0,0,0.08)] ${
            isSuccess ? "border-emerald-200/70" : "border-rose-200/70"
          }`}
          aria-hidden="true"
        >
          {isSuccess ? (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.6L2.6 18.1a2 2 0 0 0 1.8 2.9h15.2a2 2 0 0 0 1.8-2.9L13.7 3.6a2 2 0 0 0-3.4 0z" />
            </svg>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-black/45">
            {isSuccess ? "Appointment Confirmed" : "Attention Needed"}
          </p>
          <p className="mt-1 text-[13px] font-semibold leading-snug tracking-tight text-black/90">
            {message}
          </p>
        </div>

        {/* Manual Close Button */}
        <button
          onClick={onClose}
          className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/5 bg-white/70 text-[10px] font-semibold text-black/60 shadow-sm transition hover:text-black/90 hover:shadow-md"
          aria-label="Dismiss notification"
        >
          x
        </button>
      </div>

      {/* Progress Bar */}
      <div className="relative h-1.5 w-full bg-black/5">
        <div className="h-full w-full animate-progress-shrink bg-black/20"></div>
      </div>
    </div>
  );
};

export default Toast;

