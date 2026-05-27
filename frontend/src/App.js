import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Admin Pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddEvent from "./pages/AddEvent";
import ManageEvents from "./pages/ManageEvents";
import ViewBookings from "./pages/ViewBookings";

// User Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MyBookings from "./pages/MyBookings";


import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <Routes>
        {/* User */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-event" element={<AddEvent />} />
        <Route path="/admin/manage-events" element={<ManageEvents />} />
        <Route path="/admin/bookings" element={<ViewBookings />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;