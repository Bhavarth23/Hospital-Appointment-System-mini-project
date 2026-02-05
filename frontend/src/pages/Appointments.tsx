import React, { useMemo, useState } from "react";
import { getAppointments } from "../services/api";

type Appointment = {
  _id: string;
  appointmentDate: string;
  status?: string;
  patient?: { name?: string };
  doctor?: { name?: string; specialization?: string };
};

type AppointmentsProps = {
  showToast: (message: string, type?: "success" | "error") => void;
};

const Appointments = ({ showToast }: AppointmentsProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const role = (localStorage.getItem("role") || "").toLowerCase();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getAppointments();
        setAppointments(res.data.data);
      } catch (err) {
        showToast("Failed to load appointments", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter(
      (apt) => (apt.status || "booked").toLowerCase() === filter,
    );
  }, [appointments, filter]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          Appointments
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          All Visits
        </h1>
        <p className="mt-2 text-xs font-medium text-slate-500">
          A focused view of upcoming and past appointments.
        </p>
      </div>

      <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs font-semibold text-slate-600">
            Filter by status
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All" },
              { key: "booked", label: "Upcoming" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] transition ${
                  filter === item.key
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200/70 bg-white/70 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading && (
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-6 text-xs text-slate-400">
              Loading appointments...
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-6 text-xs text-slate-400">
              No appointments found.
            </div>
          )}

          {!isLoading &&
            filtered.map((apt) => (
              <div
                key={apt._id}
                className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {role === "doctor"
                      ? apt.patient?.name || "Unknown Patient"
                      : apt.doctor?.name || "Unknown Doctor"}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-400">
                    {role === "doctor" ? "Patient" : "Specialist"}
                  </p>
                </div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-slate-400">
                  {new Date(apt.appointmentDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <span className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] ${
                  (apt.status || "booked").toLowerCase() === "booked"
                    ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-600"
                    : (apt.status || "booked").toLowerCase() === "completed"
                    ? "border-slate-200/70 bg-slate-100 text-slate-600"
                    : "border-rose-200/70 bg-rose-50/70 text-rose-600"
                }`}>
                  {apt.status || "booked"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
