import axios from "axios";

// Base URL of backend
const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Admin APIs
export const adminLogin = (data) => API.post("/admin/login", data);
export const createAdmin = (data) => API.post("/admin/create", data);
export const createEvent = (data) => API.post("/events", data);
export const getEvents = () => API.get("/events");
export const deleteEvent = (id) => API.delete(`/events/${id}`);
export const getAllBookings = () => API.get("/bookings");
export const validateTicket = (data) => API.post("/bookings/validate", data);

// User APIs
export const registerUser = (data) => API.post("/user/register", data);
export const verifyOTP = (data) => API.post("/user/verify-otp", data);
export const loginUser = (data) => API.post("/user/login", data);
export const getUserBookings = (id) => API.get(`/bookings/user/${id}`);
export const bookTicket = (data) => API.post("/bookings", data);
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);
export const sendChatMessage = (data) => API.post("/chat", data);

export default API;
