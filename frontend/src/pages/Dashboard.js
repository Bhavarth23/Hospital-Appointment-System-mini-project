import React, { useEffect, useState } from "react";
import {
  getUsers,
  bookAppointment,
  getAppointments,
  cancelAppointment,
} from "../services/api";

const Dashboard = ({ showToast }) => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const usersRes = await getUsers();
      setDoctors(
        usersRes.data.data.filter((u) => u.role.toLowerCase() === "doctor"),
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

  const handleBook = async (doctorId) => {
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
    } catch (err) {
      showToast(err.response?.data?.message || "Booking failed", "error");
    }
  };

  const handleCancel = async (id) => {
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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Dynamic Greeting & Stats Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {role === "doctor" ? "Doctor Portal" : "Patient Dashboard"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {role === "doctor"
              ? "Your schedule at a glance"
              : "Find specialists and manage your health."}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold">
              {appointments.length}
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">
                Visits
              </p>
              <p className="text-sm font-bold text-slate-700">Scheduled</p>
            </div>
          </div>
          <div className="hidden sm:flex bg-white px-6 py-4 rounded-3xl shadow-sm border border-slate-100 items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold">
              {doctors.length}
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">
                Active
              </p>
              <p className="text-sm font-bold text-slate-700">Specialists</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Doctor Grid Section (For Patients) */}
      {role !== "doctor" && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Available Specialists
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-64 bg-slate-100 animate-pulse rounded-[2rem]"
                  ></div>
                ))
              : doctors.map((doc) => (
                  <div
                    key={doc._id}
                    className="group bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 shadow-inner">
                        👨‍⚕️
                      </div>
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                        Verified
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-wider">
                      {doc.specialization || "General Medicine"}
                    </p>
                    <button
                      onClick={() => handleBook(doc._id)}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all shadow-lg shadow-slate-100 group-hover:shadow-blue-200 active:scale-95"
                    >
                      Book Appointment
                    </button>
                  </div>
                ))}
          </div>
        </section>
      )}

      {/* 3. Appointment Table Section */}
      <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden border border-slate-100">
        <div className="px-10 py-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-black text-slate-800">
            {role === "doctor"
              ? "Patient Consultations"
              : "Your Medical Visits"}
          </h3>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Live Updates
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-10 py-5">
                  {role === "doctor" ? "Patient Name" : "Specialist"}
                </th>
                <th className="px-10 py-5">Date</th>
                <th className="px-10 py-5 text-center">Status</th>
                <th className="px-10 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
              {!isLoading && appointments.length > 0 ? (
                appointments.map((apt) => (
                  <tr
                    key={apt._id}
                    className="hover:bg-slate-50/50 transition-all group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-xs">
                          👤
                        </div>
                        <span className="font-bold text-slate-900">
                          {role === "doctor"
                            ? apt.patientId?.name
                            : apt.doctorId?.name || "Dr. Staff"}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm">
                      {new Date(apt.appointmentDate).toLocaleDateString(
                        undefined,
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-10 py-6 text-center">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                          apt.status?.toLowerCase() === "scheduled" ||
                          apt.status?.toLowerCase() === "booked"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {apt.status || "Confirmed"}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => handleCancel(apt._id)}
                        className="px-4 py-2 text-rose-500 font-black text-xs uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              ) : !isLoading ? (
                <tr>
                  <td colSpan="4" className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-4">🗓️</span>
                      <p className="text-slate-400 font-bold italic">
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
