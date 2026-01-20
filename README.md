# 🏥 HealthLink: Hospital Appointment System (MERN)

HealthLink is a modern, full-stack healthcare management application built using the **MERN** stack (MongoDB, Express.js, React, Node.js). The platform facilitates seamless interaction between patients and doctors, allowing for real-time appointment booking, schedule management, and automated status tracking.

## 🌟 Key Features
* **Dual-Role Authentication**: Secure login and registration for both Doctors and Patients with role-based access control.
* **Modern UI/UX**: Professional "Hospital Blue" theme integrated with Tailwind CSS for a responsive, clean interface.
* **Real-time Appointments**: Patients can browse specialists by department and book appointments instantly.
* **Live Dashboard**: Interactive table for managing upcoming visits with "Cancel" functionality.
* **Global Notification System**: Custom Toast alert system for instant user feedback on actions like Login and Booking.
* **Security**: Password hashing using Bcrypt and session management via JWT (JSON Web Tokens).

## 🛠️ Tech Stack
* **Frontend**: React.js, Tailwind CSS, Axios, React Router DOM.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Local instance at `127.0.0.1:27017`).
* **Authentication**: JWT, LocalStorage persistence.

## 📂 Project Structure
```bash
HOSPITAL-APPOINTMENT-SYSTEM/
├── backend/            # Express server & API routes
│   ├── controllers/    # Business logic (auth & appointments)
│   ├── models/         # MongoDB Schemas (User & Appointment)
│   ├── routes/         # API endpoint definitions
│   └── server.js       # Entry point
└── frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI (Toast, Navbar)
    │   ├── pages/      # Dashboard, Login, Register
    │   └── services/   # Axios API instance
    └── App.js          # Main routing & state management
