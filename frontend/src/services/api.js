import axios from "axios";

// Changed localhost to 127.0.0.1 for better stability in Node environments
const API = axios.create({ baseURL: "http://127.0.0.1:5000/api" });

// Add the JWT token to headers for every request if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth Endpoints
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (userData) => API.post("/auth/login", userData);
export const getUsers = () => API.get("/auth/users");

// Appointment Endpoints
export const bookAppointment = (data) => API.post("/appointments/book", data);
export const getAppointments = () => API.get("/appointments");
export const cancelAppointment = (id) =>
  API.delete(`/appointments/cancel/${id}`);

export default API;
