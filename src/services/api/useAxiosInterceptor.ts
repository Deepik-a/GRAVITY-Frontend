import { useEffect } from "react";
import api from "./useApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useAxiosInterceptor = () => {
    const router = useRouter();

  useEffect(() => {
    // Request interceptor: no need to manually attach tokens
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        // Cookies (accessToken, refreshToken) are automatically sent by the browser
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 errors (e.g., expired token)
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized - token expired or invalid");
          // Optionally, trigger re-login or silent refresh here
        }

        // ⛔ Handle Blocked User (403 + Specific Message)
        if (error.response?.status === 403 && error.response?.data?.message === "Your account has been blocked. Please contact admin.") {
            toast.error("You have been removed from the site, contact admin");
            
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [router]);
};
