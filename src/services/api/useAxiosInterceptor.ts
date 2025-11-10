import { useEffect } from "react";
import api from "./useApi";

export const useAxiosInterceptor = () => {
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
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);
};
