import React, { useEffect, useState } from "react";
import {
  getUsers,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAvailability,
  updateDoctorAvailability,
} from "../services/api";

type ToastType = "success" | "error";

type DashboardProps = {
  showToast: (message: string, type?: ToastType) => void;
};

type Doctor = {
  _id: string;
  name: string;
  specialization?: string;
  role: string;
};

type Appointment = {
  _id: string;
  appointmentDate: string;
  status?: string;
  patient?: { name?: string };
  doctor?: { name?: string; specialization?: string };
};

type WeeklyHour = {
  day: string;
  start: string;
  end: string;
  enabled: boolean;
};

type Availability = {
  weeklyHours: WeeklyHour[];
  blockedDates: string[];
};

const Dashboard = ({ showToast }: DashboardProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availability, setAvailability] = useState<Availability>({
    weeklyHours: [],
    blockedDates: [],
  });
  const [newBlockedDate, setNewBlockedDate] = useState("");
  const role = (localStorage.getItem("role") || "").toLowerCase();
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    fetchData();
    if (role === "doctor" && userId) {
      fetchAvailability();
    }
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const usersRes = await getUsers();
      setDoctors(
        usersRes.data.data.filter((u: Doctor) =>
          u.role.toLowerCase().includes("doctor"),
        ),
      );

      const apptRes = await getAppointments();
      setAppointments(apptRes.data.data);
    } catch (err) {
      console.error("Fetch Error", err);
      showToast("Failed to fetch dashboard data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await getDoctorAvailability(userId);
      const data = res.data.data;
      setAvailability({
        weeklyHours: data?.weeklyHours || [],
        blockedDates: (data?.blockedDates || []).map((d: string) =>
          d.slice(0, 10),
        ),
      });
    } catch (err) {
      showToast("Failed to load availability", "error");
    }
  };

  const handleBook = async (doctorId: string) => {
    const date = prompt("Enter Appointment Date (YYYY-MM-DD):");
    if (!date) return;

    try {
      await bookAppointment({
        patient: userId,
        doctor: doctorId,
        appointmentDate: date,
      });
      showToast("Booking confirmed successfully!", "success");
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Booking failed", "error");
    }
  };

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id);
        showToast("Appointment cancelled", "success");
        fetchData();
      } catch (err) {
        showToast("Cancellation failed", "error");
      }
    }
  };

  const handleReschedule = async (id: string) => {
    const date = prompt("Enter New Appointment Date (YYYY-MM-DD):");
    if (!date) return;

    try {
      await rescheduleAppointment(id, { appointmentDate: date });
      showToast("Appointment rescheduled", "success");
      fetchData();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Reschedule failed", "error");
    }
  };

  const handleWeeklyChange = (
    index: number,
    key: keyof WeeklyHour,
    value: string | boolean,
  ) => {
    setAvailability((prev) => {
      const updated = [...prev.weeklyHours];
      updated[index] = { ...updated[index], [key]: value } as WeeklyHour;
      return { ...prev, weeklyHours: updated };
    });
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    setAvailability((prev) => ({
      ...prev,
      blockedDates: Array.from(
        new Set([...prev.blockedDates, newBlockedDate]),
      ).sort(),
    }));
    setNewBlockedDate("");
  };

  const handleRemoveBlockedDate = (date: string) => {
    setAvailability((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((d) => d !== date),
    }));
  };

  const handleSaveAvailability = async () => {
    try {
      await updateDoctorAvailability(userId, availability);
      showToast("Availability updated", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Update failed", "error");
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">
            HealthLink Portal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {role === "doctor" ? "Doctor Workspace" : "Patient Dashboard"}
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {role === "doctor"
              ? "Stay on top of your consults and daily flow."
              : "Find specialists and manage your health with ease."}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="flex flex-wrap gap-3">
          <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl">
            <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-cyan-300/20 blur-2xl"></div>
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M12 15V3" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Visits
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {appointments.length} scheduled
                </p>
              </div>
            </div>
          </div>

          <div className="relative hidden overflow-hidden rounded-2xl border border-white/70 bg-white/70 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl sm:block">
            <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-emerald-300/20 blur-2xl"></div>
            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20" />
                  <path d="M2 12h20" />
                  <path d="M7 7h10v10H7z" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                  Specialists
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {doctors.length} active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Grid Section (For Patients) */}
      {role !== "doctor" && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Available Specialists
            </h3>
            <button className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-700 hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-60 animate-pulse rounded-[2rem] bg-white/70"
                  ></div>
                ))
              : doctors.map((doc) => (
                  <div
                    key={doc._id}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-7 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_26px_60px_rgba(15,23,42,0.15)]"
                  >
                    <div className="absolute -right-10 -top-12 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl transition group-hover:bg-cyan-300/40"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <span className="rounded-full border border-emerald-200/70 bg-emerald-50/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-emerald-600">
                          Verified
                        </span>
                      </div>
                      <h4 className="mt-5 text-lg font-semibold text-slate-900">
                        {doc.name}
                      </h4>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                        {doc.specialization || "General Medicine"}
                      </p>
                      <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                        Availability on profile
                      </p>
                      <button
                        onClick={() => handleBook(doc._id)}
                        className="mt-7 w-full rounded-2xl bg-slate-900 py-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_34px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 hover:bg-slate-800 active:scale-95"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* Availability Management (For Doctors) */}
      {role === "doctor" && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Availability
            </h3>
            <button
              onClick={handleSaveAvailability}
              className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Weekly Hours
              </p>
              <div className="mt-4 space-y-3">
                {availability.weeklyHours.map((slot, index) => (
                  <div
                    key={slot.day}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={slot.enabled}
                        onChange={(e) =>
                          handleWeeklyChange(
                            index,
                            "enabled",
                            e.target.checked,
                          )
                        }
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        {slot.day}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          handleWeeklyChange(index, "start", e.target.value)
                        }
                        className="rounded-lg border border-white/70 bg-white/70 px-2 py-1 text-xs text-slate-700"
                      />
                      <span className="text-xs text-slate-400">to</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          handleWeeklyChange(index, "end", e.target.value)
                        }
                        className="rounded-lg border border-white/70 bg-white/70 px-2 py-1 text-xs text-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.1)] backdrop-blur-xl">
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Blocked Dates
              </p>
              <div className="mt-4 flex items-center gap-3">
                <input
                  type="date"
                  value={newBlockedDate}
                  onChange={(e) => setNewBlockedDate(e.target.value)}
                  className="w-full rounded-xl border border-white/70 bg-white/70 px-3 py-2 text-xs text-slate-700"
                />
                <button
                  onClick={handleAddBlockedDate}
                  className="rounded-full border border-cyan-200/70 bg-cyan-50/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-700 transition hover:bg-cyan-600 hover:text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {availability.blockedDates.length === 0 && (
                  <span className="text-xs text-slate-400">
                    No blocked dates yet.
                  </span>
                )}
                {availability.blockedDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => handleRemoveBlockedDate(date)}
                    className="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-slate-600 hover:border-rose-200 hover:text-rose-600"
                  >
                    {date} x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Appointment Table Section */}
      <section className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/70 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-white/60 px-8 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-400">
              Timeline
            </p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">
              {role === "doctor" ? "Patient Consultations" : "Your Medical Visits"}
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-900/5 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              Live Updates
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/60 text-[9px] uppercase font-semibold tracking-[0.35em] text-slate-400">
                <th className="px-8 py-4">
                  {role === "doctor" ? "Patient Name" : "Specialist"}
                </th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/60 text-slate-600">
              {!isLoading && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <tr key={apt._id} className="transition hover:bg-white/70">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/10 text-slate-700">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-slate-900">
                          {role === "doctor"
                            ? apt.patient?.name
                            : apt.doctor?.name || "Unknown Doctor"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs">
                      {new Date(apt.appointmentDate).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span
                        className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] shadow-sm ${
                          apt.status?.toLowerCase() === "scheduled" ||
                          apt.status?.toLowerCase() === "booked"
                            ? "border-emerald-200/70 bg-emerald-50/70 text-emerald-600"
                            : "border-amber-200/70 bg-amber-50/70 text-amber-600"
                        }`}
                      >
                        {apt.status || "Confirmed"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleReschedule(apt._id)}
                          className="rounded-full border border-cyan-200/70 bg-cyan-50/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-cyan-700 transition hover:bg-cyan-600 hover:text-white"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(apt._id)}
                          className="rounded-full border border-rose-200/70 bg-rose-50/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-rose-600 transition hover:bg-rose-600 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : !isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/10 text-slate-700">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 4h18" />
                          <path d="M8 2v4" />
                          <path d="M16 2v4" />
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M8 10h8" />
                          <path d="M8 14h6" />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold text-slate-400">
                        No visits found in your record.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

