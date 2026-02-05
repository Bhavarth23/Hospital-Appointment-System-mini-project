import React, { useEffect } from "react";

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Extended slightly for better readability
    return () => clearTimeout(timer);
  }, [onClose]);

  // Modern iconography based on type
  const icon = type === "success" ? "✅" : "⚠️";

  // Tailwind-based dynamic styling
  const typeStyles =
    type === "success"
      ? "border-emerald-500/20 bg-emerald-50/90 text-emerald-900"
      : "border-rose-500/20 bg-rose-50/90 text-rose-900";

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-4 px-6 py-4 rounded-[1.5rem] border backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-right-8 duration-500 ${typeStyles}`}
    >
      {/* Icon with soft background */}
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-xl text-lg ${type === "success" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}
      >
        {icon}
      </div>

      {/* Message Content */}
      <div className="flex flex-col">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 leading-none mb-1">
          Notification
        </p>
        <p className="text-sm font-bold tracking-tight">{message}</p>
      </div>

      {/* Manual Close Button */}
      <button
        onClick={onClose}
        className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors opacity-40 hover:opacity-100"
      >
        ✕
      </button>

      {/* Progress Bar Animation (Optional Visual Polish) */}
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-10 animate-progress-shrink w-full rounded-b-full"></div>
    </div>
  );
};

export default Toast;
