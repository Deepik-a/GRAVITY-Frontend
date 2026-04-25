import axios from "axios";
import { STATUS_CODES } from "@/shared/constants/StatusCodes";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow cookies (JWT tokens)
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried
    if (error.response?.status === STATUS_CODES.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Retry the request - backend will automatically refresh token using refresh token
      try {
        return await api(originalRequest);
      } catch (retryError) {
        // If retry also fails, then redirect to login
        if (retryError.response?.status === STATUS_CODES.UNAUTHORIZED) {
          // Capture role before clearing
          const role = localStorage.getItem("role");
          
          // Show toast notification before redirecting
          if (typeof window !== "undefined") {
            toast.error("Session expired. Please log in again.");
          }
          
          // Clear session on Unauthorized
          console.warn("Session expired or unauthorized. Clearing session.");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          localStorage.removeItem("companyProfile");
          localStorage.removeItem("adminId");

          // Redirect to login if not already there (with delay to allow toast to show)
          if (typeof window !== "undefined") {
             const path = window.location.pathname;
             
             // If already on a login/signup related page or the landing page, don't force a redirect
             if (path === "/" || path === "/Login" || path.includes("/signup")) {
                return Promise.reject(retryError);
             }
             
             // For protected paths, determine redirect based on stored role or current path
             const isAdmin = role === "admin" || path.startsWith("/Admin");
             
             // Delay redirect to allow toast to be visible
             setTimeout(() => {
                if (isAdmin) {
                   window.location.href = "/Login";
                } else {
                   window.location.href = "/signup?show=login";
                }
             }, 1500);
          }
        }
        return Promise.reject(retryError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
