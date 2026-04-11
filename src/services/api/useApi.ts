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
      // Capture role before clearing
      const role = localStorage.getItem("role");
      
      // Clear session on Unauthorized
      console.warn("Session expired or unauthorized. Clearing session.");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("companyProfile");
      localStorage.removeItem("adminId");

      // Redirect to login if not already there
      if (typeof window !== "undefined") {
         const path = window.location.pathname;
         
         // If already on a login/signup related page or the landing page, don't force a redirect
         if (path === "/" || path === "/Login" || path.includes("/signup")) {
            return Promise.reject(error);
         }
         
         // For protected paths, determine redirect based on stored role or current path
         const isAdmin = role === "admin" || path.startsWith("/Admin");
         
         if (isAdmin) {
            window.location.href = "/Login";
         } else {
            window.location.href = "/signup?show=login";
         }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
