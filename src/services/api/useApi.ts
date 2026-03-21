import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow cookies (JWT tokens)
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear session on Unauthorized
      console.warn("Session expired or unauthorized. Clearing session.");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      // Optionally trigger a page reload or event to update context
      if (typeof window !== "undefined") {
         // Redirect to login if not already there
         if (!window.location.pathname.includes("/signup") && !window.location.pathname.includes("/Admin/login") && window.location.pathname !== "/") {
            window.location.href = "/signup?show=login";
         }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
